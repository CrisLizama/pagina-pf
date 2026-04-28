import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const params = new URLSearchParams({
    client_id: import.meta.env.GOOGLE_CLIENT_ID,
    redirect_uri: 'http://localhost:4321/api/auth/callback/google',
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  return Response.redirect(googleAuthUrl);
};