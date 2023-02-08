# transform the normalized file into a list of file for each molecule
import json
import os

from tqdm import tqdm
from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit.Chem.Draw.MolDrawing import DrawingOptions

BASE_PATH = 'drugs.json'
BINDING_AFFINITY_PATH = 'binding_affinities.json'

def inchi_to_index(base_data):
	index = {v: k for k, v in base_data['inchi'].items()}
	def f(inchi):
		return index[inchi]
	return f

def convert_binding_data(data, inchi2idx):
	local_index_to_inchi = {i: k for i,k in enumerate(data['affinities'])}
	output = {}
	for i, inchi in enumerate(data['affinities']):
		output[inchi2idx(inchi)] = {
			'indices': map(lambda x : inchi2idx(local_index_to_inchi[x]), data['indices'][inchi]),
			'distances': data['distances'][inchi],
			'affinities': data['affinities'][inchi],
		}
	return output

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
		"struct_sim",
		"binding_sim",
		"binding_affinities",
	]
	return {k: data.get(k, None) for k in useful_rows}

def generate_json_from_normalized(
	output_path='json/',
	img_path='../public/svg'
):
	with open(BASE_PATH, 'r') as fi:
		base_data = json.load(fi)
	with open(BINDING_AFFINITY_PATH, 'r') as fi:
		binding_affinity_data = json.load(fi)

	output = {k: {} for k, v in base_data['inchi'].items()}
	inchi2idx = inchi_to_index(base_data)
	serialized_binding_data = convert_binding_data(binding_affinity_data, inchi2idx)

	# add normalized data
	for k1, v1 in base_data.items():
		
		for k2, v2 in v1.items():
			output[k2][k1] = v2

	# create names
	for k, v in output.items():
		v['name'] = k

	for k, v in tqdm(output.items(), desc='Generating images'):
		toxic = v['search'] == 0
		if toxic:
			continue
		if v['inchi'] is not None:
			f_name = f"{v['name']}.svg"
			svg_path = os.path.join(img_path, f_name)
			inchi_to_svg(v['inchi'], svg_path)
		else:
			f_name = None
		v['svg'] = f_name


	for k, v in tqdm(output.items(), desc='Generating structural similarity'):
		toxic = v['search'] == 0
		if toxic:
			continue
		v['struct_sim'] = []
		for dist, idx in zip(v['distances'], v['indices']):
			idx = str(idx)
			v['struct_sim'].append({
				'name': output[idx]['name'],
				'psychonaut_names': output[idx]['psychonaut_names'],
				'tripsit_names': output[idx]['tripsit_names'],
				'isomerd_names': output[idx]['isomerd_names'],
				'isod_ids': output[idx]['isod_ids'],
				'hsdb_names': output[idx]['hsdb_names'],
				'cid': output[idx]['cid'],
				'toxic': output[idx]['search'] == 0,
				'dist': dist
			})

	for k, v in tqdm(output.items(), desc='Generating binding affinities'):
		toxic = v['search'] == 0
		if toxic:
			continue
		if k not in serialized_binding_data:
			continue
		indices = serialized_binding_data[k]['indices']
		distances = serialized_binding_data[k]['distances']
		v['binding_sim'] = []
		for dist, idx in zip(distances, indices):
			idx = str(idx)
			v['binding_sim'].append({
				'name': output[idx]['name'],
				'psychonaut_names': output[idx]['psychonaut_names'],
				'tripsit_names': output[idx]['tripsit_names'],
				'isomerd_names': output[idx]['isomerd_names'],
				'isod_ids': output[idx]['isod_ids'],
				'hsdb_names': output[idx]['hsdb_names'],
				'cid': output[idx]['cid'],
				'toxic': output[idx]['search'] == 0,
				'dist': dist,
			})

	for k, v in tqdm(output.items(), desc='Generating affinities'):
		toxic = v['search'] == 0
		if toxic:
			continue
		if k not in serialized_binding_data:
			continue
		v['binding_affinities'] = serialized_binding_data[k]['affinities']

	count = 0
	for k, v in tqdm(output.items(), desc='Saving JSONs'):
		toxic = v['search'] == 0
		if toxic:
			continue
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

if __name__ == "__main__":
	generate_json_from_normalized()
