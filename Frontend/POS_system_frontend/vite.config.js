import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function imageUploadPlugin() {
  return {
    name: 'image-upload-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload-image', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { filename, data } = JSON.parse(body);
              if (!data) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'No image data provided' }));
                return;
              }

              const imagesDir = path.resolve(__dirname, 'public/images');
              if (!fs.existsSync(imagesDir)) {
                fs.mkdirSync(imagesDir, { recursive: true });
              }

              const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
              const filePath = path.join(imagesDir, filename);

              fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
              const publicPath = `/images/${filename}`;

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, path: publicPath, filename }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), imageUploadPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

