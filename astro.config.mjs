// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// 动态导入适配器
const DEPLOY_TARGET = process.env.DEPLOY_TARGET || 'cloudflare';

let adapter;
if (DEPLOY_TARGET === 'vercel') {
  const vercel = (await import('@astrojs/vercel')).default;
  adapter = vercel();
} else {
  const cloudflare = (await import('@astrojs/cloudflare')).default;
  adapter = cloudflare();
}

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'server',
  adapter,
  server: {
    port: 4321,
    host: true,
  },
  // Vite 配置 - API 代理
  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_API_BACKEND_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  },
});
