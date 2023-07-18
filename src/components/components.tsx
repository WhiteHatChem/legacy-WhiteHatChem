import type { ComponentChildren } from "preact"

export const WLink = ({ href, children }: { href: string, children: ComponentChildren}) => {
  return <a
    href={href}
    class="text-indigo-500 hover:text-indigo-900 dark:hover:text-indigo-100 font-bold"
  >
    {children}
  </a>
}