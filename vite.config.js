import { resolve } from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        blogs: resolve(__dirname, 'blogs.html'),
        blogDetail: resolve(__dirname, 'blog-detail.html'),
        contact: resolve(__dirname, 'contact.html'),
        landing: resolve(__dirname, 'landing.html'),
        properties: resolve(__dirname, 'properties.html'),
        propertyDetail: resolve(__dirname, 'property-detail.html'),
      },
    },
  },
  plugins: [
    {
      name: 'copy-static-folders',
      closeBundle() {
        const folders = ['js', 'css', 'images', 'photos'];
        folders.forEach((folder) => {
          const src = resolve(__dirname, folder);
          const dest = resolve(__dirname, 'dist', folder);
          if (fs.existsSync(src)) {
            fs.cpSync(src, dest, { recursive: true, force: true });
          }
        });
        const staticFiles = [
          'google4aa5dd4b700b07bf.html',
          'robots.txt',
          'sitemap.xml',
        ];
        staticFiles.forEach((file) => {
          const src = resolve(__dirname, file);
          const dest = resolve(__dirname, 'dist', file);
          if (fs.existsSync(src)) {
            fs.cpSync(src, dest, { force: true });
          }
        });
      },
    },
  ],
});
