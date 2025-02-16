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
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

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

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['tsx'],
      caseSensitive: true,
    }),

    // https://github.com/antfu/unplugin-auto-import
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

    // https://github.com/antfu/vite-plugin-pwa
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

    // https://github.com/antfu/vite-plugin-inspect
    // Visit http://localhost:3333/__inspect/ to see the inspector
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
  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    onFinished() {
      // @ts-ignore
      generateSitemap({
        hostname: 'https://cvyl.me',
      });
    },
    includedRoutes(paths, routes) {
      // use original route records
      const pathsRet = routes.flatMap((route) => {
        return route.path;
      });
      return pathsRet;
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
