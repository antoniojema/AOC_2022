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

    chamber.letRocksFall();

    // console.log(chamber.stringify());
    console.log(`Height: ${chamber.rocksHeight}`);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
