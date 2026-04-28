import type { APIRoute } from 'astro';
import { db, eq, User } from 'astro:db';

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
        redirect_uri: `${import.meta.env.PUBLIC_BASE_URL}/api/auth/callback/google`,
      }),
    });

    const tokens = await tokenResponse.json();

    // Obtener los datos del usuario desde Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();
    
    console.log('Tokens:', tokens);
    console.log('Google User:', googleUser);
    console.log('ID:', googleUser.id);
    console.log('Email:', googleUser.email);
    console.log('Name:', googleUser.name);

    // Buscar si el usuario ya existe en la DB
    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.email, googleUser.email))
      .get();

    if (existingUser) {
      // Si ya existe, actualizamos su información
      await db
        .update(User)
        .set({
          name: googleUser.name,
          image: googleUser.picture,
        })
        .where(eq(User.email, googleUser.email));
    } else {
      // Si no existe, lo creamos
      await db.insert(User).values({
        id: googleUser.id,
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
        createdAt: new Date(),
      });
    }

    console.log('Usuario guardado en DB:', googleUser.email);

    // Guardar la sesión en una cookie
    cookies.set('session', JSON.stringify({
      id: googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
      image: googleUser.picture,
    }), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      domain: undefined, // sin restricciones de dominio
    });

    return redirect('/');

  } catch (error) {
    console.error('Error en callback:', error);
    return redirect('/');
  }
};