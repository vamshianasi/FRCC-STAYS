import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    watch: {
      // Exclude zip archives and any locked/binary files from the watcher
      ignored: ['**/*.zip', '**/*.rar', '**/*.tar', '**/*.gz']
    }
  }
});
