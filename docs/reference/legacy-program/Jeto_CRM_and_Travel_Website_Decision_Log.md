# Jeto CRM + Travel Website — Decision Log

Record each decision with date, decider, reasoning and affected workstreams. Open items below are deliberately not treated as approved decisions.

| ID | Decision | Current status | Default recommendation | Impact if unresolved |
|---|---|---|---|---|
| D-001 | Enquiry-first website vs direct checkout | Open | Enquiry-first MVP; direct booking later after provider + payment validation | High: affects inventory, payment, cancellation, support and integration scope |
| D-002 | Public brand/domain | Assumption | Jeto Vacations only after ownership and brand approval | High: SEO, content, launch and legal footer |
| D-003 | Single company vs multi-agency tenancy | Open | Single company with team/branch access; add tenant boundary only if actual need exists | High: schema and auth complexity |
| D-004 | Authoritative legacy backend/database | Unknown | Verify from source and DB identity; no write failover between candidates | Critical: data integrity/migration |
| D-005 | Database schema and source repos | Missing | Obtain backend + frontend repository, migrations, schema and sanitized samples | Critical: blocks true route coverage and migration mapping |
| D-006 | Flight/hotel provider capabilities | Open | Build provider adapters; enable only integrations with confirmed credentials/contracts | High: booking correctness and schedule |
| D-007 | Payments, tax, refund and commission rules | Open | Have finance/accounting owner approve rules and test cases | High: financial correctness/compliance |
| D-008 | Initial destinations and package catalogue | Open | Launch with a small curated set approved by commercial owner | Medium: content work/SEO |
| D-009 | Brand assets/photo licensing | Open | Use owned/licensed originals; no scraped competitor imagery | High: legal and brand |
| D-010 | Customer portal required at launch | Open | Defer; launch enquiry flow first | Medium: auth/privacy and added product surface |
| D-011 | AI usage boundaries | Open | Suggestive assistance with human review; no unattended financial/provider actions | High: operational risk |
| D-012 | Staffing and launch window | Unknown | Re-estimate after 2-week discovery; schedule is currently a 22–30-week planning range | High: budget and delivery commitments |
