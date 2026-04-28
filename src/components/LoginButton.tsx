export default function LoginButton({ session }: { session?: any }) {
  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img 
          src={session.image} 
          alt={session.name}
          style={{ width: '32px', height: '32px', borderRadius: '50%' }}
        />
        <span>{session.name}</span>
        <a href="/api/auth/signout" className="btn btn-secondary">
          Cerrar sesión
        </a>
      </div>
    );
  }

  return (
    <a href="/api/auth/signin" className="btn btn-primary">
      Iniciar sesión con Google
    </a>
  );
}