# transform the normalized file into a list of file for each molecule
import json
import os

from tqdm import tqdm
from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit.Chem.Draw import rdMolDraw2D
from rdkit.Chem.Draw.MolDrawing import DrawingOptions

def generate_json_from_normalized(
    input_path='normalized.json',
    output_path='json/',
    img_path='../public/svg'
):
    with open(input_path, 'r') as fi:
        data = json.load(fi)

    output = {k: {} for k, v in data['inchi'].items()}
    
    # add normalized data
    for k1, v1 in data.items():
        for k2, v2 in v1.items():
            output[k2][k1] = v2

    # create names
    for k, v in output.items():
        v['name'] = k

    # generate and add images
    for k, v in tqdm(output.items(), desc='Generating svgs'):
        if v['inchi'] is not None:
            f_name = f"{v['name']}.svg"
            svg_path = os.path.join(img_path, f_name)
            inchi_to_svg(v['inchi'], svg_path)
        else:
            f_name = None
        v['svg'] = f_name

    # add similar molecules
    for k, v in tqdm(output.items(), desc='Processing similarity'):
        v['sim'] = []
        for dist, idx in zip(v['distances'], v['indices']):
            idx = str(idx)
            v['sim'].append({
                'name': output[idx]['name'],
                'psychonaut_names': output[idx]['psychonaut_names'],
                'tripsit_names': output[idx]['tripsit_names'],
                'isomerd_names': output[idx]['isomerd_names'],
                'dist': dist
            })

    # save jsons
    for k, v in tqdm(output.items(), desc='Saving jsons'):
        f_name = f"{v['name']}.json"
        f_path = os.path.join(output_path, f_name)
        with open(f_path, 'w+') as fo:
            json.dump(v, fo, indent=2)


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
    generate_json_from_normalized("drugs.json")
