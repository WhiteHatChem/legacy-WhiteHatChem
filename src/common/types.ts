export type Theme = "light" | "dark";

export interface MoleculeIdentifier {
  inchi: string
  name: string
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
  search: number;
  toxic: boolean
  metabolite: boolean
}

export interface MoleculeData {
  id: MoleculeIdentifier;
  market_name: string | null;
  struct_sim: Array<SimilarMolecule> | null;
  binding_sim: Array<SimilarMolecule> | null;
  less_addictive_sim: Array<SimilarMolecule> | null;
  binding_affinities: { [key: string]: number } | null;
  synonyms: Array<string> | null;
  svg: string;
  metabolism: {
    anterior: Array<Reaction> | null
    posterior: Array<Reaction> | null
  } | null,
  solubility: number|null;
  solubility_comment : string|null;
	chemograph: boolean|null;
	clintox_pred: number|null;
	recursive_toxicity: number|null; 
	addictive_prediction: number|null;
	bbb_permeability: number|null;
}

export interface Reaction {
  name: string;
  enzymes: Array<string>;
  product: MoleculeIdentifier;
}

export interface SimilarMolecule {
  id: MoleculeIdentifier;
  dist: number
}

export interface Blog {
  title: string
  date: string
  author: string
}