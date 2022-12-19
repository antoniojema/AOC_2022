import {getNetwork, getExamplePath, getSimplifiedExamplePath, SimplifiedNetwork, findBestSimplifiedPath} from './valves.js'

/***************************************/
/***************************************/
/***************************************/

import { resolve } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filename = "data.dat"
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day16/${filename}`);

async function main() {
    const network = await getNetwork(filepath);
    const simplified_network = new SimplifiedNetwork(network);

    console.log(simplified_network.stringify());

    // console.log(getSimplifiedExamplePath(simplified_network).evaluate());

    let path = findBestSimplifiedPath(simplified_network, 30);

    console.log(`Best result: ${path.evaluate()}`);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
