import type { ComponentChildren } from "preact"
import { useState } from "preact/hooks"

export const WLink = ({ href, children }: { href: string, children: ComponentChildren}) => {
  return <a
    href={href}
    class="text-indigo-500 hover:text-indigo-900 dark:hover:text-indigo-100 font-bold"
  >
    {children}
  </a>
}


interface ISynonyms {
  synonyms: Array<string>
}

export const Synonyms = ({ synonyms }: ISynonyms) => {
  const [open, setOpen] = useState<boolean>(false);
  return <>
    <span className={`font-gray font-light text-neutral-800 dark:text-neutral-200 ${open ? "line-clamp-none" : "line-clamp-1"}`} > {synonyms.join(',')} </span>
    <button onClick={() => setOpen(!open)} class="text-indigo-500"> {open ? "Show less" : "Show all"} </button>
  </>
};