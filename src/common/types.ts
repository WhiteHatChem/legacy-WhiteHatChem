export type Theme = "light" | "dark";

export interface MoleculeData {
  inchi: string
  name: number
  psychonaut_names: string[] | null;
  tripsit_names: string[] | null;
  isomerd_names: string[] | null;
  isod_ids: number[] | null;
  drugmap_id: string[] | null;
  drugmap_name: string | null;
  market_name: string | null;
  hsdb_names: string[] | null;
  cid: number[] | null;
  struct_sim: Array<SimilarMolecule> | null;
  binding_sim: Array<SimilarMolecule> | null;
  less_addictive_sim: Array<SimilarMolecule> | null;
  binding_affinities: { [key: string]: number } | null;
  synonyms: Array<string> | null;
  svg: string;
  search: number;
  metabolism: {
    anterior: Array<Reaction> | null
    posterior: Array<Reaction> | null
  } | null
}

export interface Reaction {
  name: string;
  enzymes: Array<string>;
  product: {
    name: string;
    inchi: string;
    psychonaut_names: string[] | null;
    tripsit_names: string[] | null;
    isomerd_names: string[] | null;
    isod_ids: number[] | null;
    hsdb_names: string[] | null;
    cid: number[] | null;
    toxic: boolean
    metabolite: boolean
  }
}

export interface SimilarMolecule {
  name: string
  inchi: string;
  psychonaut_names: string[] | null;
  tripsit_names: string[] | null;
  isomerd_names: string[] | null;
  isod_ids: number[] | null;
  hsdb_names: string[] | null;
  cid: number[] | null;
  dist: number
  toxic: boolean
  metabolite: boolean
}

export interface Blog {
  title: string
  date: string
  author: string
}