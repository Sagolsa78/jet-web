import { z } from 'zod';
import { cacheLife } from 'next/cache';

const customerReviewSchema = z.object({
  _id: z.string().min(1),
  cust_name: z.string().min(1),
  primary_destination: z.string().min(1),
  trip_review: z.string().nullable().optional(),
  trip_review_score: z.number().int().min(1).max(5),
  trip_review_source: z.string().nullable().optional(),
  trip_start_date: z.string().min(1),
});

export type CustomerReview = z.infer<typeof customerReviewSchema>;

const reviewFeedUrl = 'https://www.jetovacations.in/getreviewsfrowebsite';

export async function fetchCustomerReviews(): Promise<
  { reviews: CustomerReview[] } | { error: string }
> {
  try {
    const response = await fetch(reviewFeedUrl, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`Official customer review feed returned HTTP ${response.status}.`);
      return { error: 'Traveler reviews are temporarily unavailable.' };
    }

    const parsedReviews = z.array(customerReviewSchema).safeParse(await response.json());
    if (!parsedReviews.success) {
      console.error('Official customer review feed returned invalid review records.');
      return { error: 'Traveler reviews are temporarily unavailable.' };
    }

    return { reviews: parsedReviews.data };
  } catch (error) {
    console.error('Unable to load the official customer review feed.', error);
    return { error: 'Traveler reviews are temporarily unavailable.' };
  }
}

export async function getCustomerReviews() {
  'use cache';
  cacheLife('hours');

  return fetchCustomerReviews();
}
