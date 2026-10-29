import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { crmAdapter, getEnquiryMode } from '../src/lib/api/crm-adapter.ts';
import { getProposalFromStorage, saveProposalToStorage } from '../src/data/proposal-store.ts';

const originalEnv = { ...process.env };

function resetEnv() {
  process.env = { ...originalEnv };
  delete process.env.DEMO_ENQUIRY_MODE;
  delete process.env.CRM_WEBHOOK_URL;
  delete process.env.CRM_WEBHOOK_SECRET;
  delete process.env.JETO_CRM_API_BASE_URL;
}

test('getEnquiryMode: returns expected mode based on environment & credentials', () => {
  // Test/Development default with no credentials
  resetEnv();
  process.env.NODE_ENV = 'test';
  assert.equal(getEnquiryMode(), 'demo');

  // Explicit DEMO_ENQUIRY_MODE = 'true' override
  process.env.DEMO_ENQUIRY_MODE = 'true';
  process.env.CRM_WEBHOOK_URL = 'https://crm.example.com/webhook';
  assert.equal(getEnquiryMode(), 'demo');

  // Production without credentials must NOT default to demo; returns unconfigured
  resetEnv();
  process.env.NODE_ENV = 'production';
  assert.equal(getEnquiryMode(), 'unconfigured');

  // Production with webhook credentials returns live
  resetEnv();
  process.env.NODE_ENV = 'production';
  process.env.CRM_WEBHOOK_URL = 'https://crm.example.com/webhook';
  assert.equal(getEnquiryMode(), 'live');
});

test('crmAdapter.submitEnquiry: demo mode returns honest simulation notice & DEMO- id', async () => {
  resetEnv();
  process.env.NODE_ENV = 'test';
  process.env.DEMO_ENQUIRY_MODE = 'true';

  const mockPayload = {
    destination: 'Japan Cherry Blossom',
    departureCity: 'Mumbai',
    travelMonth: 'April 2026',
    adults: 2,
    children: 0,
    budgetRange: '₹3,00,000 – ₹4,50,000',
    travelStyle: 'Luxury',
    fullName: 'Test Traveler',
    email: 'traveler@example.com',
    phone: '9876543210',
    contactChannel: 'whatsapp',
    consent: true,
    source: 'website',
    landingPage: 'custom-holiday',
    timestamp: new Date().toISOString(),
  };

  const res = await crmAdapter.submitEnquiry(mockPayload);
  assert.equal(res.status, 'created');
  assert.equal(res.isDemo, true);
  assert.match(res.leadId, /^DEMO-\d{4}$/);
  assert.match(res.message, /Demo Mode:/i);
  assert.match(res.message, /NOT been transmitted/i);
  assert.ok(res.whatsAppDirectUrl.startsWith('https://wa.me/'));
});

test('crmAdapter.submitCallbackLead: demo mode returns honest simulation notice & DEMO- id', async () => {
  resetEnv();
  process.env.NODE_ENV = 'test';
  process.env.DEMO_ENQUIRY_MODE = 'true';

  const mockLead = {
    id: 'LEAD-TEST-123',
    name: 'Neha Kapoor',
    phone: '9876543210',
    destination: 'Switzerland Alps',
    source: 'website',
    status: 'new',
    consent: true,
    createdAt: new Date().toISOString(),
  };

  const res = await crmAdapter.submitCallbackLead(mockLead);
  assert.equal(res.status, 'created');
  assert.equal(res.isDemo, true);
  assert.match(res.leadId, /^DEMO-\d{4}$/);
  assert.match(res.message, /Demo Mode:/i);
  assert.match(res.message, /NOT been sent/i);
  assert.ok(res.whatsAppDirectUrl.startsWith('https://wa.me/'));
});

test('crmAdapter: demo mode makes zero external HTTP requests even when webhook URL is set', async () => {
  resetEnv();
  process.env.NODE_ENV = 'test';
  process.env.DEMO_ENQUIRY_MODE = 'true';

  let requestsReceived = 0;
  const server = http.createServer((req, res) => {
    requestsReceived++;
    res.writeHead(200);
    res.end();
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  process.env.CRM_WEBHOOK_URL = `http://127.0.0.1:${port}/webhook`;

  try {
    const mockLead = {
      id: 'LEAD-NO-DISPATCH',
      name: 'Demo Visitor',
      phone: '9876543210',
      destination: 'Maldives',
      source: 'website',
      status: 'new',
      consent: true,
      createdAt: new Date().toISOString(),
    };

    const res = await crmAdapter.submitCallbackLead(mockLead);
    assert.equal(res.isDemo, true);
    assert.equal(requestsReceived, 0, 'Demo mode must NEVER perform external HTTP calls');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    resetEnv();
  }
});

test('crmAdapter: in production without credentials, safely blocks fake success', async () => {
  resetEnv();
  process.env.NODE_ENV = 'production';

  const mockPayload = {
    destination: 'Dubai Luxury Escape',
    departureCity: 'Delhi',
    travelMonth: 'December 2026',
    adults: 2,
    children: 0,
    budgetRange: '₹2,00,000 – ₹3,00,000',
    travelStyle: 'Luxury',
    fullName: 'Prod User',
    email: 'prod@example.com',
    phone: '9876543210',
    contactChannel: 'whatsapp',
    consent: true,
    source: 'website',
    landingPage: 'custom-holiday',
    timestamp: new Date().toISOString(),
  };

  const res = await crmAdapter.submitEnquiry(mockPayload);
  assert.equal(res.status, 'error');
  assert.equal(res.isDemo, false);
  assert.match(res.leadId, /^ERR-/);
  assert.match(res.message, /scheduled maintenance|maintenance/i);

  const mockLead = {
    id: 'LEAD-PROD-999',
    name: 'Prod Callback User',
    phone: '9876543210',
    source: 'website',
    status: 'new',
    consent: true,
    createdAt: new Date().toISOString(),
  };

  const leadRes = await crmAdapter.submitCallbackLead(mockLead);
  assert.equal(leadRes.status, 'error');
  assert.equal(leadRes.isDemo, false);
  assert.match(leadRes.message, /configuration|undergoing/i);
});

test('crmAdapter: successfully dispatches webhook with signature header', async () => {
  resetEnv();
  process.env.NODE_ENV = 'production';
  process.env.CRM_WEBHOOK_SECRET = 'test-secret-salt-xyz';

  let receivedBody = null;
  let receivedSignature = null;
  let receivedTimestamp = null;

  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      receivedBody = JSON.parse(body);
      receivedSignature = req.headers['x-jeto-signature'];
      receivedTimestamp = req.headers['x-jeto-timestamp'];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, leadId: 'CRM-WH-001' }));
    });
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  process.env.CRM_WEBHOOK_URL = `http://127.0.0.1:${port}/webhook`;

  try {
    const mockLead = {
      id: 'LEAD-WH-TEST',
      name: 'Rohan Mehra',
      phone: '9988776655',
      destination: 'Bali Romance',
      source: 'website',
      status: 'new',
      consent: true,
      createdAt: new Date().toISOString(),
    };

    const res = await crmAdapter.submitCallbackLead(mockLead);
    assert.equal(res.status, 'created');
    assert.equal(res.isDemo, false);
    assert.match(res.message, /consultant will call you/i);

    assert.ok(receivedBody, 'Webhook server should receive payload');
    assert.equal(receivedBody.name, 'Rohan Mehra');
    assert.equal(receivedBody.destination, 'Bali Romance');
    assert.ok(receivedSignature && receivedSignature.startsWith('sha256='));
    assert.ok(receivedTimestamp);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    resetEnv();
  }
});

test('crmAdapter: genuine delivery failure when webhook returns 500 error', async () => {
  resetEnv();
  process.env.NODE_ENV = 'production';

  const server = http.createServer((req, res) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  process.env.CRM_WEBHOOK_URL = `http://127.0.0.1:${port}/webhook`;

  try {
    const mockLead = {
      id: 'LEAD-FAIL-TEST',
      name: 'Rohan Mehra',
      phone: '9988776655',
      destination: 'Bali',
      source: 'website',
      status: 'new',
      consent: true,
      createdAt: new Date().toISOString(),
    };

    const res = await crmAdapter.submitCallbackLead(mockLead);
    assert.equal(res.status, 'error', 'Failed webhook delivery must yield error status');
    assert.equal(res.isDemo, false, 'Failed live delivery must not claim demo mode');
    assert.match(res.message, /couldn't submit|Please call us/i);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    resetEnv();
  }
});

test('proposalStore: guarantees customer PII privacy and zero mock fallback', () => {
  // saveProposalToStorage is a safe no-op that never throws
  assert.doesNotThrow(() => saveProposalToStorage());

  // getProposalFromStorage always returns null for any ID (unknown or invalid)
  assert.equal(getProposalFromStorage(''), null);
  assert.equal(getProposalFromStorage('unknown-proposal-id'), null);
  assert.equal(getProposalFromStorage('DEMO-1234'), null);
  assert.equal(getProposalFromStorage('demo-01'), null);

  // Ensures mock record fallback (e.g. "Aditya & Family") is completely eliminated
  const record = getProposalFromStorage('aditya-family');
  assert.equal(record, null);
});
