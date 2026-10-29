# ADR D-004: Proposal Privacy & Fallback Elimination

## Status
Accepted

## Context
The `/proposal/[id]` route renders bespoke luxury trip proposals created by consultants for specific clients. In earlier mock versions, querying an invalid or missing proposal ID defaulted to displaying a hardcoded dummy proposal for a simulated client named "Aditya & Family".

In a customer-facing environment, rendering a dummy client's names, dates, and budget when a customer mistypes a proposal link or opens an expired link violates professional standards and could be mistaken for a real customer's leaked proposal.

## Decision
1. **Elimination of Mock Fallback**: `src/data/proposal-store.ts` returns `null` for any proposal ID that does not match an active record.
2. **Secure Expired / Not Found Screen**: `src/app/proposal/[id]/page.tsx` renders a clean, branded "Proposal Not Found or Expired" notice with a direct link to the bespoke holiday designer (`/custom-holiday`) and a direct WhatsApp button to reach the concierge desk.

## Consequences
- Protects client privacy and avoids customer confusion.
- Clear error handling for expired or mistyped links.
- Sets the stage for production database or CRM proposal API integration.
