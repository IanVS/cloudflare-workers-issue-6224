/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const SLUG = '/sentrytunnel';

export const onRequestPost: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);

  if (url.pathname === SLUG) {
    const clonedRequest = new Request(request);
    const envelope = await clonedRequest.text();
    let body = envelope;

    // HACK: attempt to send the real client IP address to sentry instead of the Cloudflare IP
    // An `x-forwarded-for` header does not seem to work, but we can shove the ip into the body
    // of the message to sentry, and it will pick it up.
    // Ref: https://forum.sentry.io/t/real-client-ip-with-sentry-nextjs-tunnel/15438
    // Ref: https://github.com/getsentry/relay/blob/2e924639d7bcfa24db69ba2ed78a82e2c07478e1/relay-server/src/envelope.rs#L1126
    // Ref: https://github.com/getsentry/relay/issues/2450
    const connectingIP = request.headers.get('cf-connecting-ip');
    if (connectingIP) {
      const [rawHeader, ...restPieces] = envelope.split('\n');
      const header = JSON.parse(rawHeader);
      body = [
        JSON.stringify({
          ...header,
          forwarded_for: connectingIP,
        }),
        ...restPieces,
      ].join('\n');
    }

    return fetch('https://167af0ae6cd24240b61dc0dc4a6598f3@o920269.ingest.sentry.io/api/5865647/envelope/', {
      method: 'POST',
      body,
    });
  }

  // If the above routes don't match, return 404
  return new Response(null, { status: 404 });
};
