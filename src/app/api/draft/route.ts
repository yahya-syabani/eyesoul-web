import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

/**
 * Payload CMS preview handler.
 * Called when an editor clicks "Preview" in the Payload admin panel.
 * Enables Next.js Draft Mode and redirects to the preview path.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const collection = searchParams.get('collection');

  // Validate the preview secret
  if (secret !== process.env.PAYLOAD_PREVIEW_SECRET) {
    return new Response('Invalid preview secret', { status: 401 });
  }

  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 });
  }

  // Enable Next.js Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the appropriate preview path
  const path = collection === 'articles'
    ? `/articles/${slug}`
    : collection === 'products'
      ? `/products/${slug}`
      : `/${slug}`;

  redirect(`${path}?draft=true`);
}
