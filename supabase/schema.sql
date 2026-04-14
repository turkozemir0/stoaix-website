-- STOAIX Affiliate Program — Supabase Schema
-- Run this in Supabase SQL editor

-- ─── Affiliates ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS affiliates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  plan            TEXT NOT NULL DEFAULT 'standard'
                  CHECK (plan IN ('standard', 'wl_basic', 'wl_pro')),
  tier            TEXT NOT NULL DEFAULT 'starter'
                  CHECK (tier IN ('starter', 'growth', 'pro')),
  status          TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'suspended')),
  payout_info     JSONB DEFAULT '{}',
  is_admin        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Referrals ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id    UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  visitor_ip      TEXT,
  lead_email      TEXT,
  converted_at    TIMESTAMPTZ,
  customer_id     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Commissions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id    UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  referral_id     UUID REFERENCES affiliate_referrals(id),
  amount          NUMERIC(10,2) NOT NULL,
  commission_rate NUMERIC(5,2) NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'paid')),
  period_month    TEXT NOT NULL,          -- e.g. '2026-04'
  stripe_invoice_id TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Payouts ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id    UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  total           NUMERIC(10,2) NOT NULL,
  method          TEXT NOT NULL DEFAULT 'bank_transfer',
  paid_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate ON affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_customer  ON affiliate_referrals(customer_id);
CREATE INDEX IF NOT EXISTS idx_commissions_affiliate ON affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status    ON affiliate_commissions(status);

-- ─── Helper: active client count per affiliate ───────────
CREATE OR REPLACE VIEW affiliate_active_clients AS
  SELECT
    affiliate_id,
    COUNT(*) AS active_count
  FROM affiliate_referrals
  WHERE converted_at IS NOT NULL
    AND customer_id IS NOT NULL
  GROUP BY affiliate_id;

-- ─── Helper: tier thresholds ─────────────────────────────
-- Starter:  1–5  active clients → 10%
-- Growth:   5–10 active clients → 20%
-- Pro:      10–20 active clients → 30%
-- WL plans always → 40%
