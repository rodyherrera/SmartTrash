import { defineConfig } from 'vite';

export default defineConfig({
   server: {
      host: '0.0.0.0',
      port: 5000
   },
   root: './',
   publicDir: 'public',
   resolve: {
      alias: {
         '@': '/src/',
         '@pages': '/src/pages/',
         '@components': '/src/components/',
         '@styles': '/src/assets/stylesheets/',
         '@images': '/src/assets/images/',
         '@utilities': '/src/utilities/',
         '@services': '/src/services/'
      }
   },
});