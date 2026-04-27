import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import db from '@astrojs/db';

export default defineConfig({
  integrations: [react(), db()],
  vite: {
    server: {
      allowedHosts: ['70be-181-42-128-87.ngrok-free.app']
    }
  }
});