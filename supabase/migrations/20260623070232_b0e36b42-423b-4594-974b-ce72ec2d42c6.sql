
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'owner', 'anggota');
CREATE TYPE public.txn_type AS ENUM ('income', 'expense');
CREATE TYPE public.notif_type AS ENUM ('budget_warning','budget_exceeded','goal_reached','reminder','member_activity','report_ready','invitation','info');
CREATE TYPE public.invitation_status AS ENUM ('pending','accepted','revoked','expired');
CREATE TYPE public.user_status AS ENUM ('active','suspended');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  active_family_id UUID,
  timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
  language TEXT NOT NULL DEFAULT 'id',
  notif_prefs JSONB NOT NULL DEFAULT '{"email":true,"in_app":true}'::jsonb,
  status public.user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER_ROLES (system-level) ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- ============ FAMILIES ============
CREATE TABLE public.families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'IDR',
  created_by UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.families TO authenticated;
GRANT ALL ON public.families TO service_role;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

-- ============ FAMILY_MEMBERS ============
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'anggota',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(family_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_members TO authenticated;
GRANT ALL ON public.family_members TO service_role;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_family_member(_user_id UUID, _family_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.family_members WHERE user_id = _user_id AND family_id = _family_id)
$$;

CREATE OR REPLACE FUNCTION public.is_family_owner(_user_id UUID, _family_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.family_members WHERE user_id = _user_id AND family_id = _family_id AND role = 'owner')
$$;

-- Profiles policies
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin') OR EXISTS(
    SELECT 1 FROM public.family_members fm1
    JOIN public.family_members fm2 ON fm1.family_id = fm2.family_id
    WHERE fm1.user_id = auth.uid() AND fm2.user_id = profiles.id
  ));
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles admin all" ON public.profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- user_roles policies
CREATE POLICY "user_roles self read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "user_roles admin manage" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Families policies
CREATE POLICY "families member read" ON public.families FOR SELECT TO authenticated USING (public.is_family_member(auth.uid(), id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "families create" ON public.families FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "families owner update" ON public.families FOR UPDATE TO authenticated USING (public.is_family_owner(auth.uid(), id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "families owner delete" ON public.families FOR DELETE TO authenticated USING (public.is_family_owner(auth.uid(), id) OR public.has_role(auth.uid(),'admin'));

-- family_members policies
CREATE POLICY "fm read" ON public.family_members FOR SELECT TO authenticated USING (public.is_family_member(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "fm insert" ON public.family_members FOR INSERT TO authenticated WITH CHECK (public.is_family_owner(auth.uid(), family_id) OR user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "fm update" ON public.family_members FOR UPDATE TO authenticated USING (public.is_family_owner(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "fm delete" ON public.family_members FOR DELETE TO authenticated USING (public.is_family_owner(auth.uid(), family_id) OR user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- ============ CATEGORIES ============
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families ON DELETE CASCADE,
  name TEXT NOT NULL,
  type public.txn_type NOT NULL,
  icon TEXT,
  color TEXT,
  is_global BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories read" ON public.categories FOR SELECT TO authenticated USING (is_global OR public.is_family_member(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "categories family write" ON public.categories FOR INSERT TO authenticated WITH CHECK ((NOT is_global AND public.is_family_member(auth.uid(), family_id)) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "categories family update" ON public.categories FOR UPDATE TO authenticated USING ((NOT is_global AND public.is_family_member(auth.uid(), family_id)) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "categories family delete" ON public.categories FOR DELETE TO authenticated USING ((NOT is_global AND public.is_family_member(auth.uid(), family_id)) OR public.has_role(auth.uid(),'admin'));

-- ============ TRANSACTIONS (unified) ============
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type public.txn_type NOT NULL,
  amount NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
  category_id UUID REFERENCES public.categories ON DELETE SET NULL,
  occurred_at DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  note TEXT,
  tags TEXT[],
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_txn_family_date ON public.transactions(family_id, occurred_at DESC);
CREATE INDEX idx_txn_family_type ON public.transactions(family_id, type);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "txn read" ON public.transactions FOR SELECT TO authenticated USING (public.is_family_member(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "txn insert" ON public.transactions FOR INSERT TO authenticated WITH CHECK (public.is_family_member(auth.uid(), family_id) AND user_id = auth.uid());
CREATE POLICY "txn update" ON public.transactions FOR UPDATE TO authenticated USING (public.is_family_member(auth.uid(), family_id) AND (user_id = auth.uid() OR public.is_family_owner(auth.uid(), family_id)));
CREATE POLICY "txn delete" ON public.transactions FOR DELETE TO authenticated USING (public.is_family_member(auth.uid(), family_id) AND (user_id = auth.uid() OR public.is_family_owner(auth.uid(), family_id)));

-- ============ BUDGETS ============
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families ON DELETE CASCADE,
  year INT NOT NULL,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  created_by UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(family_id, year, month)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budgets TO authenticated;
GRANT ALL ON public.budgets TO service_role;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "budgets read" ON public.budgets FOR SELECT TO authenticated USING (public.is_family_member(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "budgets write" ON public.budgets FOR ALL TO authenticated USING (public.is_family_owner(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin')) WITH CHECK (public.is_family_owner(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budgets ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories ON DELETE SET NULL,
  label TEXT NOT NULL,
  amount NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bi_budget ON public.budget_items(budget_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budget_items TO authenticated;
GRANT ALL ON public.budget_items TO service_role;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bi read" ON public.budget_items FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND (public.is_family_member(auth.uid(), b.family_id) OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "bi write" ON public.budget_items FOR ALL TO authenticated USING (EXISTS(SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND (public.is_family_owner(auth.uid(), b.family_id) OR public.has_role(auth.uid(),'admin')))) WITH CHECK (EXISTS(SELECT 1 FROM public.budgets b WHERE b.id = budget_id AND (public.is_family_owner(auth.uid(), b.family_id) OR public.has_role(auth.uid(),'admin'))));

-- ============ SAVINGS GOALS ============
CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(18,2) NOT NULL CHECK (target_amount > 0),
  deadline DATE,
  priority INT NOT NULL DEFAULT 2,
  note TEXT,
  created_by UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.savings_goals TO authenticated;
GRANT ALL ON public.savings_goals TO service_role;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "goals read" ON public.savings_goals FOR SELECT TO authenticated USING (public.is_family_member(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "goals write" ON public.savings_goals FOR ALL TO authenticated USING (public.is_family_member(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin')) WITH CHECK (public.is_family_member(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.savings_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.savings_goals ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount NUMERIC(18,2) NOT NULL CHECK (amount > 0),
  contributed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.savings_contributions TO authenticated;
GRANT ALL ON public.savings_contributions TO service_role;
ALTER TABLE public.savings_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sc read" ON public.savings_contributions FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM public.savings_goals g WHERE g.id = goal_id AND (public.is_family_member(auth.uid(), g.family_id) OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "sc write" ON public.savings_contributions FOR ALL TO authenticated USING (EXISTS(SELECT 1 FROM public.savings_goals g WHERE g.id = goal_id AND (public.is_family_member(auth.uid(), g.family_id) OR public.has_role(auth.uid(),'admin')))) WITH CHECK (EXISTS(SELECT 1 FROM public.savings_goals g WHERE g.id = goal_id AND (public.is_family_member(auth.uid(), g.family_id) OR public.has_role(auth.uid(),'admin'))));

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  family_id UUID REFERENCES public.families ON DELETE CASCADE,
  type public.notif_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_user ON public.notifications(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif self" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "notif self update" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notif self delete" ON public.notifications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- ============ INVITATIONS ============
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families ON DELETE CASCADE,
  email TEXT NOT NULL,
  role public.app_role NOT NULL DEFAULT 'anggota',
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16),'hex'),
  status public.invitation_status NOT NULL DEFAULT 'pending',
  invited_by UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '14 days'
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitations TO authenticated;
GRANT ALL ON public.invitations TO service_role;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv read" ON public.invitations FOR SELECT TO authenticated USING (
  public.is_family_owner(auth.uid(), family_id)
  OR LOWER(email) = LOWER(COALESCE((SELECT email FROM public.profiles WHERE id = auth.uid()),''))
  OR public.has_role(auth.uid(),'admin')
);
CREATE POLICY "inv write" ON public.invitations FOR ALL TO authenticated USING (public.is_family_owner(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin')) WITH CHECK (public.is_family_owner(auth.uid(), family_id) OR public.has_role(auth.uid(),'admin'));

-- ============ AUDIT LOGS ============
CREATE TABLE public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  family_id UUID REFERENCES public.families ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit admin read" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR (family_id IS NOT NULL AND public.is_family_owner(auth.uid(), family_id)));
CREATE POLICY "audit insert" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- ============ BUDGET TEMPLATES (admin-managed) ============
CREATE TABLE public.budget_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.budget_templates TO authenticated;
GRANT ALL ON public.budget_templates TO service_role;
ALTER TABLE public.budget_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tpl read all" ON public.budget_templates FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "tpl admin write" ON public.budget_templates FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_families_updated BEFORE UPDATE ON public.families FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_txn_updated BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_goals_updated BEFORE UPDATE ON public.savings_goals FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ handle_new_user: profile + default family + role ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_family_id UUID;
  user_count INT;
  display_name TEXT;
BEGIN
  display_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1));

  INSERT INTO public.profiles(id, full_name, email)
  VALUES (NEW.id, display_name, NEW.email)
  ON CONFLICT (id) DO NOTHING;

  -- First registered user becomes system admin
  SELECT count(*) INTO user_count FROM auth.users;
  IF user_count <= 1 THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;

  -- Create default family for this user
  INSERT INTO public.families(name, created_by)
  VALUES ('Keluarga ' || display_name, NEW.id)
  RETURNING id INTO new_family_id;

  INSERT INTO public.family_members(family_id, user_id, role)
  VALUES (new_family_id, NEW.id, 'owner');

  UPDATE public.profiles SET active_family_id = new_family_id WHERE id = NEW.id;

  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ Audit trigger for transactions ============
CREATE OR REPLACE FUNCTION public.audit_txn() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.audit_logs(user_id, family_id, action, entity, entity_id, meta)
  VALUES (
    auth.uid(),
    COALESCE(NEW.family_id, OLD.family_id),
    TG_OP,
    'transaction',
    COALESCE(NEW.id, OLD.id)::TEXT,
    jsonb_build_object('type', COALESCE(NEW.type, OLD.type), 'amount', COALESCE(NEW.amount, OLD.amount))
  );
  RETURN COALESCE(NEW, OLD);
END $$;
CREATE TRIGGER trg_audit_txn AFTER INSERT OR UPDATE OR DELETE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.audit_txn();

-- ============ Seed global categories ============
INSERT INTO public.categories(name, type, is_global, icon) VALUES
  ('Gaji','income',TRUE,'wallet'),
  ('Bonus','income',TRUE,'gift'),
  ('Freelance','income',TRUE,'briefcase'),
  ('Bisnis','income',TRUE,'store'),
  ('THR','income',TRUE,'gift'),
  ('Hadiah','income',TRUE,'gift'),
  ('Investasi','income',TRUE,'trending-up'),
  ('Lainnya','income',TRUE,'circle'),
  ('Belanja','expense',TRUE,'shopping-bag'),
  ('Makanan','expense',TRUE,'utensils'),
  ('Transportasi','expense',TRUE,'car'),
  ('Cicilan','expense',TRUE,'credit-card'),
  ('Pendidikan Anak','expense',TRUE,'graduation-cap'),
  ('Kesehatan','expense',TRUE,'heart-pulse'),
  ('Dana Darurat','expense',TRUE,'shield'),
  ('Hiburan','expense',TRUE,'tv'),
  ('Tagihan','expense',TRUE,'receipt'),
  ('Internet','expense',TRUE,'wifi'),
  ('Listrik','expense',TRUE,'plug'),
  ('Air','expense',TRUE,'droplet'),
  ('Sedekah','expense',TRUE,'hand-heart'),
  ('Pajak','expense',TRUE,'landmark'),
  ('Lainnya','expense',TRUE,'circle');

-- Foreign key for profiles.active_family_id (added after families exists)
ALTER TABLE public.profiles ADD CONSTRAINT profiles_active_family_fk FOREIGN KEY (active_family_id) REFERENCES public.families(id) ON DELETE SET NULL;
