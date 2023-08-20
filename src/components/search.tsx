import { useTranslations, type LangKey, i18n_href } from "../i18n/i18n"
import { WLink } from "./components";

interface ISearchBox {
  search: string
  discover?: boolean
}

export const SearchBox = ({ search, discover, lang }: ISearchBox & LangKey) => {
  const t = useTranslations(lang);
  return <form action={i18n_href("/search", lang)} className="w-full flex flex-col items-center mb-16">
      <div className="w-full max-w-lg flex items-center gap-2">
          <label htmlFor="search">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-neutral-600 dark:text-neutral-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
          </label>
          <input
              className="w-full text-xl outline-none bg-transparent border-b border-neutral-300 dark:border-neutral-600 focus:border-indigo-400 dark:focus:border-indigo-400"
              type="text"
              name="q"
              id="search"
              value={search}
              placeholder={t('search.placeholder')}
          />
      </div>
      { !discover && <span className="my-4 text-neutral-700 dark:text-neutral-200"> Or check <WLink href={i18n_href("/search", lang)}>example compounds</WLink> </span> }
  </form>
}