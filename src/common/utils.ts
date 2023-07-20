import type { MoleculeData, MoleculeSource } from "./types";

export function truncate(str: string, length: number) {
  if (str.length > length) {
    return str.slice(0, length) + '...';
  } else return str;
}

export function mol_name(src: MoleculeSource) {
  const names = [
    src.psychonaut_names,
    src.tripsit_names,
    src.isomerd_names,
    src.druglab_names,
    src.drugmap_name,
    src.hsdb_names,
    src.wiki_name,
    src.market_name
  ].flat().filter(x => x !== null) as string[];
  return names.reduce((acc, curr) => (curr.length < acc.length) ? curr : acc);
}