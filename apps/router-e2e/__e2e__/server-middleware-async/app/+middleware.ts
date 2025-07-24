import jwt from 'jsonwebtoken';

export default async function middleware(request: Request): Promise<Response | void> {
  const url = new URL(request.url);
  const scenario = url.searchParams.get('e2e');

  if (scenario === 'redirect') {
    return Response.redirect(new URL('/second', url.origin));
  }

  if (scenario === 'redirect-301') {
    return Response.redirect(new URL('/second', url.origin), 301);
  }

  if (scenario === 'error') {
    throw new Error('The middleware threw an error');
  }

  if (scenario === 'read-env') {
    return Response.json({
      ...process.env,
    })
  }

  if (scenario === 'custom-response') {
    return new Response(`<html><h1 data-testid="title">Custom response from middleware</h1></html>`, {
      headers: {
        'content-type': 'text/html',
      }
    });
  }

  if (scenario === 'sign-jwt') {
    const token = jwt.sign({ foo: 'bar' }, process.env.TEST_SECRET_VALUE);
    return new Response(JSON.stringify({ token }), {
      headers: {
        'content-type': 'application/json',
      }
    });
  }

  if (scenario === 'verify-jwt') {
    const token = request.headers.get('authorization')!;
    const decoded = jwt.verify(token, process.env.TEST_SECRET_VALUE);
    return new Response(JSON.stringify({ decoded }), {
      headers: {
        'content-type': 'application/json',
      }
    });
  }

  // If no E2E scenario is specified, continue to normal routing
}