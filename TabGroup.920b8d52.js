import{p as s,T as n,o as l}from"./chunks/jsxRuntime.module.9c73e7ed.js";import"./chunks/preact.module.3693803d.js";const b=({tabs:o,defaultActiveTab:d,tabsSelector:a})=>{const[t,c]=s(d),i=n(e=>{document.querySelectorAll(a).forEach(r=>r.classList.remove("active")),document.querySelectorAll(`${a}#${e}`).forEach(r=>r.classList.add("active")),c(e)},[]);return l("div",{className:"flex flex-wrap flex-row gap-2",children:o.map(e=>l("button",{disabled:!e.available,className:`
						disabled:opacity-50 disabled:cursor-not-allowed
						px-3 py-1 rounded-xl
						${t===e.id?"bg-neutral-200 dark:bg-neutral-700":""}
						border border-neutral-300 dark:border-neutral-600
					`,onClick:()=>i(e.id),children:e.label},e.id))})};export{b as default};
