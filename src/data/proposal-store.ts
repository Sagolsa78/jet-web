/**
 * Proposal Store Interface
 *
 * NOTE: For compliance and customer privacy, customer PII (names, phone numbers, emails)
 * is NEVER stored in browser localStorage.
 * Production proposal records are stored in the CRM/database and retrieved via secure server actions.
 */

export interface ProposalRecord {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  destination: string;
  departureCity: string;
  travelMonth: string;
  adults: number;
  children: number;
  budgetRange: string;
  travelStyle: string;
  notes: string;
  contactChannel: string;
  packageTitle?: string;
}

// Deprecated no-op: LocalStorage persistence of customer PII is removed
export function saveProposalToStorage(): void {
  // Deliberately no-op: Do NOT store customer PII in browser localStorage
}

export function getProposalFromStorage(id: string): ProposalRecord | null {
  if (!id) return null;
  // Non-verified or unknown proposal IDs return null
  // The UI displays the verified "Proposal Not Found or Expired" notice
  return null;
}
