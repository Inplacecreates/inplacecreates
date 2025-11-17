import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',

  build: {
      assets: 'assets'
  },

  vite: {
      css: {
          preprocessorOptions: {
              scss: {
                  // Allow access to SCSS files
                  additionalData: `@import "/src/styles/_variables.scss";`
              }
          }
      }
  },

  adapter: netlify()
});