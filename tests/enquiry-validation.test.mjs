import test from 'node:test';
import assert from 'node:assert/strict';
import { enquirySchema, callbackLeadSchema } from '../src/lib/validations/enquiry.ts';

test('enquirySchema: accepts valid complete enquiry form data', () => {
  const validData = {
    destination: 'Swiss Alps & Glacier Express',
    departureCity: 'Mumbai',
    travelMonth: 'May 2026',
    adults: 2,
    children: 1,
    budgetRange: '₹1,50,000 – ₹2,50,000',
    travelStyle: 'Luxury',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '9876543210',
    contactChannel: 'whatsapp',
    consent: true,
  };

  const parsed = enquirySchema.safeParse(validData);
  assert.equal(parsed.success, true);
});

test('enquirySchema: rejects invalid email addresses', () => {
  const invalidData = {
    destination: 'Maldives',
    departureCity: 'New Delhi',
    travelMonth: 'June 2026',
    adults: 2,
    children: 0,
    budgetRange: '₹80,000 – ₹1,20,000',
    travelStyle: 'Honeymoon',
    fullName: 'Ananya Verma',
    email: 'not-an-email',
    phone: '9876543210',
    contactChannel: 'email',
    consent: true,
  };

  const parsed = enquirySchema.safeParse(invalidData);
  assert.equal(parsed.success, false);
  const emailErrors = parsed.error?.flatten().fieldErrors.email;
  assert.ok(emailErrors && emailErrors.length > 0);
});

test('enquirySchema: rejects short or missing phone numbers', () => {
  const invalidData = {
    destination: 'Kashmir',
    departureCity: 'Bangalore',
    travelMonth: 'April 2026',
    adults: 2,
    children: 0,
    budgetRange: '₹50,000 – ₹80,000',
    travelStyle: 'Family',
    fullName: 'Kunal Sen',
    email: 'kunal@example.com',
    phone: '12345',
    contactChannel: 'whatsapp',
    consent: true,
  };

  const parsed = enquirySchema.safeParse(invalidData);
  assert.equal(parsed.success, false);
  const phoneErrors = parsed.error?.flatten().fieldErrors.phone;
  assert.ok(phoneErrors && phoneErrors.length > 0);
});

test('enquirySchema: enforces mandatory privacy policy consent', () => {
  const invalidData = {
    destination: 'Bali',
    departureCity: 'Mumbai',
    travelMonth: 'July 2026',
    adults: 2,
    children: 0,
    budgetRange: '₹40,000 – ₹70,000',
    travelStyle: 'Couple',
    fullName: 'Pooja Roy',
    email: 'pooja@example.com',
    phone: '9812345678',
    contactChannel: 'whatsapp',
    consent: false,
  };

  const parsed = enquirySchema.safeParse(invalidData);
  assert.equal(parsed.success, false);
  const consentErrors = parsed.error?.flatten().fieldErrors.consent;
  assert.ok(consentErrors && consentErrors.length > 0);
});

test('callbackLeadSchema: accepts qualified callback lead with minimal required fields', () => {
  const minimalLead = {
    name: 'Mohit Agarwal',
    phone: '+91 98113 41040',
    consent: true,
  };

  const parsed = callbackLeadSchema.safeParse(minimalLead);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.name, 'Mohit Agarwal');
    assert.equal(parsed.data.phone, '+91 98113 41040');
    assert.equal(parsed.data.consent, true);
  }
});

test('callbackLeadSchema: accepts full lead with pre-filled destination, travellers, and budget', () => {
  const fullLead = {
    name: 'Sneha Kapur',
    phone: '9876543210',
    email: 'sneha@example.com',
    destination: 'Swiss Alps & Glacier Express',
    packageTitle: 'Swiss Alps & Glacier Express',
    packageId: 'pkg-swiss',
    travelMonth: 'May 2026',
    travellers: 2,
    budget: 'Luxury (₹1,50,000+ / person)',
    notes: 'Pure vegetarian meal options requested',
    source: 'package_card',
    consent: true,
  };

  const parsed = callbackLeadSchema.safeParse(fullLead);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.source, 'package_card');
    assert.equal(parsed.data.travellers, 2);
  }
});

test('callbackLeadSchema: rejects lead with invalid phone number (< 10 digits)', () => {
  const invalidPhoneLead = {
    name: 'Vikas Sharma',
    phone: '12345',
    consent: true,
  };

  const parsed = callbackLeadSchema.safeParse(invalidPhoneLead);
  assert.equal(parsed.success, false);
  const phoneErrors = parsed.error?.flatten().fieldErrors.phone;
  assert.ok(phoneErrors && phoneErrors.length > 0);
});

test('callbackLeadSchema: rejects lead without explicit user consent', () => {
  const noConsentLead = {
    name: 'Rohan Mehra',
    phone: '9876543210',
    consent: false,
  };

  const parsed = callbackLeadSchema.safeParse(noConsentLead);
  assert.equal(parsed.success, false);
  const consentErrors = parsed.error?.flatten().fieldErrors.consent;
  assert.ok(consentErrors && consentErrors.length > 0);
});
