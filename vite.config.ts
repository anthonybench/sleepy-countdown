import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Config for the local demo app under examples/.
// It imports the component straight from src/ (no build needed) so you can
// develop and see changes instantly.
export default defineConfig({
  root: 'examples',
  plugins: [react()],
});
