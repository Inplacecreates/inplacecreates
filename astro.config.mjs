import { defineConfig } from 'astro/config';

export default defineConfig({
    output: 'static',
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
    }
});