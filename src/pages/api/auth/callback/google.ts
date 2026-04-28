import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return redirect('/');
  }

  try {
    // Intercambiar el código por un token de acceso
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: import.meta.env.GOOGLE_CLIENT_ID,
        client_secret: import.meta.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:4321/api/auth/callback/google',
      }),
    });

    const tokens = await tokenResponse.json();

    // Obtener los datos del usuario
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const user = await userResponse.json();

    // Guardar la sesión en una cookie
    cookies.set('session', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.picture,
    }), {
      httpOnly: true,
      secure: false, // true en producción
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: '/',
    });

    return redirect('/');

  } catch (error) {
    console.error('Error en callback:', error);
    return redirect('/');
  }
};