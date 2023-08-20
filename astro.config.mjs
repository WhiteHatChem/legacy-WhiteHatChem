import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeMathJax from 'rehype-mathjax';
import robotsTxt from "astro-robots-txt";
import sitemap from "astro-sitemap";
import node from "@astrojs/node";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://whitehatchem.github.io/',
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), mdx(), robotsTxt(), sitemap(), react()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathJax]
  },
  adapter: node({
    mode: "standalone"
  })
});