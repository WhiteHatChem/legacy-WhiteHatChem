export const CATEGORIES = {
  "substituted_piperazine": "https://en.wikipedia.org/wiki/Substituted_piperazine",
  "substituted_phenylmorpholine": "https://en.wikipedia.org/wiki/Substituted_phenylmorpholine", 
  "substituted_cathinone": "https://en.wikipedia.org/wiki/Substituted_cathinone", 
  "methylphenidate_analogue": "https://en.wikipedia.org/wiki/List_of_methylphenidate_analogues", 
  "aminorex_analogue": "https://en.wikipedia.org/wiki/List_of_aminorex_analogues", 
  "imidazopyridine": "https://fr.wikipedia.org/wiki/Imidazopyridine", 
  "DOx": "https://en.wikipedia.org/wiki/DOx", 
  "benzimidazole_opioid": "https://en.wikipedia.org/wiki/List_of_benzimidazole_opioids", 
  "arylcyclohexylamine": "https://en.wikipedia.org/wiki/Arylcyclohexylamine", 
  "xanthine": "https://en.wikipedia.org/wiki/Category:Xanthines", 
  "tryptamine": "https://en.wikipedia.org/wiki/Category:Tryptamines", 
  "tropane": "https://en.wikipedia.org/wiki/Tropane", 
  "tricyclic": "https://en.wikipedia.org/wiki/Tricyclic", 
  "thiobarbiturate": "https://en.wikipedia.org/wiki/Category:Thiobarbiturates", 
  "cyclopyrrolone": "https://en.wikipedia.org/wiki/Cyclopyrrolones", 
  "pyrazolopyrimidine": "https://en.wikipedia.org/wiki/Pyrazolopyrimidine", 
  "substituted_phenethylamine": "https://en.wikipedia.org/wiki/Substituted_phenethylamine", 
  "lysergamide": "https://en.wikipedia.org/wiki/Lysergamides", 
  "diphenylbutylpiperidine": "https://en.wikipedia.org/wiki/Diphenylbutylpiperidine", 
  "racetam": "https://en.wikipedia.org/wiki/Racetam", 
  "benzodiazepine": "https://en.wikipedia.org/wiki/Benzodiazepine", 
  "barbiturate": "https://en.wikipedia.org/wiki/Barbiturate", 
  "alkyl_nitrite": "https://en.wikipedia.org/wiki/Alkyl_nitrites", 
  "25nb": "https://en.wikipedia.org/wiki/25-NB", 
  "2c": "https://en.wikipedia.org/wiki/2C_(psychedelics)", 
  "substituted_amphetamine": "https://en.wikipedia.org/wiki/Category:Substituted_amphetamines",
}

export type Category = keyof typeof CATEGORIES;

export const cat2name = (cat: string) => {
  const tmp = cat.charAt(0).toUpperCase() + cat.slice(1);
  return tmp.replace('_', ' ');
}

interface ICategoryItem {
  cat: Category
}

export const CategoryItem = ({ cat }: ICategoryItem) => {
  return <a
    class="bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 hover:dark:bg-neutral-700 px-2 py-1 rounded-full whitespace-nowrap"
    href={CATEGORIES[cat]}
  >
    {cat2name(cat)}
  </a>
}

interface ICategoryGrid {
  cat: Record<Category, boolean>
}

export const CategoryGrid = ({ cat }: ICategoryGrid) => {
  return <div class="grid grid-cols-2 lg:grid-cols-3 text-sm gap-1">
    {(Object.keys(cat) as Category[]).map((key, i) => (
      <a
        href={CATEGORIES[key]}
        class={`
          px-2 py-1 rounded-md text-center break-words
          ${cat[key] && 'bg-green-200 hover:bg-green-300 dark:bg-green-800 hover:dark:bg-green-700'}
          ${!cat[key] && 'bg-red-200 hover:bg-red-300 dark:bg-red-800 hover:dark:bg-red-700'}
        `}
      >
        {cat2name(key)}
      </a>
    ))}
  </div>
}

interface ICategoryToggle {
  cat: Category
  state: boolean
  setState: (x: boolean) => void
}

export const CategoryToggle = ({ cat, state, setState }: ICategoryToggle) => {
  return <a
    class="bg-neutral-200 hover:bg-neutral-300 px-2 py-1 rounded-full whitespace-nowrap"
    href={CATEGORIES[cat]}
  >
    {cat2name(cat)}
  </a>
}
