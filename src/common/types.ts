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
  sim: Array<SimilarMolecule>
  synonyms: Array<string> | null
  svg: string
  search: number
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