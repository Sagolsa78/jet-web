import { apiRequest } from './client';
import type { Destination, HolidayPackage } from '@/types';
import type { CRMLeadResponse, PublicEnquiryPayload, CallbackLead } from './types';
import { SITE_CONTACT } from '@/data/site-content';

export function getEnquiryMode(): 'demo' | 'live' | 'unconfigured' {
  // Explicit demo override in any environment
  if (process.env.DEMO_ENQUIRY_MODE === 'true') {
    return 'demo';
  }

  const hasLiveCredentials = Boolean(
    process.env.CRM_WEBHOOK_URL || process.env.JETO_CRM_API_BASE_URL
  );

  // In production, missing credentials must NOT silently fall back to demo mode
  if (process.env.NODE_ENV === 'production') {
    return hasLiveCredentials ? 'live' : 'unconfigured';
  }

  // Development and test default to demo mode if no live credentials
  return hasLiveCredentials ? 'live' : 'demo';
}

export const crmAdapter = {
  async getDestinations(): Promise<Destination[]> {
    const mode = getEnquiryMode();
    if (mode === 'demo' || !process.env.JETO_CRM_API_BASE_URL) {
      // In demo mode or when API base URL is unset, return verified static destinations
      const { SAMPLE_DESTINATIONS } = await import('@/data/sample-destinations');
      return SAMPLE_DESTINATIONS;
    }

    const response = await apiRequest<Destination[]>('/listdest');
    if (!response.success) throw new Error(response.error);
    return response.data;
  },

  async getPackages(): Promise<HolidayPackage[]> {
    const mode = getEnquiryMode();
    if (mode === 'demo' || !process.env.JETO_CRM_API_BASE_URL) {
      const { SAMPLE_PACKAGES } = await import('@/data/sample-packages');
      return SAMPLE_PACKAGES;
    }

    const response = await apiRequest<HolidayPackage[]>('/listtripsdata/all');
    if (!response.success) throw new Error(response.error);
    return response.data;
  },

  async submitEnquiry(data: PublicEnquiryPayload): Promise<CRMLeadResponse> {
    const waText = [
      `✈️ *New Website Enquiry — Jeto Vacations*`,
      `👤 *Name:* ${data.fullName}`,
      `📞 *Phone:* ${data.phone}`,
      `✉️ *Email:* ${data.email}`,
      `📍 *Destination:* ${data.destination}`,
      `⏱️ *Travel Month:* ${data.travelMonth} (Ex-${data.departureCity})`,
      `👥 *Travellers:* ${data.adults} Adults${data.children ? `, ${data.children} Children` : ''}`,
      `🏨 *Travel Style:* ${data.travelStyle}`,
      `🏷️ *Budget Range:* ${data.budgetRange}`,
      data.notes ? `📝 *Notes:* ${data.notes}` : '',
    ].filter(Boolean).join('\n');

    const whatsAppDirectUrl = `https://wa.me/91${SITE_CONTACT.phone}?text=${encodeURIComponent(waText)}`;
    const mode = getEnquiryMode();

    // 1. Guard against unconfigured production environment
    if (mode === 'unconfigured') {
      console.error('PRODUCTION CRM MISCONFIGURATION: Enquiry attempted but no live CRM backend is configured.');
      return {
        leadId: `ERR-${Date.now().toString(36).toUpperCase()}`,
        status: 'error',
        isDemo: false,
        message: `Our online enquiry system is undergoing scheduled maintenance. Please connect with our concierge directly at +91 ${SITE_CONTACT.phone} or via WhatsApp.`,
        whatsAppDirectUrl,
      };
    }

    // 2. Demo mode: explicitly disclose local simulation
    if (mode === 'demo') {
      console.log('DEMO MODE: Enquiry captured locally for destination:', data.destination, '| Pax:', data.adults);
      return {
        leadId: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'created',
        isDemo: true,
        message: 'Demo Mode: This enquiry was processed locally in demonstration mode and has NOT been transmitted to the Jeto sales team. Connect directly on WhatsApp.',
        whatsAppDirectUrl,
      };
    }

    // 3. Live dispatch: Webhook
    const webhookUrl = process.env.CRM_WEBHOOK_URL;
    let webhookSuccess = false;

    if (webhookUrl) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const bodyStr = JSON.stringify({ ...data, whatsAppDirectUrl });

        const secret = process.env.CRM_WEBHOOK_SECRET;
        if (secret) {
          const crypto = await import('crypto');
          const signature = crypto.createHmac('sha256', secret).update(bodyStr).digest('hex');
          headers['X-Jeto-Signature'] = `sha256=${signature}`;
          headers['X-Jeto-Timestamp'] = new Date().toISOString();
        }

        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers,
          body: bodyStr,
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          webhookSuccess = true;
        } else {
          console.warn('CRM Webhook rejected enquiry with status:', res.status);
        }
      } catch (err) {
        console.warn('CRM Webhook dispatch failed or timed out:', err);
      }
    }

    if (webhookSuccess) {
      return {
        leadId: `JV-${Date.now().toString(36).toUpperCase()}`,
        status: 'created',
        isDemo: false,
        message: 'Thank you. Your holiday inquiry has been received by our sales desk.',
        whatsAppDirectUrl,
      };
    }

    // 4. Live dispatch: Primary API endpoint if configured
    if (process.env.JETO_CRM_API_BASE_URL) {
      try {
        const response = await apiRequest<CRMLeadResponse>('/weblead', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        if (response.success) {
          return {
            ...response.data,
            isDemo: false,
            whatsAppDirectUrl,
          };
        }
      } catch (err) {
        console.error('Primary CRM dispatch error:', err);
      }
    }

    // 5. Honest error: never claim success if delivery failed
    return {
      leadId: `ERR-${Date.now().toString(36).toUpperCase()}`,
      status: 'error',
      isDemo: false,
      message: `We could not submit your enquiry automatically. Please call us at +91 ${SITE_CONTACT.phone} or chat on WhatsApp to reach a consultant immediately.`,
      whatsAppDirectUrl,
    };
  },

  async submitCallbackLead(lead: CallbackLead): Promise<CRMLeadResponse> {
    const waText = [
      `📞 *Urgent Sales Callback Request — Jeto Vacations*`,
      `👤 *Name:* ${lead.name}`,
      `📱 *Phone:* ${lead.phone}`,
      lead.email ? `✉️ *Email:* ${lead.email}` : '',
      lead.destination ? `📍 *Destination:* ${lead.destination}` : '',
      lead.packageTitle ? `📦 *Package:* ${lead.packageTitle}` : '',
      lead.travelMonth ? `⏱️ *Travel Dates / Month:* ${lead.travelMonth}` : '',
      lead.travellers ? `👥 *Travellers:* ${lead.travellers} Person(s)` : '',
      lead.budget ? `🏷️ *Budget:* ${lead.budget}` : '',
      lead.notes ? `📝 *Notes:* ${lead.notes}` : '',
      `🔗 *Source:* ${lead.source}`,
    ].filter(Boolean).join('\n');

    const whatsAppDirectUrl = `https://wa.me/91${SITE_CONTACT.phone}?text=${encodeURIComponent(waText)}`;
    const mode = getEnquiryMode();

    // 1. Guard against unconfigured production environment
    if (mode === 'unconfigured') {
      console.error('PRODUCTION CRM MISCONFIGURATION: Callback attempted but no live CRM backend is configured.');
      return {
        leadId: lead.id,
        status: 'error',
        isDemo: false,
        message: `Our callback scheduling system is undergoing configuration. Please call us directly at +91 ${SITE_CONTACT.phone} or message us on WhatsApp.`,
        whatsAppDirectUrl,
      };
    }

    // 2. Demo mode: explicitly disclose local simulation
    if (mode === 'demo') {
      console.log('DEMO MODE: Callback lead simulated locally for destination:', lead.destination || 'Unspecified', '| Lead ID:', lead.id);
      return {
        leadId: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'created',
        isDemo: true,
        message: 'Demo Mode: This callback request was processed in demonstration mode and has NOT been sent to Jeto sales. Please call us or tap WhatsApp to connect now.',
        whatsAppDirectUrl,
      };
    }

    // 3. Live dispatch: Webhook
    const webhookUrl = process.env.CRM_WEBHOOK_URL;
    let webhookSuccess = false;

    if (webhookUrl) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const bodyStr = JSON.stringify({ ...lead, whatsAppDirectUrl });

        const secret = process.env.CRM_WEBHOOK_SECRET;
        if (secret) {
          const crypto = await import('crypto');
          const signature = crypto.createHmac('sha256', secret).update(bodyStr).digest('hex');
          headers['X-Jeto-Signature'] = `sha256=${signature}`;
          headers['X-Jeto-Timestamp'] = new Date().toISOString();
        }

        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers,
          body: bodyStr,
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          webhookSuccess = true;
        } else {
          console.warn('CRM Webhook rejected lead with status:', res.status);
        }
      } catch (err) {
        console.warn('CRM Webhook dispatch failed or timed out:', err);
      }
    }

    if (webhookSuccess) {
      return {
        leadId: lead.id,
        status: 'created',
        isDemo: false,
        message: `Thanks, ${lead.name}. Our travel consultant will call you on ${lead.phone} shortly.`,
        whatsAppDirectUrl,
      };
    }

    // 4. Live dispatch: Primary API endpoint if configured
    if (process.env.JETO_CRM_API_BASE_URL) {
      try {
        const response = await apiRequest<CRMLeadResponse>('/weblead', {
          method: 'POST',
          body: JSON.stringify(lead),
        });
        if (response.success) {
          return {
            ...response.data,
            isDemo: false,
            message: `Thanks, ${lead.name}. Our travel consultant will call you on ${lead.phone} shortly.`,
            whatsAppDirectUrl,
          };
        }
      } catch (err) {
        console.error('Primary CRM dispatch error:', err);
      }
    }

    // 5. Honest error: never claim success if delivery failed
    return {
      leadId: lead.id,
      status: 'error',
      isDemo: false,
      message: `We couldn't submit your request automatically. Please call us at +91 ${SITE_CONTACT.phone} or chat on WhatsApp to speak with a consultant immediately.`,
      whatsAppDirectUrl,
    };
  },
};