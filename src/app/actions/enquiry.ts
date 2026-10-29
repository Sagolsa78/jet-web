'use server';

import { headers } from 'next/headers';
import { crmAdapter } from '@/lib/api/crm-adapter';
import type { PublicEnquiryPayload, CallbackLead } from '@/lib/api/types';
import {
  checkRateLimit,
  checkPhoneThrottle,
  normalizeClientIp,
} from '@/lib/security/rate-limiter';
import {
  enquirySchema,
  callbackLeadSchema,
  type EnquiryFormData,
  type CallbackLeadFormData,
} from '@/lib/validations/enquiry';
import { z } from 'zod';

export async function submitCallbackLeadAction(formData: CallbackLeadFormData) {
  try {
    // 1. Server-side Rate Limiting
    const headerList = await headers();
    const rawIp = headerList.get('x-forwarded-for') || headerList.get('x-real-ip');
    const clientIp = normalizeClientIp(rawIp);

    if (!checkRateLimit(clientIp)) {
      return {
        success: false,
        error:
          'Too many callback requests from this network. Please wait a few moments or connect directly via WhatsApp.',
      };
    }

    // 2. Validate input
    const validatedData = callbackLeadSchema.parse(formData);

    // 3. Honeypot check - silently discard bot spam
    if (validatedData.honeypot && validatedData.honeypot.trim().length > 0) {
      return {
        success: true,
        isDemo: true,
        message: 'Callback request registered.',
        leadId: 'BOT-FILTERED',
      };
    }

    // 4. Duplicate phone throttle
    if (!checkPhoneThrottle(validatedData.phone)) {
      return {
        success: false,
        error:
          'A callback request with this phone number was recently registered. A travel expert is already queued to assist you.',
      };
    }

    // 5. Construct CallbackLead model
    const lead: CallbackLead = {
      id: `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: validatedData.name,
      phone: validatedData.phone,
      email: validatedData.email || undefined,
      destination: validatedData.destination || undefined,
      packageId: validatedData.packageId || undefined,
      packageTitle: validatedData.packageTitle || undefined,
      travelMonth: validatedData.travelMonth || undefined,
      travellers: validatedData.travellers,
      budget: validatedData.budget || undefined,
      notes: validatedData.notes || undefined,
      source: validatedData.source || 'website',
      status: 'new',
      consent: true,
      createdAt: new Date().toISOString(),
    };

    // 6. Dispatch via CRM Adapter
    const result = await crmAdapter.submitCallbackLead(lead);

    return {
      success: result.status !== 'error',
      isDemo: result.isDemo,
      message: result.message,
      leadId: result.leadId,
      whatsAppDirectUrl: result.whatsAppDirectUrl,
      error: result.status === 'error' ? result.message : undefined,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Please review the required contact fields.',
        details: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred while processing your callback.',
    };
  }
}

export async function submitEnquiryAction(formData: EnquiryFormData) {
  try {
    // 1. Server-side Rate Limiting
    const headerList = await headers();
    const rawIp = headerList.get('x-forwarded-for') || headerList.get('x-real-ip');
    const clientIp = normalizeClientIp(rawIp);

    if (!checkRateLimit(clientIp)) {
      return {
        success: false,
        error: 'Too many enquiry requests submitted from this connection. Please wait a few minutes before trying again, or reach out to our concierge directly on WhatsApp.',
      };
    }

    // 2. Server-side validation
    const validatedData = enquirySchema.parse(formData);

    // 3. Bot honeypot check - silently discard spam
    if (validatedData.honeypot && validatedData.honeypot.trim().length > 0) {
      return {
        success: true,
        isDemo: true,
        message: 'Enquiry received.',
        leadId: 'DEMO-SEC-01',
      };
    }

    // 4. Construct the payload for the CRM
    const payload: PublicEnquiryPayload = {
      ...validatedData,
      source: 'website',
      landingPage: 'custom-holiday',
      timestamp: new Date().toISOString(),
    };

    // 5. Submit via adapter
    const result = await crmAdapter.submitEnquiry(payload);

    return {
      success: result.status !== 'error',
      isDemo: result.isDemo,
      message: result.message,
      leadId: result.leadId,
      whatsAppDirectUrl: result.whatsAppDirectUrl,
      error: result.status === 'error' ? result.message : undefined,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed. Please review your travel details.',
        details: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred on the server.',
    };
  }
}
