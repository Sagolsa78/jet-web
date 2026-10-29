# Next Task: Live CRM Endpoint Contract Verification & Interactive Journey Testing

---

## 1. Task Objective
Verify live CRM API/webhook integration against staging credentials from the CRM desk, followed by end-to-end smoke verification of the customer callback journey on mobile and desktop viewports.

---

## 2. Background & Problem Statement
Sprint 1 completed all local stabilization, security safeguards, mode separation, and mock webhook tests:
- In demo/development mode: honest disclosures and `DEMO-xxxx` IDs are displayed.
- In production mode: missing CRM credentials safely return an explicit maintenance/configuration error rather than silent fakes.
- Webhook dispatch with HMAC-SHA256 signatures was verified in `tests/crm-adapter.test.mjs`.

The next step before production launch requires verifying real lead intake with the CRM team and running end-to-end journey checks.

---

## 3. Scope of Work

### In Scope
1. **CRM Contract Verification**:
   - Obtain official `CRM_WEBHOOK_URL` (or `JETO_CRM_API_BASE_URL`) and `CRM_WEBHOOK_SECRET` from the sales/CRM team.
   - Test live lead dispatch against CRM sandbox/staging endpoint.
   - Confirm CRM field mapping (name, phone, destination, packageId, budget, travelMonth, pax).
2. **Interactive UI QA**:
   - Verify modal keyboard accessibility (`Escape` key, focus trapping, tab index).
   - Test sticky mobile conversion bar across iOS Safari and Android Chrome viewports.
   - Verify WhatsApp deep-link generation across mobile browsers.
3. **Proposal Backend Architecture (ADR & Schema Design)**:
   - Design persistent database schema (PostgreSQL / Supabase) for authenticated travel consultant proposal generation with token expiry.

### Out of Scope
- Direct production database migrations until credentials are provisioned.
- Design overhauls or palette modifications.

---

## 4. Acceptance Criteria
- [ ] CRM endpoint contract and payload schema confirmed with CRM owner.
- [ ] Test lead submitted to staging webhook and verified in CRM dashboard.
- [ ] 0 lint errors, 0 type errors, and 100% passing automated test suite (23+ tests).
- [ ] `docs/ai/CURRENT_STATE.md` updated with CRM staging status.
