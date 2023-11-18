import { defineConfig } from 'dumi'

export default defineConfig({
  base: '/mango-kit',
  favicons: ['/mango-kit/favicon.png', '/mango-kit/favicon.svg'],
  mfsu: false,
  monorepoRedirect: true,
  outputPath: 'docs-dist',
  publicPath: '/mango-kit/',
  resolve: {
    atomDirs: [
      {
        dir: 'packages/components/src',
        type: 'component',
      },
      {
        dir: 'packages/utils/src',
        type: 'util',
      },
    ],
    docDirs: ['docs'],
    forceKebabCaseRouting: false,
  },
  ssr: process.env.NODE_ENV === 'development' ? false : {},
  themeConfig: {
    description: '前端开发工具包',
    footer: 'Open-source MIT Licensed | Copyright © 2022-present AlbertLin',
    lastUpdated: true,
    logo: '/mango-kit/favicon.png',
    name: 'mango-kit',
    nav: [
      {
        link: '/components',
        title: '组件',
      },
      {
        link: '/utils',
        title: '工具函数',
      },
    ],
    prefersColor: {
      default: 'auto',
    },
    showLineNum: true,
    socialLinks: {
      github: 'https://github.com/AlbertLin0923/mango-kit',
    },
  },
})
