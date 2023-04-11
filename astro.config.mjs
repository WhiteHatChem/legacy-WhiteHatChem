import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import preact from '@astrojs/preact';
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeMathJax from 'rehype-mathjax';
import robotsTxt from "astro-robots-txt";
import sitemap from "astro-sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://whitehatchem.github.io/',
  integrations: [
    preact(),
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }),
    mdx(),
    robotsTxt(),
    sitemap()
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathJax]
  }
});