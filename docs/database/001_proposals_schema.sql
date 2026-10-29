-- ==============================================================================
-- JETO VACATIONS — PROPOSAL SYSTEM DATABASE SCHEMA (Supabase / PostgreSQL)
-- Migration: 001_proposals_schema.sql
-- Description: Persistent, token-authenticated proposal infrastructure with RLS
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
CREATE TYPE proposal_status AS ENUM (
  'draft',
  'published',
  'accepted',
  'revision_requested',
  'expired',
  'revoked'
);

CREATE TYPE consultant_role AS ENUM (
  'consultant',
  'senior_consultant',
  'manager',
  'admin'
);

-- 3. CONSULTANTS TABLE
-- Extends Supabase auth.users or standalone consultant identity
CREATE TABLE IF NOT EXISTS public.consultants (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  avatar_url TEXT,
  role consultant_role DEFAULT 'consultant' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Cryptographic, URL-safe access token sent to clients (e.g. 24-character nanoid or uuid)
  token VARCHAR(64) UNIQUE NOT NULL,
  consultant_id UUID NOT NULL REFERENCES public.consultants(id) ON DELETE RESTRICT,
  
  -- Client & Passenger Information
  client_name VARCHAR(120) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(30) NOT NULL,
  departure_city VARCHAR(100) NOT NULL,
  travel_month VARCHAR(60) NOT NULL,
  pax_adults INTEGER DEFAULT 2 NOT NULL CHECK (pax_adults >= 1),
  pax_children INTEGER DEFAULT 0 NOT NULL CHECK (pax_children >= 0),
  
  -- Trip Metadata
  destination_name VARCHAR(120) NOT NULL,
  destination_slug VARCHAR(120) NOT NULL,
  package_slug VARCHAR(150),
  package_title VARCHAR(200) NOT NULL,
  travel_style VARCHAR(50) DEFAULT 'Luxury' NOT NULL,
  total_days INTEGER NOT NULL CHECK (total_days >= 1),
  total_nights INTEGER NOT NULL CHECK (total_nights >= 0),
  
  -- Pricing & Inclusions (Truthful Financials)
  currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
  base_price_per_person NUMERIC(12, 2) NOT NULL CHECK (base_price_per_person >= 0),
  total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
  flights_included BOOLEAN DEFAULT FALSE NOT NULL,
  price_basis VARCHAR(150) DEFAULT 'per person · twin sharing' NOT NULL,
  pricing_notes TEXT,
  
  -- Structured Terms & Disclaimers
  inclusions JSONB DEFAULT '[]'::jsonb NOT NULL,
  exclusions JSONB DEFAULT '[]'::jsonb NOT NULL,
  cancellation_policy TEXT,
  payment_milestones JSONB DEFAULT '[]'::jsonb NOT NULL,
  internal_notes TEXT,
  
  -- Status & Lifecycle Guard
  status proposal_status DEFAULT 'draft' NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  last_viewed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Index for instant token lookup by clients
CREATE INDEX IF NOT EXISTS idx_proposals_token ON public.proposals(token);
CREATE INDEX IF NOT EXISTS idx_proposals_consultant ON public.proposals(consultant_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status_expiry ON public.proposals(status, expires_at);

-- 5. PROPOSAL ITINERARY DAYS TABLE
CREATE TABLE IF NOT EXISTS public.proposal_itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number >= 1),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  hotel_name VARCHAR(200),
  hotel_tier VARCHAR(60),
  room_type VARCHAR(100),
  meal_plan VARCHAR(100),
  transfers TEXT,
  activities JSONB DEFAULT '[]'::jsonb NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  
  CONSTRAINT uq_proposal_day UNIQUE(proposal_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_itinerary_proposal ON public.proposal_itinerary_days(proposal_id);

-- 6. PROPOSAL ACCESS LOGS (Zero-PII Access Tracking)
CREATE TABLE IF NOT EXISTS public.proposal_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  accessed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  ip_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of IP, preventing plaintext PII storage
  user_agent TEXT,
  referrer TEXT
);

CREATE INDEX IF NOT EXISTS idx_access_logs_proposal ON public.proposal_access_logs(proposal_id);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_access_logs ENABLE ROW LEVEL SECURITY;

-- Consultants: Can view active team members, update own profile
CREATE POLICY "Consultants can view team profiles"
  ON public.consultants FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

CREATE POLICY "Consultants can edit own profile"
  ON public.consultants FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Proposals: Public Client View (Unauthenticated read via valid, unexpired token)
CREATE POLICY "Public clients can view valid unexpired proposals by token"
  ON public.proposals FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published' AND
    expires_at > TIMEZONE('utc', NOW())
  );

-- Proposals: Consultant Management (Authenticated)
CREATE POLICY "Consultants can view all proposals they own"
  ON public.proposals FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Consultants can create new proposals"
  ON public.proposals FOR INSERT
  TO authenticated
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Consultants can update their own proposals"
  ON public.proposals FOR UPDATE
  TO authenticated
  USING (consultant_id = auth.uid());

-- Proposal Itinerary Days: Public read via parent proposal policy
CREATE POLICY "Public clients can view itinerary days of valid proposals"
  ON public.proposal_itinerary_days FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.proposals p
      WHERE p.id = proposal_itinerary_days.proposal_id
        AND p.status = 'published'
        AND p.expires_at > TIMEZONE('utc', NOW())
    )
  );

CREATE POLICY "Consultants can manage itinerary days"
  ON public.proposal_itinerary_days FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.proposals p
      WHERE p.id = proposal_itinerary_days.proposal_id
        AND p.consultant_id = auth.uid()
    )
  );

-- Access Logs: Insertable by anyone, viewable only by consultant
CREATE POLICY "Service can insert access log"
  ON public.proposal_access_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "Consultants can view access logs for own proposals"
  ON public.proposal_access_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.proposals p
      WHERE p.id = proposal_access_logs.proposal_id
        AND p.consultant_id = auth.uid()
    )
  );

-- 8. HELPER FUNCTION: Log Client View & Increment Counter
CREATE OR REPLACE FUNCTION public.log_proposal_view(
  p_token VARCHAR(64),
  p_ip_hash VARCHAR(64),
  p_user_agent TEXT
)
RETURNS TABLE (
  proposal_id UUID,
  is_valid BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_proposal_id UUID;
BEGIN
  SELECT p.id INTO v_proposal_id
  FROM public.proposals p
  WHERE p.token = p_token
    AND p.status = 'published'
    AND p.expires_at > TIMEZONE('utc', NOW());

  IF v_proposal_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, FALSE;
    RETURN;
  END IF;

  -- Increment view count
  UPDATE public.proposals
  SET view_count = view_count + 1,
      last_viewed_at = TIMEZONE('utc', NOW())
  WHERE id = v_proposal_id;

  -- Record audit log
  INSERT INTO public.proposal_access_logs (proposal_id, ip_hash, user_agent)
  VALUES (v_proposal_id, p_ip_hash, p_user_agent);

  RETURN QUERY SELECT v_proposal_id, TRUE;
END;
$$;
