import { p } from "../../dist/client/_astro/hooks.module.8de731b1";
import type { MoleculeData, MoleculeSource } from "./types";

export function truncate(str: string, length: number) {
  if (str.length > length) {
    return str.slice(0, length) + '...';
  } else return str;
}

export function shortest(l: string[]): string {
  return l.reduce((acc, curr) => (curr.length < acc.length) ? curr : acc);
}

export function mol_name(src: MoleculeData) {
  const { inchi, sources } = src;
  const {
    psychonaut_names,
    tripsit_names,
    isomerd_names,
    druglab_names,
    drugmap_name,
    hsdb_names,
    wiki_name,
    market_name
  } = sources;
  const names = [
    psychonaut_names,
    tripsit_names,
    isomerd_names,
    druglab_names,
    drugmap_name,
    hsdb_names,
    wiki_name,
    market_name
  ].flat().filter(x => x !== null) as string[];
  return names.length === 0 ? inchi : shortest(names)
}

export function no_names(src: MoleculeSource): boolean {
  const {
    psychonaut_names,
    tripsit_names,
    isomerd_names,
    druglab_names,
    drugmap_name,
    hsdb_names,
    wiki_name,
    market_name
  } = src;
  return (psychonaut_names === null && tripsit_names === null && isomerd_names === null && druglab_names === null && drugmap_name === null && hsdb_names === null && wiki_name === null && market_name === null);
}