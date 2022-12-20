import {getAirJets, Chamber} from './rock.js'

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
const filepath = resolve(rootpath + `/src/day17/${filename}`);

async function main() {
    const jets = await getAirJets(filepath);

    const chamber = new Chamber(jets);

    // console.log(chamber.stringify());
    console.log(`Height: ${chamber.letRocksFall(1000000000000)}`);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
