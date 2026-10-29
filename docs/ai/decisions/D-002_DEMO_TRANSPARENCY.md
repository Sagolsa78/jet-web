# ADR D-002: Transparent Enquiry Simulation & Demo Mode Contract

## Status
Accepted

## Context
When running locally or on a staging environment without configured CRM credentials (`CRM_WEBHOOK_URL`), the website must allow visitors and developers to test the quote modal without crashing. 

Previously, the mock adapter generated a random ID and displayed a message stating that a Jeto travel consultant would contact the user within 2 hours. If a real user submitted an enquiry in demo mode, their enquiry would be lost while believing it was successfully received by sales.

## Decision
1. **Explicit Schema Flag**: `CRMLeadResponse` and server action responses include an explicit `isDemo: boolean` flag and format demo IDs as `DEMO-xxxx`.
2. **Honest UI Notification**: When `isDemo: true`, `RequestQuoteModal.tsx` renders an amber alert clearly stating:
   *"Demo Mode Notice: This is a demonstration submission. Your enquiry was processed locally and has not been transmitted to the Jeto sales team. To speak with a consultant immediately, connect via WhatsApp."*
3. **Instant WhatsApp Action**: The modal displays a direct one-click WhatsApp button pre-filled with all form fields so the user can immediately transmit their enquiry to a real consultant.

## Consequences
- Protects commercial trust and prevents lost customer leads.
- Allows flawless end-to-end testing without polluting production CRM lead pipelines.
- Transparent and self-documenting for QA engineers and stakeholders.
