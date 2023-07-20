import { useEffect, useState } from "preact/hooks";
import type { MoleculeData, SimilarMolecules } from "../common/types";
import { i18n_href, type LangKey } from "../i18n/i18n";
import type { ComponentChildren } from "preact";
import { getSimilarities } from "../common/api";
import { CompoundNameLinks, CompoundNameList } from "./compound";
import { useDataLoader } from "../common/hooks";
import { CATEGORIES, Category, CategoryItem, cat2name } from "./categories";

export type SimilarityType = "docking" | "mol2vec"

function sim2string(sim: SimilarityType): string {
  if (sim === "docking") return "Docking"
  else if (sim === "mol2vec") return "Mol2Vec"
  return ""
}

const DEFAULT_ADDICT = 1.;
const DEFAULT_CLINTOX_PRED = 1.;
const DEFAULT_REC_TOX = 1.;

function check_default<T>(val: T, def: T): T | null { return (val === def) ? null : val; }

interface ICompoundSimilarities {
  data: MoleculeData
}

export const CompoundSimilarities = ({ data, lang }: ICompoundSimilarities & LangKey) => {
  const docking = data.embeddings.docking !== null;
  const [ more_options, set_more_options ] = useState<boolean>(false);

  const [ sim_type, set_sim_type ] = useState<SimilarityType>("mol2vec");
  const [ addict, set_addict ] = useState<number | null>(null);
  const [ clintox_pred, set_clintox_pred ] = useState<number | null>(null);
  const [ rec_tox, set_rec_tox ] = useState<number | null>(null);
  const [ bbb_perm, set_bbb_perm ] = useState<boolean>(false);
  const [ cat, set_cat ] = useState<string>("all");
  const [ showcat, set_showcat] = useState<boolean>(false);

  const sim_loader = useDataLoader<SimilarMolecules>();

  const filter = (x: number) => (1. / (1. + Math.log(x+1.)));
  
  useEffect(() => {
    const abortController = new AbortController();
    let handler = async () => {
      sim_loader.setLoading();
      try {
        const _data = await getSimilarities(
          data, sim_type,
          check_default(addict, DEFAULT_ADDICT),
          check_default(clintox_pred, DEFAULT_CLINTOX_PRED),
          check_default(rec_tox, DEFAULT_REC_TOX),
          bbb_perm ? false : null,
          abortController,
          cat
        );
        sim_loader.setData(_data)
      } catch (e: any) {
        sim_loader.setError(e.message)
      }
    }

    handler()
    return () => {
      abortController.abort()
    }
  }, [sim_type, addict, clintox_pred, rec_tox, bbb_perm, cat])

  return <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">


      <div class="flex flex-col justify-between items-center gap-2 lg:gap-4 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50 p-2 lg:flex-row">
        <label for="sim_type">Similarity type</label>
        <select
          id="sim_type"
          onChange={(e:any) => {set_sim_type(e.target.value)}}
          class="px-4 py-1 rounded-md dark:bg-indigo-800 bg-indigo-100"
        >
          <option value="mol2vec">{sim2string("mol2vec")}</option>
          {docking ? <option value="docking">{sim2string("docking")}</option> : null}
        </select>
      </div> 


      <button className="flex items-center gap-1 text-left text-indigo-400" onClick={() => {set_more_options(!more_options)}}>
        More options
        {
          more_options ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
          </svg>

        }
      </button>
      {
        more_options ? <div className="flex flex-col gap-4">
          <RangeOption
            name="sim_type"
            value={addict}
            default_val={DEFAULT_ADDICT}
            set_value={set_addict}
            min={0.}
            max={1.}
            toggleString="Filter by addictivity"
          >
            Max predicted addictivity
          </RangeOption>

          <RangeOption
            name="clintox_pred"
            value={clintox_pred}
            default_val={DEFAULT_CLINTOX_PRED}
            set_value={set_clintox_pred}
            min={0.}
            max={1.}
            toggleString="Filter by clinical toxicity"
          >
            Max clinical toxicity 
          </RangeOption>

          <RangeOption
            name="rec_tox"
            value={rec_tox}
            default_val={DEFAULT_REC_TOX}
            set_value={set_rec_tox}
            min={0.}
            max={1.}
            toggleString="Filter by recursive toxicity"
          >
            Max recursive toxicity
          </RangeOption>

          <Toggle name='bbb_perm' value={bbb_perm} set_value={set_bbb_perm}>
            No BBB Permeability
          </Toggle>

          <div class="border dark:border-neutral-800 bg-neutral-200/20 dark:bg-neutral-800/20 rounded-lg p-2">
            <div class="flex flex-col justify-between items-center gap-2 lg:gap-4 lg:flex-row">
              <label for="category">Compound category</label>
              <select
                id="category"
                onChange={(e:any) => {set_cat(e.target.value)}}
                class="py-1 rounded-md dark:bg-indigo-800 bg-indigo-100"
              >
                <option value="all">All</option>
                {(Object.keys(CATEGORIES) as Category[]).map((key, i) => <option value={key}>{cat2name(key)}</option>)}
              </select>

            </div>
            <div class="flex flex-col">
              <button onClick={() => set_showcat(!showcat)} class="text-center text-sm text-neutral-800 hover:text-neutral-600 dark:text-neutral-400 hover:dark:text-neutral-200">Learn more about each category</button>
              { showcat && <span class="flex flex-wrap gap-2 dark:text-neutral-200 mt-4">
                {(Object.keys(CATEGORIES) as Category[]).map((key, i) => <CategoryItem cat={key}/>)}
              </span>}
            </div>
          </div> 
        </div> : null
      }
    </div>
    <hr className="m-4 border-neutral-600"/>
    <p className="">Here are the most similar molecules satisfying the given constraints:</p>
    <div class="flex flex-col mt-4 gap-2">

      { sim_loader.data ? sim_loader.data.data.filter(x => (x._id !== data._id)).map((x,i) => {
          const sim = filter(x.proximity_distance);
          return <>
            {
              (x.sources === null) ?
                <div class="group py-1 flex lg:flex-row flex-col gap-2 items-center justify-between min-h-16">
                  <div class="flex flex-row items-center justify-start w-full grow">
                    <span class="w-12 text-center text-indigo-400 dark:text-indigo-200 text-xl">{i}</span>
                    <div class="flex flex-col">
                      <CompoundNameLinks data={x} lang={lang} />
                    </div>
                  </div>
                  <PercentBar x={sim}/>
                </div>
              :
                <a
                  href={i18n_href(`/molecule/${x._id}`, lang)}
                  class="group flex lg:flex-row flex-col gap-2 items-center justify-between min-h-16"
                >
                  <div class="flex py-1 flex-row items-center justify-start w-full grow">
                    <span class="w-12 text-center text-indigo-400 dark:text-indigo-200 text-xl">{i}</span>
                    <div class="flex flex-col">
                      <CompoundNameList src={x.sources} />
                    </div>
                  </div>
                  <PercentBar x={sim}/>
                </a>
            }
            { i+1 < sim_loader.data!.data.length && <hr class="dark:border-neutral-800"/>}
          </>
        }) : sim_loader.error ? <p class="text-red-400">
          Error, couldn't fetch data: {sim_loader.error.message}
        </p> : sim_loader.loading ? <div class="w-full h-96 p-8 flex items-center justify-center">
          <Spinner />
        </div> : null
      }
    </div>
  </div> 
}


interface ISpinner {
  className?: string
}

export const Spinner = ({ className }: ISpinner) => {
  return <svg class={`animate-spin -ml-1 mr-3 h-5 w-5 text-white ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
}


interface IRangeOption {
  name: string,
  value: number | null,
  default_val: number,
  set_value: (x: number | null) => void
  min: number,
  max: number,
  toggleString: string,
  children: ComponentChildren
}
export const RangeOption  = ({name, value, default_val, set_value, min, max, children, toggleString}: IRangeOption) => {
  const step = (max-min) / 10.;
  return <div class="flex flex-col gap-2 border dark:border-neutral-800 bg-neutral-200/20 dark:bg-neutral-800/20 rounded-lg p-2">
    <div className="flex flex-row gap-2 items-center">
      <input
        onChange={(e:any) => {set_value((e.target.checked as boolean) ? default_val : null)}}
        type="checkbox"
        id={`${name}_toggle`}
        name={`${name}_toggle`}
        checked={value !== null}
      />
      <label for={`${name}_toggle`}>{toggleString}</label>
    </div>
    {value !== null && <div class="flex flex-col justify-between items-center gap-2 lg:gap-4 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50 p-2 lg:flex-row">
      <label for={name}>{children}</label>
      <div class="flex gap-2">
        <span class="font-bold dark:text-indigo-400 text-indigo-600">{value}</span>
        <input
          onChange={(e:any) => {set_value(e.target.value)}}
          type="range"
          id={name}
          name={name}
          min={min}
          max={max}
          value={value}
          step={step}
        />
      </div>
    </div>}
  </div>
}


interface IToggle {
  name: string,
  value: boolean,
  set_value: (x: boolean) => void
  children: ComponentChildren
}
export const Toggle = ({name, value, set_value, children}: IToggle) => {
  return <div class="flex flex-row items-center gap-2 border dark:border-neutral-800 bg-neutral-200/20 dark:bg-neutral-800/20 rounded-lg p-2">
    <input
      onChange={(e:any) => {set_value(e.target.checked as boolean)}}
      type="checkbox"
      id={`${name}_toggle`}
      name={`${name}_toggle`}
      checked={value}
    />
    <label for={`${name}_toggle`}>{children}</label>
  </div> 
}


export interface IPercentBar {
  x: number;
}

export const PercentBar = ({ x }: IPercentBar) => {
  const green = Math.round(255 * x);
  const red = Math.round(255 * (1-x));
  return <span class="flex items-center w-full lg:w-min">
    <p class="text-sm text-neutral-600 dark:text-neutral-400 text-sm mr-2">{`${(Math.round(x * 1000) / 10).toFixed(1)}%`}</p>
    <div class="w-full lg:w-60 h-5 bg-neutral-200 dark:bg-neutral-700 rounded border border-neutral-300 dark:border-neutral-600 overflow-hidden">
        <div
            class="h-full rounded text-xs"
            style={{
                width: `${100 * x}%`,
                backgroundColor: `rgb(${red}, ${green}, 0)`,
            }}
        />
    </div>
  </span>
}
