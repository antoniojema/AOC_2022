import * as valves from './valves_alt.js'

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
    const network = await valves.getNetwork(filepath);

    console.log(network.stringify());

    // console.log(valves.findBestPath(network));
    console.log(valves.findBestPathWithTwoAgents(network));
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
