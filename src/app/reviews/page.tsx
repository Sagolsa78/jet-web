import type { Metadata } from 'next';
import Link from 'next/link';
import { getCustomerReviews, type CustomerReview } from '@/data/customer-reviews';

export const metadata: Metadata = {
  title: 'Traveler Reviews',
  description: 'Read published Jeto Vacations traveler reviews and filter by destination or rating.',
};

const PAGE_SIZE = 12;

export const instant = false;

type SearchParams = Record<string, string | string[] | undefined>;

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
    <article className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span
          className="text-secondary"
          role="img"
          aria-label={`${review.trip_review_score} out of 5 stars`}
        >
          {'★'.repeat(review.trip_review_score)}
        </span>
        <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
          {review.primary_destination}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-on-surface-variant">
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

function getSingleParam(params: SearchParams, key: string) {
  const value = params[key];
  return typeof value === 'string' ? value : undefined;
}

function getReviewsHref(page: number, destination?: string, rating?: number) {
  const query = new URLSearchParams({ page: String(page) });
  if (destination) query.set('destination', destination);
  if (rating) query.set('rating', String(rating));
  return `/reviews?${query.toString()}`;
}

function QueryNotice({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-950">
      <p>{message}</p>
      <Link href="/reviews" className="mt-3 inline-block font-semibold underline">
        Clear filters
      </Link>
    </div>
  );
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [params, result] = await Promise.all([searchParams, getCustomerReviews()]);

  if ('error' in result) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-7xl px-6 pb-20 pt-36 sm:px-10 lg:px-12">
        <h1 className="font-serif text-4xl font-semibold text-primary">Traveler Reviews</h1>
        <p role="status" className="mt-6 rounded-2xl bg-surface-container p-6 text-on-surface-variant">
          {result.error} Please try again later.
        </p>
      </div>
    );
  }

  const destinationParam = getSingleParam(params, 'destination');
  const ratingParam = getSingleParam(params, 'rating');
  const pageParam = getSingleParam(params, 'page');
  const hasRepeatedParameters = ['destination', 'rating', 'page'].some((key) =>
    Array.isArray(params[key]),
  );

  if (hasRepeatedParameters) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-7xl px-6 pb-20 pt-36 sm:px-10 lg:px-12">
        <h1 className="mb-6 font-serif text-4xl font-semibold text-primary">Traveler Reviews</h1>
        <QueryNotice message="Use one value for each review filter." />
      </div>
    );
  }

  const destinations = [...new Set(result.reviews.map((review) => review.primary_destination))].sort(
    (left, right) => left.localeCompare(right),
  );
  const rating = ratingParam === undefined ? undefined : Number(ratingParam);
  if (rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-7xl px-6 pb-20 pt-36 sm:px-10 lg:px-12">
        <h1 className="mb-6 font-serif text-4xl font-semibold text-primary">Traveler Reviews</h1>
        <QueryNotice message="Choose a rating from 1 to 5." />
      </div>
    );
  }

  if (destinationParam && !destinations.includes(destinationParam)) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-7xl px-6 pb-20 pt-36 sm:px-10 lg:px-12">
        <h1 className="mb-6 font-serif text-4xl font-semibold text-primary">Traveler Reviews</h1>
        <QueryNotice message="That destination is not available in the review filters." />
      </div>
    );
  }

  const requestedPage = pageParam === undefined ? 1 : Number(pageParam);
  if (!Number.isSafeInteger(requestedPage) || requestedPage < 1) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-7xl px-6 pb-20 pt-36 sm:px-10 lg:px-12">
        <h1 className="mb-6 font-serif text-4xl font-semibold text-primary">Traveler Reviews</h1>
        <QueryNotice message="Choose a valid review page." />
      </div>
    );
  }

  const filteredReviews = result.reviews
    .filter((review) => !destinationParam || review.primary_destination === destinationParam)
    .filter((review) => rating === undefined || review.trip_review_score === rating)
    .sort(
      (left, right) =>
        new Date(right.trip_start_date).getTime() - new Date(left.trip_start_date).getTime(),
    );
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));

  if (requestedPage > totalPages) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-7xl px-6 pb-20 pt-36 sm:px-10 lg:px-12">
        <h1 className="mb-6 font-serif text-4xl font-semibold text-primary">Traveler Reviews</h1>
        <QueryNotice message="That review page is outside the available results." />
      </div>
    );
  }

  const pageReviews = filteredReviews.slice(
    (requestedPage - 1) * PAGE_SIZE,
    requestedPage * PAGE_SIZE,
  );
  const averageRating =
    filteredReviews.length > 0
      ? (
          filteredReviews.reduce((total, review) => total + review.trip_review_score, 0) /
          filteredReviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-6 pb-20 pt-36 sm:px-10 lg:px-12">
      <header className="mb-10">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-secondary">
          Published guest feedback
        </span>
        <h1 className="font-serif text-4xl font-semibold text-primary sm:text-5xl">
          Traveler Reviews
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Browse published traveler feedback by destination or rating.
        </p>
        {averageRating && (
          <p className="mt-4 text-sm font-semibold text-primary">
            {filteredReviews.length.toLocaleString('en-IN')} reviews · {averageRating}/5 average
            rating
          </p>
        )}
      </header>

      <form
        action="/reviews"
        method="get"
        className="mb-8 grid gap-4 rounded-2xl border border-surface-container-high bg-surface-container p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        aria-label="Filter traveler reviews"
      >
        <label className="block text-sm font-semibold text-primary">
          Destination
          <select
            name="destination"
            defaultValue={destinationParam ?? ''}
            className="mt-2 block w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3 py-2.5 text-sm"
          >
            <option value="">All destinations</option>
            {destinations.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-primary">
          Rating
          <select
            name="rating"
            defaultValue={rating === undefined ? '' : String(rating)}
            className="mt-2 block w-full rounded-xl border border-surface-container-high bg-surface-container-lowest px-3 py-2.5 text-sm"
          >
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((score) => (
              <option key={score} value={score}>
                {score} out of 5
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary hover:bg-primary-container"
        >
          Apply filters
        </button>
      </form>

      {pageReviews.length === 0 ? (
        <p className="rounded-2xl border border-surface-container-high bg-surface-container p-6 text-sm text-on-surface-variant">
          No reviews match these filters.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pageReviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}

      {filteredReviews.length > PAGE_SIZE && (
        <nav
          aria-label="Review pages"
          className="mt-10 flex items-center justify-center gap-5 text-sm font-semibold"
        >
          {requestedPage > 1 ? (
            <Link
              href={getReviewsHref(requestedPage - 1, destinationParam, rating)}
              className="text-secondary hover:underline"
            >
              Previous
            </Link>
          ) : (
            <span className="text-outline">Previous</span>
          )}
          <span aria-current="page" className="text-primary">
            Page {requestedPage} of {totalPages}
          </span>
          {requestedPage < totalPages ? (
            <Link
              href={getReviewsHref(requestedPage + 1, destinationParam, rating)}
              className="text-secondary hover:underline"
            >
              Next
            </Link>
          ) : (
            <span className="text-outline">Next</span>
          )}
        </nav>
      )}
    </div>
  );
}
