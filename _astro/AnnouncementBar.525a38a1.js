import{T as a}from"./hooks.module.a103bfa5.js";import{u as l}from"./hooks.830ac713.js";import{o as e}from"./jsxRuntime.module.8c8fd7af.js";import"./preact.module.3c5a6fb1.js";function s(r){const[n,t]=l("lastackannounce",null),o=a(()=>{t(Date.now())},[t]);return n===null?[!0,o]:[new Date(n)<r,o]}function k({LAST_ANNOUNCE:r,children:n}){const[t,o]=s(r);return t?e("div",{className:`
        relative text-neutral-800 dark:text-neutral-200
        bg-gradient-to-r from-blue-200/60 to-violet-200/60
        hover:from-blue-200/90 hover:to-violet-200/90
        dark:from-indigo-800/80 dark:to-violet-800/80
        dark:hover:from-blue-800/60 dark:hover:to-violet-800/60
    `,children:[e("div",{className:"py-1.5 px-4 flex justify-center text-center",children:n}),e("button",{onClick:o,className:"absolute px-1 inset-y-0 right-0",children:e("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"w-6 h-6",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6 18L18 6M6 6l12 12"})})})]}):null}export{k as default};
