# ADR D-005: Persistent Digital Proposal Architecture & Schema

## Status
Proposed (Pre-Implementation Architectural Specification)

## Context
Holiday proposals generated for prospective clients (`/proposal/[id]`) represent high-value sales touchpoints. In previous mock implementations:
1. Hardcoded mock records ("Aditya & Family") risked leaking or misrepresenting confidential customer data.
2. In-memory `localStorage` attempts violated client privacy and failed across devices (e.g. consultant generates proposal on desktop, client opens it on mobile).
3. The current codebase safely protects privacy by displaying the secure "Proposal Not Found or Expired" notice for any unverified ID.

To transition from this guarded state to a fully functional, multi-device proposal system without compromising client confidentiality, a dedicated backend architecture with cryptographically secure tokens and Row-Level Security (RLS) is required.

## Decision

### 1. Database & Infrastructure Choice
- **Platform**: Supabase (Managed PostgreSQL) with native Row-Level Security (RLS).
- **Authentication**: Supabase Auth (JWT) for internal Jeto travel designers/consultants.
- **Client Access**: Token-based unauthenticated read via cryptographically random URL-safe tokens (24-character Nanoid / UUID v4). Clients never need to create accounts.

### 2. Data Model & Entity Relations
- **`consultants`**: Identity table mapping to `auth.users`, storing consultant name, direct WhatsApp concierge number, and role (`consultant`, `manager`, `admin`).
- **`proposals`**: Root entity containing client metadata, departure city, destination, total Pax, transparent pricing, payment milestones, and expiration timestamps (`expires_at`).
- **`proposal_itinerary_days`**: Normalized 1-to-many table mapping day numbers to hotel tiers, meal plans, private transfers, and curated daily activities.
- **`proposal_access_logs`**: Zero-PII analytics recording anonymized IP hashes (`SHA-256`) and timestamps to notify consultants when a client reviews their proposal.

### 3. Security & Access Control (RLS)
1. **Client Privacy Guarantee**: Clients can only SELECT a proposal if `status = 'published'` and `expires_at > NOW()`, queried strictly by exact `token`.
2. **Consultant Isolation**: Authenticated consultants can only INSERT/UPDATE proposals linked to their own `consultant_id = auth.uid()`.
3. **Internal Note Redaction**: Public API views omit `internal_notes` and client phone/email to prevent exposure of sensitive commercial notes.
4. **Expiry & Revocation**: Expired (`expires_at < NOW()`) or revoked proposals instantly revert to rendering the secure "Proposal Not Found or Expired" screen.

### 4. API Endpoints Contract
- `GET /api/proposals/[token]`: Rate-limited client endpoint returning verified proposal blueprint.
- `POST /api/consultant/proposals`: Authenticated endpoint creating proposal and returning shareable WhatsApp URL.
- `POST /api/proposals/[token]/accept`: Client one-click action triggering instant WhatsApp confirmation to the assigned consultant.

## Consequences
- **Positive**: Enables genuine luxury proposal sharing across mobile and desktop without exposing PII.
- **Positive**: Gives consultants real-time insight into when proposals are opened.
- **Positive**: Complies with Indian DPDP Act and GDPR standards via zero-PII client viewing and strict token expiry.
- **Blocker**: Requires provisioning a Supabase or PostgreSQL project with environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) before activating live persistence.
