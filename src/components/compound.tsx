import psychonaut from '../assets/img/psychonaut_icon.png'
import tripsit from '../assets/img/tripsit_icon.png'
import isomerdesign from '../assets/img/isomerdesign_icon.png'
import pubchem from '../assets/img/pubchem_icon.png'
import druglab from '../assets/img/druglab.ico'
import drugmap from '../assets/img/drugmap.ico'
import wikipedia from '../assets/img/wikipedia.svg'
import { truncate } from '../common/utils'
import { useTranslations, LangKey, i18n_href } from '../i18n/i18n'
import type { MoleculeData } from '../common/types'
import { svg_path } from '../common/api'


/* CompoundSvg */

export interface ICompoundSvg  {
  _id: string
}

export const CompoundSvg = ({ _id }: ICompoundSvg) => {
  const svg = svg_path(_id);
  return (
    svg ? <img
        class="dark:invert-[.8]"
        src={svg}
        loading="lazy"
    /> : <span class="text-sm font-light text-red-400 my-auto">
        img not found
    </span>
  )
}


/* CompoundName */

interface ICompoundName {
  name: string;
  site: 'psychonaut' | 'tripsit' | 'isomerdesign' | 'pubchem' | 'druglab' | 'drugmap' | 'wiki' | 'none';
  toxic?: boolean;
  metabolite?: boolean;
}

export const CompoundName = ({ name, site, toxic, metabolite}: ICompoundName ) => {
  return <div class="flex flex-row items-center gap-2">
    {
      site === 'none' ? <>
          <svg class="w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
          <h2 title={name} class="text-neutral-500 text-sm leading-tight">{truncate(name,20)}</h2>
      </> : metabolite ? <>
          <svg class="w-4 text-violet-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"></circle><path d="m9 20 3-6 3 6"></path><path d="m6 8 6 2 6-2"></path><path d="M12 10v4"></path></svg>
          <h2 title={name} class="text-violet-500 text-sm leading-tight">Metabolite: {truncate(name,15)}</h2>
      </> : <>
        <img
            src={
              site === 'psychonaut' ? psychonaut :
              site === 'tripsit' ? tripsit :
              site === 'isomerdesign' ? isomerdesign :
              site === 'pubchem' ? pubchem :
              site === 'druglab' ? druglab :
              site === 'drugmap' ? drugmap :
              site === 'wiki' ? wikipedia :
              ''
            }
            class="w-4 rounded"
            alt={site}
        />
        <h2
          title={name}
          class={`group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm leading-tight ${toxic && 'text-rose-500'}`}
        >
          {truncate(name,20)}
        </h2>
      </>
    }
  </div>
}


/* CompoundNameLink */

const getLink = (site: string, name: string, id: number | string | null) => {
  switch (site) {
    case 'psychonaut':
      return `https://psychonautwiki.org/wiki/${name}`;
    case 'tripsit':
      return `https://drugs.tripsit.me/${name}`
    case 'isomerdesign':
      return `https://isomerdesign.com/PiHKAL/explore.php?id=${id}`;
    case 'pubchem':
      return `https://pubchem.ncbi.nlm.nih.gov/compound/${id}`;
    case 'druglab':
      return `https://druglab.fr/substances/${id}/`;
    case 'drugmap':
      return `http://drugmap.idrblab.net/data/drug/details/${id}`
    case 'wiki':
      return `https://en.wikipedia.org/wiki/${name}`;
  }
};

interface ICompoundNameLink  {
    names: string | string[] | null;
    ids: number[] | string[] | null;
    toxic?: boolean;
    col?: boolean;
    site: 'psychonaut' | 'tripsit' | 'isomerdesign' | 'pubchem' | 'druglab' | 'drugmap' | 'wiki';
}

export const CompoundNameLink = ({ names, ids, toxic, col, site, lang }: ICompoundNameLink & LangKey) => {
  const t = useTranslations(lang);

  if (ids != null && typeof(names) === 'string') {
    names = Array(ids.length).fill(names);
  }
  
  return (
    (names && Array.isArray(names)) ?
      <>
        {names.map((name, idx) =>
          <a class={`flex ${col ? 'lg:flex-col' : 'lg:flex-row'} flex-col lg:items-center`} href={getLink(site, name, ids ? ids[idx] : null)} target="_blank">
            <CompoundName name={name} site={site} toxic={toxic}/>
            <p class="text-sm text-neutral-400 dark:text-neutral-400 flex flex-row items-center gap-2 lg:ml-2">
                {t('molecule.checkon')} {site}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-sm text-neutral-400 dark:text-neutral-600">
                    <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clip-rule="evenodd" />
                    <path fill-rule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clip-rule="evenodd" />
                </svg>
            </p>
          </a>)
      }</>
    : null
  )
}


/* CompoundNameLinks */

interface ICompoundNameLinks  {
    data: MoleculeData;
    col?: boolean;
}

export const CompoundNameLinks = ({ data, col, lang}: ICompoundNameLinks & LangKey) => {

  const {
    inchi,
    psychonaut_names,
    tripsit_names,
    isomerd_names,
    isod_ids,
    druglab_names, druglab_href,
    drugmap_name, drugmap_id,
    hsdb_names, cid,
    wiki_name,
    search, toxic, metabolite,
  } = data;

  const nosite = (
    psychonaut_names === null &&
    tripsit_names === null &&
    isomerd_names === null &&
    druglab_names === null &&
    hsdb_names === null &&
    drugmap_name === null &&
    wiki_name === null
  );

  return (
    nosite ? 
    <CompoundName site='none' name={inchi} toxic={toxic} />
    : <>
        <CompoundNameLink lang={lang} names={tripsit_names} ids={null} site={'tripsit'} toxic={toxic} col={col} />
        <CompoundNameLink lang={lang} names={psychonaut_names} ids={null} site={'psychonaut'} toxic={toxic} col={col} />
        <CompoundNameLink lang={lang} names={isomerd_names} ids={isod_ids} site={'isomerdesign'} toxic={toxic} col={col} />
        <CompoundNameLink lang={lang} names={hsdb_names} ids={cid} site={'pubchem'} toxic={toxic} col={col} />
        <CompoundNameLink lang={lang} names={druglab_names} ids={druglab_href} site={'druglab'} toxic={toxic} col={col} />
        <CompoundNameLink lang={lang} names={drugmap_name} ids={drugmap_id} site={'drugmap'} toxic={toxic} col={col} />
        <CompoundNameLink lang={lang} names={wiki_name} ids={null} site={'wiki'} toxic={toxic} col={col} />
    </>
  )
} 


/* CompoundNameList */

interface ICompoundNameList  {
    data: MoleculeData;
}

export const CompoundNameList = ({ data }: ICompoundNameList) => {
  const {
    psychonaut_names,
    tripsit_names,
    isomerd_names,
    hsdb_names,
    druglab_names,
    drugmap_name,
    wiki_name,
  } = data;

  return <>
    {psychonaut_names && psychonaut_names.map(name => <CompoundName name={name} site="psychonaut" toxic={data.toxic} />)}
    {tripsit_names && tripsit_names.map(name => <CompoundName name={name} site="tripsit" toxic={data.toxic}/>)}
    {isomerd_names && isomerd_names.map(name => <CompoundName name={name} site="isomerdesign" toxic={data.toxic}/>)}
    {hsdb_names && hsdb_names.map(name => <CompoundName name={name} site="pubchem" toxic={data.toxic}/>)}
    {druglab_names && druglab_names.map(name => <CompoundName name={name} site="druglab" toxic={data.toxic}/>)}
    {drugmap_name && <CompoundName name={drugmap_name} site="drugmap" toxic={data.toxic}/>}
    {wiki_name && wiki_name.map(name => <CompoundName name={name} site="wiki" toxic={data.toxic}/>)}
  </>
}


/* CompoundCard */

interface ICompoundCard  {
  data: MoleculeData;
}

export const CompoundCard = ({ data, lang }: ICompoundCard & LangKey) => {
  const { _id } = data;

  return <a
    href={i18n_href(`/molecule/${_id}`, lang)}
    class="flex flex-col items-center group"
>
    <div class="flex flex-col">
        <CompoundNameList data={data}/>
    </div>
    <div class="w-full border-t border-neutral-400/20 dark:border-neutral-600 mt-2 group-hover:border-indigo-400/50 dark:group-hover:border-indigo-400"/>
    <CompoundSvg _id={_id}/>
</a>
}