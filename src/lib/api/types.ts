export type ApiResponse<T> =
  | { data: T; success: true }
  | { data: null; error: string; success: false };

export interface CRMLeadResponse {
  leadId: string;
  status: 'created' | 'duplicate' | 'error';
  message: string;
  isDemo: boolean;
  whatsAppDirectUrl?: string;
}

import type { EnquiryFormData } from '@/lib/validations/enquiry';

export type CallbackLead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  destination?: string;
  packageId?: string;
  packageTitle?: string;
  travelMonth?: string;
  travellers?: number;
  budget?: string;
  notes?: string;
  source: 'header' | 'package_card' | 'package_detail' | 'exit_popup' | 'website';
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  consent: true;
  createdAt: string;
};

export type PublicEnquiryPayload = EnquiryFormData & {
  source: 'website';
  landingPage: string;
  timestamp: string;
};