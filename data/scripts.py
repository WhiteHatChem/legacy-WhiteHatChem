# transform the normalized file into a list of file for each molecule
import json
import os

from tqdm import tqdm
from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit.Chem.Draw.MolDrawing import DrawingOptions

PATH = 'full_drugs.json'

def index_to_inchi(data):
	index = {i: k for i, k in enumerate(data['cid'])}
	def f(idx):
		return index[idx]
	return f

def useful_data(data):
	useful_rows = [
		"inchi",
		"psychonaut_names",
		"tripsit_names",
		"isomerd_names",
		"isod_ids",
		"synonyms",
		"cid",
		"hsdb_names",
		"search",
		"name",
		"svg",
		"sdf",
		"struct_sim",
		"binding_sim",
		"less_addictive_sim",
		"binding_affinities",
	]
	return {k: data.get(k, None) for k in useful_rows}

def generate_jsons(
	output_path='json/',
	imgs_path='../public/svg',
	sdfs_path='../public/sdf',
):
	with open(PATH, 'r') as fi:
		data = json.load(fi)

	output = {k: {} for k, v in data['cid'].items()}
	idx2inchi = index_to_inchi(data)

	# add normalized data
	for k1, v1 in data.items():
		for k2, v2 in v1.items():
			output[k2][k1] = v2

	# add toxicity, inchi, and name
	for i, (k, v) in enumerate(output.items()):
		v['toxic'] = v['search'] == 0
		v['name'] = i
		v['inchi'] = k

	for k, v in tqdm(output.items(), desc='Generating images'):
		if v['toxic']: continue

		svg_name = f"{v['name']}.svg"
		sdf_name = f"{v['name']}.sdf"
		
		svg_path = os.path.join(imgs_path, svg_name)
		inchi_to_svg(v['inchi'], svg_path)
		v['svg'] = svg_name

		""" save time
		sdf_path = os.path.join(sdfs_path, sdf_name)
		inchi_to_sdf(v['inchi'], sdf_path)
		v['sdf'] = sdf_name
		"""

	for k, v in tqdm(output.items(), desc='Generating structural similarity'):
		if v['toxic']: continue

		v['struct_sim'] = []
		for dist, idx in zip(v['structural_distances'], v['structural_indices']):
			other_molecule = output[idx2inchi(idx)]
			useful_col = [ 'name', 'psychonaut_names', 'tripsit_names', 'isomerd_names', 'isod_ids', 'hsdb_names', 'cid', 'search', 'toxic' ]
			v['struct_sim'].append({
				**{k: other_molecule[k] for k in useful_col},
				'dist': dist
			})

	for k, v in tqdm(output.items(), desc='Generating binding affinities'):
		if v['toxic']: continue
		if v['affinity_distances'] is None or v['affinity_indices'] is None: continue

		v['binding_sim'] = []
		for dist, idx in zip(v['affinity_distances'], v['affinity_indices']):
			other_molecule = output[idx2inchi(idx)]
			useful_col = [ 'name', 'psychonaut_names', 'tripsit_names', 'isomerd_names', 'isod_ids', 'hsdb_names', 'cid', 'search', 'toxic' ]
			v['binding_sim'].append({
				**{k: other_molecule[k] for k in useful_col},
				'dist': dist
			})

	for k, v in tqdm(output.items(), desc='Generating less addictive affinities'):
		if v['toxic']: continue
		if v['less_addictive_distances'] is None or v['less_addictive_indices'] is None: continue

		v['less_addictive_sim'] = []
		for dist, idx in zip(v['less_addictive_distances'], v['less_addictive_indices']):
			other_molecule = output[idx2inchi(idx)]
			useful_col = [ 'name', 'psychonaut_names', 'tripsit_names', 'isomerd_names', 'isod_ids', 'hsdb_names', 'cid', 'search', 'toxic' ]
			v['less_addictive_sim'].append({
				**{k: other_molecule[k] for k in useful_col},
				'dist': dist
			})

	for k, v in tqdm(output.items(), desc='Generating affinities'):
		if v['toxic']: continue
	
		v['binding_affinities'] = {}
		for k1, v1 in v.items():
			if k1.startswith('AF-') or '_A_box' in k1:
				v['binding_affinities'][k1] = v1

	count = 0
	for k, v in tqdm(output.items(), desc='Saving JSONs'):
		if v['toxic']: continue

		f_name = f"{v['name']}.json"
		f_path = os.path.join(output_path, f_name)
		with open(f_path, 'w+') as fo:
			json.dump(useful_data(v), fo, indent=2)

		count += 1

	print(f"Generated {count} jsons.")


def inchi_to_svg(inchi, path):
	m = Chem.inchi.MolFromInchi(inchi)

	d = rdMolDraw2D.MolDraw2DSVG(400, 400)
	d.drawOptions().useBWAtomPalette()
	d.drawOptions().setBackgroundColour((0, 0, 0, 0))
	rdMolDraw2D.PrepareAndDrawMolecule(d, m)
	d.FinishDrawing()
	svg = d.GetDrawingText()

	with open(path, "w+") as f:
		f.write(svg)

def inchi_to_sdf(inchi, path):
	m = Chem.inchi.MolFromInchi(inchi)
	m = Chem.AddHs(m)
    # Generate the 3D coordinates
	AllChem.EmbedMolecule(m,maxAttempts=5000,randomSeed=72)
    # useRandomCoords=True
   # rdmolops.RemoveStereochemistry() 
	AllChem.MMFFOptimizeMolecule(m)
	Chem.MolToMolFile(m, path)

if __name__ == "__main__":
	generate_jsons()
