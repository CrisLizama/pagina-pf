import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import db from '@astrojs/db';

export default defineConfig({
  output: 'server',
  integrations: [react(), db()],
  vite: {
    server: {
      allowedHosts: [process.env.PUBLIC_BASE_URL]  // poner en variable de entorno PUBLIC_BASE_URL
    }
  }
});