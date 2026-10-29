import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BoundedRateLimiter,
  normalizeClientIp,
  ipLimiter,
  phoneLimiter,
  resetAllRateLimits,
} from '../src/lib/security/rate-limiter.ts';

test('normalizeClientIp: correctly normalizes and validates IP headers', () => {
  // Direct IPv4
  assert.equal(normalizeClientIp('203.0.113.195'), '203.0.113.195');

  // Comma-separated X-Forwarded-For (extract leftmost client IP)
  assert.equal(
    normalizeClientIp('198.51.100.10, 10.0.0.1, 172.16.0.1'),
    '198.51.100.10'
  );

  // IPv6 address
  assert.equal(
    normalizeClientIp('2001:0db8:85a3:0000:0000:8a2e:0370:7334'),
    '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
  );

  // Missing, null, or undefined
  assert.equal(normalizeClientIp(null), 'anonymous');
  assert.equal(normalizeClientIp(undefined), 'anonymous');
  assert.equal(normalizeClientIp(''), 'anonymous');

  // Header injection / invalid characters rejected
  assert.equal(normalizeClientIp('<script>alert(1)</script>'), 'anonymous');
  assert.equal(normalizeClientIp('192.168.1.1\r\nX-Bad-Header: evil'), 'anonymous');
  assert.equal(normalizeClientIp('a'.repeat(60)), 'anonymous');
});

test('ipLimiter: permits up to 5 requests per window and throttles subsequent requests', () => {
  resetAllRateLimits();
  const testIp = '198.51.100.42';

  for (let i = 0; i < 5; i++) {
    assert.equal(ipLimiter.check(testIp), true, `Request #${i + 1} should be permitted`);
  }

  // 6th request within window must be rejected
  assert.equal(ipLimiter.check(testIp), false, '6th request must be throttled');
});

test('phoneLimiter: permits 2 submissions within throttle window and throttles 3rd', () => {
  resetAllRateLimits();
  const phone = '9876543210';

  assert.equal(phoneLimiter.check(phone), true, '1st phone submission allowed');
  assert.equal(phoneLimiter.check(phone), true, '2nd phone submission allowed');
  assert.equal(phoneLimiter.check(phone), false, '3rd phone submission within 2 min throttled');
});

test('BoundedRateLimiter: strictly bounds memory to maxEntries by evicting oldest keys', () => {
  const smallLimiter = new BoundedRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 5,
    maxEntries: 10,
  });

  // Insert 10 unique keys
  for (let i = 1; i <= 10; i++) {
    smallLimiter.check(`key-${i}`);
  }
  assert.equal(smallLimiter.size(), 10);

  // Inserting 11th key should evict oldest (key-1) and keep size bounded to 10
  smallLimiter.check('key-11');
  assert.equal(smallLimiter.size(), 10);

  // Verify that key-1 was evicted and can now make fresh requests without hitting max
  assert.equal(smallLimiter.check('key-1'), true);
});
