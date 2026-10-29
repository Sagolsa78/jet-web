import Link from 'next/link';
import { getCustomerReviews, type CustomerReview } from '@/data/customer-reviews';

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(date);
}

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-surface-container-high bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span
          className="text-secondary"
          role="img"
          aria-label={`${review.trip_review_score} out of 5 stars`}
        >
          {'★'.repeat(review.trip_review_score)}
        </span>
        <span className="text-xs text-outline">{review.primary_destination}</span>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-on-surface-variant">
        {review.trip_review?.trim() || 'No written comment was provided.'}
      </p>
      <div className="mt-5 border-t border-surface-container-high pt-4">
        <p className="font-semibold text-primary">{review.cust_name}</p>
        <p className="mt-1 text-xs text-outline">
          Trip: {formatReviewDate(review.trip_start_date)}
          {review.trip_review_source ? ` · ${review.trip_review_source}` : ''}
        </p>
      </div>
    </article>
  );
}

export async function CustomerReviews() {
  const result = await getCustomerReviews();

  return (
    <section
      aria-labelledby="traveler-reviews-heading"
      className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-secondary">
            Guest feedback
          </span>
          <h2
            id="traveler-reviews-heading"
            className="font-serif text-3xl font-semibold text-primary sm:text-4xl"
          >
            What Our Travelers Say
          </h2>
          {'reviews' in result && result.reviews.length > 0 && (
            <p className="mt-2 text-sm text-on-surface-variant">
              {result.reviews.length.toLocaleString('en-IN')} published reviews ·{' '}
              {(
                result.reviews.reduce((total, review) => total + review.trip_review_score, 0) /
                result.reviews.length
              ).toFixed(1)}
              /5 average rating
            </p>
          )}
        </div>
        <Link
          href="/reviews"
          className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:underline"
        >
          Read all reviews
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      {'error' in result ? (
        <p className="rounded-2xl border border-surface-container-high bg-surface-container-low p-6 text-sm text-on-surface-variant">
          {result.error} Please try again later.
        </p>
      ) : result.reviews.length === 0 ? (
        <p className="rounded-2xl border border-surface-container-high bg-surface-container-low p-6 text-sm text-on-surface-variant">
          No traveler reviews are currently available.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {[...result.reviews]
            .filter((review) => review.trip_review?.trim())
            .sort(
              (left, right) =>
                new Date(right.trip_start_date).getTime() -
                new Date(left.trip_start_date).getTime(),
            )
            .slice(0, 3)
            .map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
        </div>
      )}
    </section>
  );
}
