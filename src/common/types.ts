export type Theme = "light" | "dark";

export interface MoleculeData {
  inchi: string
  name: string
  psychonaut_names: string[] | null;
  tripsit_names: string[] | null;
  isomerd_names: string[] | null;
  isod_ids: number[] | null;
  hsdb_names: string[] | null;
  cid: number[] | null;
  struct_sim: Array<SimilarMolecule>;
  binding_sim: Array<SimilarMolecule> | null;
  less_addictive_sim: Array<SimilarMolecule> | null;
  binding_affinities: { [key: string]: number } | null;
  synonyms: Array<string> | null;
  svg: string;
  search: number;
}

export interface SimilarMolecule {
  name: string
  psychonaut_names: string[] | null;
  tripsit_names: string[] | null;
  isomerd_names: string[] | null;
  isod_ids: number[] | null;
  hsdb_names: string[] | null;
  cid: number[] | null;
  dist: number
  toxic: boolean
}

export interface Blog {
  title: string
  date: string
  author: string
}