import{h as s,T as n,p}from"./hooks.module.b6f206d6.js";import{o as d}from"./jsxRuntime.module.ab0a7853.js";import"./preact.module.dec703d8.js";const f=({tabs:c,defaultActiveTab:r,tabsSelector:o})=>{const[t,i]=s(r),a=n(e=>{document.querySelectorAll(o).forEach(l=>l.classList.remove("active")),document.querySelectorAll(`${o}#${e}`).forEach(l=>l.classList.add("active")),i(e)},[]);return p(()=>{a(r)},[r]),d("div",{className:"flex flex-wrap flex-row gap-2",children:c.map(e=>d("button",{disabled:!e.available,className:`
						disabled:opacity-50 disabled:cursor-not-allowed
						px-3 py-1 rounded-xl
						${t===e.id?"bg-neutral-200 dark:bg-neutral-700":""}
						border border-neutral-300 dark:border-neutral-600
					`,onClick:()=>a(e.id),children:e.label},e.id))})};export{f as default};
