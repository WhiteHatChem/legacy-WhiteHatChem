# transform the normalized file into a list of file for each molecule
import json
import os

from tqdm import tqdm
from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit.Chem.Draw.MolDrawing import DrawingOptions

PATH = 'drugs_metabolites.json'
METABOLISM_PATH = 'drugs_metabolites.json'

DOCKING_SITES = [
	'AF-A5X5Y0'
] # TODO

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

	output = {k: {} for k, _ in data['index'].items()}
	idx2inchi = data['index']
	inchi2idx = {v: k for k,v in idx2inchi.items()}

	# add normalized data
	for k1, v1 in data.items():
		for k2, v2 in v1.items():
			output[k2][k1] = v2

	# add toxicity, inchi, and name
	for k, v in output.items():
		v['toxic'] = v['search'] == 0
		v['nogen'] = v['toxic'] or v['metabolite']
		v['name'] = k
		v['inchi'] = v['index']

	for k, v in tqdm(output.items(), desc='Generating images'):
		if v['nogen']: continue

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
		if v['nogen']: continue

		v['struct_sim'] = []
		for dist, idx in zip(v['structural_distances'], v['structural_indices']):
			other_molecule = output[idx2inchi(idx)]
			useful_col = [ 'name', 'psychonaut_names', 'tripsit_names', 'isomerd_names', 'isod_ids', 'hsdb_names', 'cid', 'search', 'toxic' ]
			v['struct_sim'].append({
				**{k: other_molecule[k] for k in useful_col},
				'dist': dist
			})

	for k, v in tqdm(output.items(), desc='Generating binding affinities'):
		if v['nogen']: continue
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
		if v['nogen']: continue
		if v['less_addictive_distances'] is None or v['less_addictive_indices'] is None: continue
		if len(v['less_addictive_distances']) == 0 or len(v['less_addictive_indices']) == 0: continue

		v['less_addictive_sim'] = []
		for dist, idx in zip(v['less_addictive_distances'], v['less_addictive_indices']):
			other_molecule = output[idx2inchi(idx)]
			useful_col = [ 'name', 'psychonaut_names', 'tripsit_names', 'isomerd_names', 'isod_ids', 'hsdb_names', 'cid', 'search', 'toxic' ]
			v['less_addictive_sim'].append({
				**{k: other_molecule[k] for k in useful_col},
				'dist': dist
			})

	for k, v in tqdm(output.items(), desc='Generating affinities'):
		if v['nogen']: continue
	
		if v['affinity_emdeddings'] is not None:
			affinities = {}
			for aff, site in zip(v['affinity_emdeddings'], DOCKING_SITES):
				affinities[site] = aff
			v['binding_affinities'] = affinities

	# Add metabolism data
	with open(METABOLISM_PATH, 'r') as fi:
		metabolism_data = json.load(fi)

	def parse_reaction(reaction):
		return {
			'name': reaction[0],
			'enzymes': reaction[1].split('\n'),
			'products': reaction[2]
		}

	for i, inchi in metabolism_data['inchi']:
		metabolism = {'anterior': [], 'posterior': []}
		for reaction in metabolism_data['anteriors'][i]:
			metabolism['anterior'].append
		

	count = 0
	for k, v in tqdm(output.items(), desc='Saving JSONs'):
		if v['nogen']: continue

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
