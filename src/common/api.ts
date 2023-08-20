import type { SimilarityType } from "../components/similarities";
import type { MoleculeData, SimilarMolecules, Result } from "./types";

const SERVER = "https://api.whitehatchemistry.com:8000";
const PAGE_SIZE = 30;

export function svg_path(_id: string): string {
  return `${SERVER}/static/svg/${_id}.svg`;
}

export async function getMoleculeByInchikey(inchikey: string): Promise<Result<Array<MoleculeData>>> {
  try {
    const r = await fetch(`${SERVER}/compound/inchikey/${inchikey}`);
    const data: Array<MoleculeData> = await r.json();
    return { _type:'data', data: data }
  } catch (e: any) {
    return { _type:'error', m: e.message}
  }
}

export async function getMoleculeByID(_id: string): Promise<Result<MoleculeData>> {
  try {
    const r = await fetch(`${SERVER}/compound/_id/${_id}`);
    const data: MoleculeData = await r.json();
    return { _type:'data', data: data }
  } catch (e: any) {
    return { _type:'error', m: e.message}
  }
}

export async function postSearch(
  query: string,
  page: number
) : Promise<Result<{data: MoleculeData[], done: boolean}>> {
  try {
    const r = await fetch(
      `${SERVER}/search`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          offset: page * PAGE_SIZE
        }),
      }
    );
    const data: Array<MoleculeData> = await r.json();
    return {
      _type: 'data',
      data: {
        data: data,
        done: data.length < PAGE_SIZE
      }
    }
  } catch (e: any) {
    console.log(e);
    return { _type:'error', m: e.message}
  }
}

export async function postFeed(
  page: number
) : Promise<Result<{data: MoleculeData[], done: boolean}>> {
  try {
    const r = await fetch(
      `${SERVER}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offset: page * PAGE_SIZE
        }),
      }
    );
    const data: Array<MoleculeData> = await r.json();
    return {
      _type: 'data',
      data: {
        data: data,
        done: data.length < PAGE_SIZE
      }
    }
  } catch (e: any) {
    return { _type:'error', m: e.message}
  }
}

/* getSimilarities WITH CONSTRAINTS / OPTIONS
export async function getSimilarities(
  mol_data: MoleculeData,
  sim_type: SimilarityType,
  addict: number | null,
  clintox_pred: number | null,
  rec_tox: number | null,
  bbb_perm: boolean | null,
  controller: AbortController,
  category: string
): Promise<SimilarMolecules> {
  const vector = (
    sim_type === "docking" ? mol_data.embeddings.docking :
    sim_type === "mol2vec" ? mol_data.embeddings.mol2vec :
    null
  )

  const r = await fetch(
    `${SERVER}/similar_search`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        vector: vector,
        similarity_type: sim_type,
        addictive_prediction: addict,
        clintox_pred: clintox_pred,
        recursive_toxicity: rec_tox,
        bbb_permeability: bbb_perm,
        category: category
      }),
    }
  );
  const data: SimilarMolecules = await r.json();
  return data
} */

export async function getSimilarities(
  mol_data: MoleculeData,
  sim_type: SimilarityType,
  controller: AbortController,
): Promise<SimilarMolecules> {
  const vector = (
    sim_type === "docking" ? mol_data.embeddings.docking :
    sim_type === "mol2vec" ? mol_data.embeddings.mol2vec :
    null
  )

  const r = await fetch(
    `${SERVER}/similar_search`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        vector: vector,
        similarity_type: sim_type,
      }),
    }
  );
  const data: SimilarMolecules = await r.json();
  return data
}