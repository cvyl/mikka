import path from 'path';
import { defineConfig } from 'vite';
import Pages from 'vite-plugin-pages';
import generateSitemap from 'vite-ssg-sitemap';
import AutoImport from 'unplugin-auto-import/vite';
import { VitePWA } from 'vite-plugin-pwa';
import Inspect from 'vite-plugin-inspect';
import VueJsx from '@vitejs/plugin-vue-jsx';
import Content from '@originjs/vite-plugin-content';
import * as fs from 'fs';
import remarkGfm from 'remark-gfm';
import rehypePrism from '@mapbox/rehype-prism';
import autoprefixer from 'autoprefixer';
import SvgLoader from 'vite-svg-loader';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
    dedupe: ['vue'],
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  plugins: [
    VueJsx({
      include: [/\.tsx$/],
    }),

    SvgLoader(),

    Pages({
      extensions: ['tsx'],
      caseSensitive: true,
    }),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
      ],
      include: [/\.[tj]sx?$/],
      dts: 'src/auto-imports.d.ts',
    }),

    VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.json',
      manifest: {
        name: '凌莞喵～',
        short_name: '凌莞喵～',
        theme_color: '#EDF8F6',
        background_color: '#EDF8F6',
        orientation: 'portrait-primary',
        lang: 'zh',
      },
      workbox: {
        globPatterns: [
          'x_assets_x/*.*',
        ],
        globIgnores: [
          '*.html',
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: null,
      },
    }),

    Inspect(),

    Content(),
  ],

  build: {
    rollupOptions: {
      input: {
        angelkawaii: 'index.html',
      },
      output: {
        entryFileNames: `x_[name][hash]_x.js`,
        assetFileNames: 'x_assets_x/x_[hash:11]_x[extname]',
        chunkFileNames: "x_assets_x/x_[hash:11]_x.js",
        generatedCode: {
          constBindings: true,
          arrowFunctions: true,
          objectShorthand: true,
        },
        compact: true,
      },
      preserveEntrySignatures: 'exports-only',
    },
  },

  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    onFinished() {
      generateSitemap({
        hostname: 'https://cvyl.me',
        generateRobotsTxt: true,
        robots: [
          { userAgent: '*', allow: '/' },
          { userAgent: 'Twitterbot', allow: '/' },
          { userAgent: 'Googlebot', disallow: '/*redirect=1*' },

          { userAgent: 'AI2Bot', disallow: '/' },
          { userAgent: 'Ai2Bot-Dolma', disallow: '/' },
          { userAgent: 'Amazonbot', disallow: '/' },
          { userAgent: 'anthropic-ai', disallow: '/' },
          { userAgent: 'Applebot', disallow: '/' },
          { userAgent: 'Applebot-Extended', disallow: '/' },
          { userAgent: 'Brightbot 1.0', disallow: '/' },
          { userAgent: 'Bytespider', disallow: '/' },
          { userAgent: 'CCBot', disallow: '/' },
          { userAgent: 'ChatGPT-User', disallow: '/' },
          { userAgent: 'Claude-Web', disallow: '/' },
          { userAgent: 'ClaudeBot', disallow: '/' },
          { userAgent: 'cohere-ai', disallow: '/' },
          { userAgent: 'cohere-training-data-crawler', disallow: '/' },
          { userAgent: 'Crawlspace', disallow: '/' },
          { userAgent: 'DeepSeek', disallow: '/' },
          { userAgent: 'Diffbot', disallow: '/' },
          { userAgent: 'DuckAssistBot', disallow: '/' },
          { userAgent: 'FacebookBot', disallow: '/' },
          { userAgent: 'FriendlyCrawler', disallow: '/' },
          { userAgent: 'Google-CloudVertexBot', disallow: '/' },
          { userAgent: 'Google-Extended', disallow: '/' },
          { userAgent: 'GoogleOther', disallow: '/' },
          { userAgent: 'GoogleOther-Image', disallow: '/' },
          { userAgent: 'GoogleOther-Video', disallow: '/' },
          { userAgent: 'GPTBot', disallow: '/' },
          { userAgent: 'iaskspider/2.0', disallow: '/' },
          { userAgent: 'ICC-Crawler', disallow: '/' },
          { userAgent: 'ImagesiftBot', disallow: '/' },
          { userAgent: 'img2dataset', disallow: '/' },
          { userAgent: 'ISSCyberRiskCrawler', disallow: '/' },
          { userAgent: 'Kangaroo Bot', disallow: '/' },
          { userAgent: 'Meta-ExternalAgent', disallow: '/' },
          { userAgent: 'Meta-ExternalFetcher', disallow: '/' },
          { userAgent: 'OAI-SearchBot', disallow: '/' },
          { userAgent: 'Omgili', disallow: '/' },
          { userAgent: 'Omgilibot', disallow: '/' },
          { userAgent: 'PanguBot', disallow: '/' },
          { userAgent: 'PerplexityBot', disallow: '/' },
          { userAgent: 'PetalBot', disallow: '/' },
          { userAgent: 'Scrapy', disallow: '/' },
          { userAgent: 'SemrushBot-OCOB', disallow: '/' },
          { userAgent: 'SemrushBot-SWA', disallow: '/' },
          { userAgent: 'Sidetrade indexer bot', disallow: '/' },
          { userAgent: 'Timpibot', disallow: '/' },
          { userAgent: 'VelenPublicWebCrawler', disallow: '/' },
          { userAgent: 'Webzio-Extended', disallow: '/' },
          { userAgent: 'YouBot', disallow: '/' },
        ],
      });
    },
    includedRoutes(paths, routes) {
      // 1. Filter out the placeholder route
      const filteredPaths = paths.filter(route => !route.includes(':'));

      // 2. Collect the actual blog slugs from src/blog
      const blogDir = path.resolve(__dirname, 'src/blog');
      if (!fs.existsSync(blogDir)) {
        console.error("[vite-ssg] ERROR: 'src/blog' directory not found!");
        return filteredPaths;
      }

      const blogPosts = fs.readdirSync(blogDir)
        .filter(file => file.endsWith('.md'))
        .map(file => `/blog/${file.replace('.md', '')}`);

      // 3. Merge them to get final routes
      const finalRoutes = [...filteredPaths, ...blogPosts];
      console.log("[vite-ssg] Included Routes:", finalRoutes);
      return finalRoutes;
    },
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@vueuse/head',
    ],
    exclude: [
      'vue-demi',
    ],
  },
});
