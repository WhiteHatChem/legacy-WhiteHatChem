import{h as i,T as n,p as u,o as d}from"./chunks/jsxRuntime.module.18bd190c.js";import"./chunks/preact.module.31e6e530.js";const b=({tabs:c,defaultActiveTab:r,tabsSelector:a})=>{const[s,t]=i(r),o=n(e=>{document.querySelectorAll(a).forEach(l=>l.classList.remove("active")),document.querySelectorAll(`${a}#${e}`).forEach(l=>l.classList.add("active")),t(e)},[]);return u(()=>{o(r)},[r]),d("div",{className:"flex flex-wrap flex-row gap-2",children:c.map(e=>d("button",{disabled:!e.available,className:`
						disabled:opacity-50 disabled:cursor-not-allowed
						px-3 py-1 rounded-xl
						${s===e.id?"bg-neutral-200 dark:bg-neutral-700":""}
						border border-neutral-300 dark:border-neutral-600
					`,onClick:()=>o(e.id),children:e.label},e.id))})};export{b as default};
