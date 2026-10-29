import { redirect } from 'next/navigation';

export default function LegacyBlogIndexPage(): never {
  redirect('/travel-guides');
}
