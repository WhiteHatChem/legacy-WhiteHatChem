import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";
import preact from '@astrojs/preact';

// https://astro.build/config
import mdx from "@astrojs/mdx";

import remarkMath from "remark-math"
import rehypeMathJax from 'rehype-mathjax';

// https://astro.build/config
export default defineConfig({
  site: 'https://whitehatchemistry.github.io',
  integrations: [
    preact(),
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }),
    mdx()
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathJax],
  }
});