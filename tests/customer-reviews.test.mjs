import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import { fetchCustomerReviews } from '../src/data/customer-reviews.ts';

const review = {
  _id: 'review-1',
  cust_name: 'Published Traveler',
  primary_destination: 'Bali',
  trip_review: 'A lovely trip.',
  trip_review_score: 5,
  trip_review_source: 'Google',
  trip_start_date: '2026-03-10T00:00:00.000Z',
};

test('fetchCustomerReviews accepts the official feed response and returns validated records', async () => {
  const fetchMock = mock.method(
    globalThis,
    'fetch',
    async () =>
      new Response(JSON.stringify([review]), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
  );

  try {
    const result = await fetchCustomerReviews();
    assert.deepEqual(result, { reviews: [review] });
    assert.equal(fetchMock.mock.callCount(), 1);
    assert.match(fetchMock.mock.calls[0].arguments[0], /^https:\/\/www\.jetovacations\.in\//);
  } finally {
    fetchMock.mock.restore();
  }
});

test('fetchCustomerReviews reports an explicit error for invalid feed records', async () => {
  const fetchMock = mock.method(
    globalThis,
    'fetch',
    async () =>
      new Response(JSON.stringify([{ ...review, trip_review_score: 8 }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
  );
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    assert.deepEqual(await fetchCustomerReviews(), {
      error: 'Traveler reviews are temporarily unavailable.',
    });
  } finally {
    fetchMock.mock.restore();
    console.error = originalConsoleError;
  }
});
