import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import db from '@astrojs/db';

export default defineConfig({
  output: 'server',
  integrations: [react(), db()],
  vite: {
    server: {
      allowedHosts: ['42d4-181-42-128-87.ngrok-free.app'] // debe cambiarse cada vez q inicio ngrock
    }
  }
});