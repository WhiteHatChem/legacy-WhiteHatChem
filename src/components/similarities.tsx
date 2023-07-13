import { useEffect, useState } from "preact/hooks";
import type { MoleculeData, SimilarMolecules } from "../common/types";
import { i18n_href, type LangKey } from "../i18n/i18n";
import type { ComponentChildren } from "preact";
import { getSimilarities } from "../common/api";
import { CompoundNameLinks, CompoundNameList } from "./compound";
import { useCallback } from "react";
import { useDataLoader } from "../common/hooks";


interface ICompoundSimilarities {
  data: MoleculeData
}

export type SimilarityType = "docking" | "mol2vec"

function sim2string(sim: SimilarityType): string {
  if (sim === "docking") return "Docking"
  else if (sim === "mol2vec") return "Mol2Vec"
  return ""
}

export const CompoundSimilarities = ({ data, lang }: ICompoundSimilarities & LangKey) => {
  const [ sim_type, set_sim_type ] = useState<SimilarityType>("docking");
  const [ addict, set_addict ] = useState<number>(1.);
  const [ clintox_pred, set_clintox_pred ] = useState<number>(1.);
  const [ rec_tox, set_rec_tox ] = useState<number>(1.);
  const [ bbb_perm, set_bbb_perm ] = useState<boolean>(true);

  const sim_loader = useDataLoader<SimilarMolecules>();

  const filter = (x: number) => (1. / (1. + Math.log(x+1.)));
  
  useEffect(() => {
    const abortController = new AbortController();
    let handler = async () => {
      sim_loader.setLoading();
      try {
        const _data = await getSimilarities( data, sim_type, addict, clintox_pred, rec_tox, bbb_perm, abortController );
        sim_loader.setData(_data)
      } catch (e: any) {
        sim_loader.setError(e.message)
      }
    }

    handler()
    return () => {
      abortController.abort()
    }
  }, [sim_type, addict, clintox_pred, rec_tox, bbb_perm])

  return <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2">


      <div class="flex flex-col justify-between items-center gap-2 lg:gap-4 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50 p-2 lg:flex-row">
        <label for={sim_type}>Similarity type</label>
        <select
          id="sim_type"
          onChange={(e:any) => {set_sim_type(e.target.value)}}
          class="px-4 py-1 rounded-md dark:bg-indigo-800 bg-indigo-100"
        >
          <option value="docking">{sim2string("docking")}</option>
          <option value="mol2vec">{sim2string("mol2vec")}</option>
        </select>
      </div> 

      <RangeSlider name="sim_type" value={addict} set_value={set_addict} min={0.} max={1.}>
        Max predicted addictivity
      </RangeSlider>

      <RangeSlider name="clintox_pred" value={clintox_pred} set_value={set_clintox_pred} min={0.} max={1.}>
        Max clinical toxicity 
      </RangeSlider>

      <RangeSlider name="rec_tox" value={rec_tox} set_value={set_rec_tox} min={0.} max={1.}>
        Max clinical toxicity 
      </RangeSlider>

      <Toggle name='bbb_perm' value={bbb_perm} set_value={set_bbb_perm}>
        BBB Permeability
      </Toggle>
    </div>
    <p>Here are the most similar molecules satisfying the given constraints:</p>
    <div class="flex flex-col mt-4 gap-2">

      { sim_loader.data ? sim_loader.data.data.map((x,i) => {
          const sim = filter(x.proximity_distance);
          return <>
            {
              !x.search ?
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
                      <CompoundNameList data={x} />
                    </div>
                  </div>
                  <PercentBar x={sim}/>
                </a>
            }
            { i+1 < sim_loader.data!.data.length && <hr class="border-neutral-300 dark:border-neutral-600"/>}
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


interface ISpinner {
  className?: string
}

export const Spinner = ({ className }: ISpinner) => {
  return <svg class={`animate-spin -ml-1 mr-3 h-5 w-5 text-white ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
}


interface IRangeSlider {
  name: string,
  value: number,
  set_value: (x: number) => void
  min: number,
  max: number,
  children: ComponentChildren
}
export const RangeSlider = ({name, value, set_value, min, max, children}: IRangeSlider) => {
  const step = (max-min) / 100.;
  return <div class="flex flex-col justify-between items-center gap-2 lg:gap-4 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50 p-2 lg:flex-row">
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
  </div> 
}


interface IToggle {
  name: string,
  value: boolean,
  set_value: (x: boolean) => void
  children: ComponentChildren
}
export const Toggle = ({name, value, set_value, children}: IToggle) => {
  return <div class="flex flex-col justify-between items-center gap-2 lg:gap-4 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/50 p-2 lg:flex-row">
    <label for={name}>{children}</label>
    <input
      onChange={(e:any) => {set_value(e.target.checked)}}
      type="checkbox"
      id={name}
      name={name}
      checked={value}
    />
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