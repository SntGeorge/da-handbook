// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import rehypeMermaid from 'rehype-mermaid';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// https://astro.build/config
export default defineConfig({
  // Финальный URL сайта (Cloudflare Workers Static Assets).
  site: 'https://da-handbook.trosman1999.workers.dev',

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      // strategy: 'pre-mermaid' — НЕ рендерит диаграммы на сборке (не нужен
      // headless-браузер/Playwright), а оставляет <pre class="mermaid"> для
      // рендера на клиенте. Сам рендер делает src/components/Head.astro.
      [rehypeMermaid, { strategy: 'pre-mermaid' }],
      rehypeKatex,
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // sql/python/bash/json/yaml/ts/js и т.д. встроены в Shiki и подгружаются по требованию,
      // поэтому явный список langs не нужен.
      wrap: true,
    },
  },

  integrations: [
    starlight({
      title: 'Data Analyst Handbook',
      description:
        'Личный справочник по Data Analyst: SQL, Python, статистика, BI, продуктовая аналитика и A/B-тесты — от установки инструментов до требований рекрутеров.',
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'Русский',
          lang: 'ru',
        },
      },
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      favicon: '/favicon.svg',
      social: {
        github: 'https://github.com/SntGeorge/da-handbook',
      },
      head: [
        // Open Graph
        {
          tag: 'meta',
          attrs: { property: 'og:type', content: 'website' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:locale', content: 'ru_RU' },
        },
        // Cloudflare Web Analytics (подключи свой токен после деплоя)
        // {
        //   tag: 'script',
        //   attrs: {
        //     defer: true,
        //     src: 'https://static.cloudflareinsights.com/beacon.min.js',
        //     'data-cf-beacon': '{"token": "ВСТАВЬ_ТОКЕН"}',
        //   },
        // },
      ],
      customCss: [
        // Кастомные стили
        './src/styles/custom.css',
        './src/styles/fonts.css',
        // KaTeX подключим, когда появятся страницы с формулами:
        // 'katex/dist/katex.min.css',
      ],
      expressiveCode: {
        themes: ['github-dark', 'github-light'],
        styleOverrides: {
          borderRadius: '0.5rem',
          frames: {
            shadowColor: 'transparent',
          },
        },
      },
      lastUpdated: true,
      pagination: true,
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
      sidebar: [
        {
          label: 'Введение',
          autogenerate: { directory: '00-intro' },
          collapsed: false,
        },
        {
          label: 'Установка и окружение',
          autogenerate: { directory: '01-setup' },
          collapsed: true,
        },
        {
          label: 'SQL',
          autogenerate: { directory: '02-sql' },
          collapsed: false,
          badge: { text: 'Старт', variant: 'tip' },
        },
        {
          label: 'Excel и Google Sheets',
          autogenerate: { directory: '03-excel' },
          collapsed: true,
        },
        {
          label: 'Python для анализа',
          autogenerate: { directory: '04-python' },
          collapsed: true,
        },
        {
          label: 'Статистика',
          autogenerate: { directory: '05-statistics' },
          collapsed: true,
        },
        {
          label: 'Визуализация',
          autogenerate: { directory: '06-visualization' },
          collapsed: true,
        },
        {
          label: 'BI-инструменты',
          collapsed: true,
          items: [
            { slug: '07-bi-tools' },
            {
              label: 'Tableau',
              autogenerate: { directory: '07-bi-tools/tableau' },
              collapsed: true,
            },
            {
              label: 'Power BI',
              autogenerate: { directory: '07-bi-tools/power-bi' },
              collapsed: true,
            },
            {
              label: 'Looker Studio',
              autogenerate: { directory: '07-bi-tools/looker' },
              collapsed: true,
            },
            { slug: '07-bi-tools/metabase-superset' },
          ],
        },
        {
          label: 'Продуктовая аналитика',
          autogenerate: { directory: '08-product-analytics' },
          collapsed: true,
        },
        {
          label: 'A/B-тестирование',
          autogenerate: { directory: '09-ab-testing' },
          collapsed: true,
        },
        {
          label: 'ML-база',
          autogenerate: { directory: '10-ml-basics' },
          collapsed: true,
        },
        {
          label: 'Современный стек',
          autogenerate: { directory: '11-modern-stack' },
          collapsed: true,
        },
        {
          label: 'Карьера',
          autogenerate: { directory: '12-career' },
          collapsed: true,
        },
      ],
      components: {
        // Переопределяем Head, чтобы добавить клиентский рендер Mermaid-диаграмм.
        Head: './src/components/Head.astro',
        // Футер с копирайтом и ссылкой на репозиторий.
        Footer: './src/components/Footer.astro',
      },
    }),
    sitemap(),
  ],
});
