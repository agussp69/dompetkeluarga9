-- RPC: get_family_totals
-- Menghitung total pemasukan dan pengeluaran keluarga di sisi server (DB aggregate)
-- Menggantikan pendekatan limit(10000) di dashboard frontend

CREATE OR REPLACE FUNCTION public.get_family_totals(p_family_id UUID)
RETURNS TABLE(total_income NUMERIC, total_expense NUMERIC)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
  FROM public.transactions
  WHERE family_id = p_family_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_family_totals(UUID) TO authenticated;

-- RPC: get_admin_monthly_report
-- Agregasi transaksi per bulan untuk admin laporan — hindari baca seluruh tabel tanpa batas
CREATE OR REPLACE FUNCTION public.get_admin_monthly_report(p_from DATE DEFAULT (CURRENT_DATE - INTERVAL '2 years'))
RETURNS TABLE(
  month_key TEXT,
  total_income NUMERIC,
  total_expense NUMERIC
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    TO_CHAR(occurred_at, 'YYYY-MM') AS month_key,
    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
  FROM public.transactions
  WHERE occurred_at >= p_from
  GROUP BY TO_CHAR(occurred_at, 'YYYY-MM')
  ORDER BY month_key;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_monthly_report(DATE) TO authenticated;
