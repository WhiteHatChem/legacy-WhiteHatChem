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
	'AF-A5X5Y0-F1-model_v1_box_0',
	'AF-A5X5Y0-F1-model_v1_box_2',
	'AF-A5X5Y0-F1-model_v1_box_3',
	'AF-A5X5Y0-F1-model_v1_box_4',
	'AF-O95264-F1-model_v1_box_2',
	'AF-O95264-F1-model_v1_box_3',
	'AF-P08588-F1-model_v1_box_1',
	'AF-P08588-F1-model_v1_box_2',
	'AF-P08588-F1-model_v1_box_5',
	'AF-P08908-F1-model_v1_box_0',
	'AF-P08908-F1-model_v1_box_10',
	'AF-P08908-F1-model_v1_box_2',
	'AF-P08908-F1-model_v1_box_3',
	'AF-P08908-F1-model_v1_box_4',
	'AF-P08908-F1-model_v1_box_7',
	'AF-P13945-F1-model_v1_box_1',
	'AF-P13945-F1-model_v1_box_3',
	'AF-P13945-F1-model_v1_box_6',
	'AF-P13945-F1-model_v1_box_8',
	'AF-P18089-F1-model_v1_box_1',
	'AF-P18089-F1-model_v1_box_2',
	'AF-P18089-F1-model_v1_box_3',
	'AF-P18089-F1-model_v1_box_5',
	'AF-P21728-F1-model_v1_box_10',
	'AF-P21728-F1-model_v1_box_4',
	'AF-P21728-F1-model_v1_box_8',
	'AF-P21728-F1-model_v1_box_9',
	'AF-P21918-F1-model_v1_box_4',
	'AF-P21918-F1-model_v1_box_6',
	'AF-P21918-F1-model_v1_box_8',
	'AF-P25100-F1-model_v1_box_11',
	'AF-P25100-F1-model_v1_box_12',
	'AF-P25100-F1-model_v1_box_3',
	'AF-P25100-F1-model_v1_box_5',
	'AF-P25100-F1-model_v1_box_6',
	'AF-P25100-F1-model_v1_box_8',
	'AF-P28221-F1-model_v1_box_0',
	'AF-P28221-F1-model_v1_box_1',
	'AF-P28221-F1-model_v1_box_2',
	'AF-P28221-F1-model_v1_box_3',
	'AF-P28221-F1-model_v1_box_5',
	'AF-P28221-F1-model_v1_box_6',
	'AF-P28566-F1-model_v1_box_0',
	'AF-P28566-F1-model_v1_box_1',
	'AF-P28566-F1-model_v1_box_10',
	'AF-P28566-F1-model_v1_box_2',
	'AF-P28566-F1-model_v1_box_3',
	'AF-P28566-F1-model_v1_box_4',
	'AF-P28566-F1-model_v1_box_5',
	'AF-P28566-F1-model_v1_box_7',
	'AF-P30939-F1-model_v1_box_0',
	'AF-P30939-F1-model_v1_box_1',
	'AF-P30939-F1-model_v1_box_2',
	'AF-P30939-F1-model_v1_box_5',
	'AF-P34969-F1-model_v1_box_0',
	'AF-P34969-F1-model_v1_box_10',
	'AF-P34969-F1-model_v1_box_3',
	'AF-P34969-F1-model_v1_box_5',
	'AF-P34969-F1-model_v1_box_6',
	'AF-P34969-F1-model_v1_box_8',
	'AF-P35368-F1-model_v1_box_11',
	'AF-P35368-F1-model_v1_box_12',
	'AF-P35368-F1-model_v1_box_3',
	'AF-P35368-F1-model_v1_box_6',
	'AF-P35368-F1-model_v1_box_7',
	'AF-P35368-F1-model_v1_box_8',
	'AF-P35372-F1-model_v1_box_0',
	'AF-P35372-F1-model_v1_box_10',
	'AF-P35372-F1-model_v1_box_3',
	'AF-P46098-F1-model_v1_box_0',
	'AF-P46098-F1-model_v1_box_11',
	'AF-P46098-F1-model_v1_box_4',
	'AF-P46098-F1-model_v1_box_5',
	'AF-P46098-F1-model_v1_box_7',
	'AF-P47898-F1-model_v1_box_2',
	'AF-P47898-F1-model_v1_box_3',
	'AF-P47898-F1-model_v1_box_4',
	'AF-P47898-F1-model_v1_box_5',
	'AF-P47898-F1-model_v1_box_8',
	'AF-P50406-F1-model_v1_box_11',
	'AF-P50406-F1-model_v1_box_12',
	'AF-P50406-F1-model_v1_box_2',
	'AF-P50406-F1-model_v1_box_5',
	'AF-P50406-F1-model_v1_box_7',
	'AF-P50406-F1-model_v1_box_8',
	'AF-P50406-F1-model_v1_box_9',
	'AF-Q5BJF2-F1-model_v1_box_0',
	'AF-Q8WXA8-F1-model_v1_box_1',
	'AF-Q8WXA8-F1-model_v1_box_10',
	'AF-Q8WXA8-F1-model_v1_box_3',
	'AF-Q8WXA8-F1-model_v1_box_4',
	'AF-Q9NZT2-F1-model_v1_box_0',
	'AF-Q9NZT2-F1-model_v1_box_8',
	'AF-Q9Y2T6-F1-model_v1_box_1',
	'AF-Q9Y2T6-F1-model_v1_box_2',
	'AF-Q9Y2T6-F1-model_v1_box_3',
	'AF-Q9Y2T6-F1-model_v1_box_5',
	'AF-Q9Y2T6-F1-model_v1_box_6',
	'AF-Q9Y2T6-F1-model_v1_box_7',
	'P07550_2R4R_A_box_0',
	'P07550_2R4R_A_box_3',
	'P07550_2R4R_A_box_5',
	'P07550_2R4R_A_box_8',
	'P07550_2R4R_A_box_9',
	'P08913_6KUX_A_box_0',
	'P08913_6KUX_A_box_1',
	'P08913_6KUX_A_box_2',
	'P08913_6KUX_A_box_4',
	'P14416_6CM4_A_box_0',
	'P14416_6CM4_A_box_1',
	'P14416_6CM4_A_box_4',
	'P14416_6CM4_A_box_6',
	'P14416_6CM4_A_box_7',
	'P18825_6KUW_A_box_0',
	'P18825_6KUW_A_box_1',
	'P18825_6KUW_A_box_3',
	'P18825_6KUW_A_box_4',
	'P18825_6KUW_A_box_5',
	'P18825_6KUW_A_box_6',
	'P18825_6KUW_A_box_7',
	'P21554_5U09_A_box_0',
	'P21554_5U09_A_box_1',
	'P21554_5U09_A_box_10',
	'P21554_5U09_A_box_12',
	'P21554_5U09_A_box_2',
	'P21554_5U09_A_box_3',
	'P21554_5U09_A_box_5',
	'P21554_5U09_A_box_6',
	'P21554_5U09_A_box_7',
	'P21554_5U09_A_box_8',
	'P21917_5WIU_A_box_0',
	'P21917_5WIU_A_box_1',
	'P21917_5WIU_A_box_2',
	'P21917_5WIU_A_box_3',
	'P21917_5WIU_A_box_4',
	'P28222_4IAR_A_box_0',
	'P28222_4IAR_A_box_1',
	'P28222_4IAR_A_box_11',
	'P28222_4IAR_A_box_2',
	'P28222_4IAR_A_box_3',
	'P28222_4IAR_A_box_4',
	'P28222_4IAR_A_box_7',
	'P28222_4IAR_A_box_8',
	'P28222_4IAR_A_box_9',
	'P28223_6WGT_C_box_0',
	'P28223_6WGT_C_box_2',
	'P28223_6WGT_C_box_3',
	'P28223_6WGT_C_box_4',
	'P28223_6WGT_C_box_5',
	'P28335_6BQH_A_box_0',
	'P28335_6BQH_A_box_1',
	'P28335_6BQH_A_box_2',
	'P28335_6BQH_A_box_3',
	'P28335_6BQH_A_box_4',
	'P28335_6BQH_A_box_5',
	'P34972_5ZTY_A_box_0',
	'P34972_5ZTY_A_box_1',
	'P34972_5ZTY_A_box_10',
	'P34972_5ZTY_A_box_2',
	'P34972_5ZTY_A_box_3',
	'P34972_5ZTY_A_box_4',
	'P34972_5ZTY_A_box_7',
	'P35462_3PBL_A_box_0',
	'P35462_3PBL_A_box_1',
	'P35462_3PBL_A_box_2',
	'P35462_3PBL_A_box_3',
	'P35462_3PBL_A_box_7',
	'P35462_3PBL_A_box_8',
	'P41143_4N6H_A_box_0',
	'P41143_4N6H_A_box_1',
	'P41143_4N6H_A_box_2',
	'P41143_4N6H_A_box_3',
	'P41143_4N6H_A_box_4',
	'P41145_4DJH_A_box_0',
	'P41145_4DJH_A_box_1',
	'P41145_4DJH_A_box_2',
	'P41145_4DJH_A_box_3',
	'P41145_4DJH_A_box_4',
	'P41145_4DJH_A_box_5',
	'P41146_5DHG_B_box_0',
	'P41146_5DHG_B_box_2',
	'P41595_4IB4_A_box_0',
	'P41595_4IB4_A_box_3',
	'Q99720_5HK1_C_box_0',
	'Q99720_5HK1_C_box_1',
	'Q99720_5HK1_C_box_2'
]

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
		"metabolism",
		"metabolite"
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
			other_molecule = output[str(idx)]
			useful_col = ['name', 'psychonaut_names', 'tripsit_names', 'isomerd_names', 'isod_ids', 'hsdb_names', 'cid', 'search', 'toxic', 'metabolite' ]
			v['struct_sim'].append({
				**{k: other_molecule[k] for k in useful_col},
				'dist': dist
			})

	for k, v in tqdm(output.items(), desc='Generating binding affinities'):
		if v['nogen']: continue
		if v['affinity_distances'] is None or v['affinity_indices'] is None: continue

		v['binding_sim'] = []
		for dist, idx in zip(v['affinity_distances'], v['affinity_indices']):
			other_molecule = output[str(idx)]
			useful_col = ['name', 'psychonaut_names', 'tripsit_names', 'isomerd_names', 'isod_ids', 'hsdb_names', 'cid', 'search', 'toxic', 'metabolite']
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
			other_molecule = output[str(idx)]
			useful_col = ['name', 'psychonaut_names', 'tripsit_names', 'isomerd_names', 'isod_ids', 'hsdb_names', 'cid', 'search', 'toxic', 'metabolite']
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
		useful_col = ['name', 'psychonaut_names', 'tripsit_names', 'isomerd_names', 'isod_ids', 'hsdb_names', 'cid', 'search', 'toxic', 'metabolite' ]
		return {
			'name': reaction[0],
			'enzymes': reaction[2].split('\n'),
			'product': {k: output[inchi2idx[reaction[3]]][k] for k in useful_col}
		}

	for i, inchi in tqdm(metabolism_data['inchi'], desc='Metabolism data'):
		key = str(i)
		if not metabolism_data['is_drug'][key]: continue

		anterior = []
		for reaction in metabolism_data['anteriors'][key]:
			anterior.append(parse_reaction(reaction))
		posterior = []
		for reaction in metabolism_data['posteriors'][key]:
			posterior.append(parse_reaction(reaction))
		metabolism = {
			'anterior': anterior if len(anterior) > 0 else None,
			'posterior': posterior if len(posterior) > 0 else None,
		}
		output[inchi2idx[inchi]]['metabolism'] = metabolism

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
