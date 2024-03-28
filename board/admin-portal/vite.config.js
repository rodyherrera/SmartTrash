import { defineConfig } from 'vite';

export default defineConfig({
   server: {
      host: '0.0.0.0',
      port: 5000
   },
   resolve: {
      alias: {
         '@': '/src/',
         '@pages': '/src/pages/',
         '@components': '/src/components/',
         '@styles': '/src/assets/stylesheets/'
      }
   },
});