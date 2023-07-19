import type { Category } from "../components/categories"
export type Theme = "light" | "dark";

export interface MoleculeSource {
  psychonaut_names: string[] | null;
  tripsit_names: string[] | null;
  isomerd_names: string[] | null;
  isod_ids: number[] | null;
  druglab_names: string[] | null;
  druglab_href: string[] | null;
  drugmap_id: string[] | null;
  drugmap_name: string | null;
  hsdb_names: string[] | null;
  cid: number[] | null;
  wiki_name: string[] | null;
  market_name: string | null;
  chemograph: boolean|null;
}

export interface MoleculeData {
  inchi: string;
  _id: string;
  svg: string;
  sources: MoleculeSource; 
  search: number;
  toxic: boolean
  metabolite: boolean
  synonyms: Array<string> | null;
  solubility: number|null;
  solubility_comment : string|null;
	clintox_pred: number|null;
	recursive_toxicity: number|null; 
	addictive_prediction: number|null;
	bbb_permeability: number|null;
  categories: Record<Category, boolean>;
  embeddings: {
    docking: Array<number> | null,
    mol2vec: Array<number>,
  };
  metabolism?: {
    anteriors: Reaction[];
    posteriors: Reaction[];
  }
}

export interface Reaction {
  reaction_name: string;
  reaction_id: string;
  enzymes: string;
  inchi: string;
  _id?: string;
  sources?: MoleculeSource
}

export interface Blog {
  title: string
  date: string
  author: string
}

export type SimilarMolecules = Array<MoleculeData & { proximity_distance: number }>

export type Result<T> = { _type: 'error', m: string } | { _type: 'data', data: T};