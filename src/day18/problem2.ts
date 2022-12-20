import { getLavaDroplet } from './lava.js';

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
const filepath = resolve(rootpath + `/src/day18/${filename}`);

async function main() {
    let droplet = await getLavaDroplet(filepath);

    console.log(`Surface: ${droplet.surface}`);
    console.log(`External surface: ${droplet.exteriorSurface}`);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
