// Next.js Edge API Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes

import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // the type `KVNamespace` comes from the @cloudflare/workers-types package
  const { TEST_NAME } = process.env as unknown as {
    TEST_NAME: string;
  };

  console.log('TEST_NAME', TEST_NAME);

  return new Response(JSON.stringify({ name: 'John Doe' }));
}
