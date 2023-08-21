import { useState, ReactNode } from "react"

export const WLink = ({ href, children }: { href: string, children: ReactNode }) => {
  return <a
    href={href}
    className="text-indigo-500 hover:text-indigo-900 dark:hover:text-indigo-100 font-bold"
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
    <button onClick={() => setOpen(!open)} className="text-indigo-500"> {open ? "Show less" : "Show all"} </button>
  </>
};


interface IHamburgerButton {
  href: string;
  children?: ReactNode
}
export const HamburgerButton = ({ href, children } : IHamburgerButton ) => {
  return <a
    href={href}
    className="block p-2 w-full"
  >
    {children}
  </a>
}


interface IHeaderButton {
  href: string;
  children?: ReactNode
}

export const HeaderButton = ({ href, children }: IHeaderButton) => {
  return <a
    role="link"
    href={href}
    className="
      flex items-center py-1 px-3 rounded-xl transition duration-150
      hover:bg-indigo-100 dark:hover:bg-neutral-700
      active:bg-indigo-200 
      hover:text-neutral-800 dark:hover:text-neutral-200
      text-neutral-600 dark:text-neutral-400
    "
  >
    {children}
  </a>
}


interface ISpinner {
  className?: string
}

export const Spinner = ({ className }: ISpinner) => {
  return <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 text-white ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
}