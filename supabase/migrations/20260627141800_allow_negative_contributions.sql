-- Hapus batasan check constraint amount > 0 pada tabel savings_contributions
ALTER TABLE public.savings_contributions DROP CONSTRAINT IF EXISTS savings_contributions_amount_check;
