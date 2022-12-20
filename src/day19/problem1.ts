import { getBlueprints } from './robots.js'

/***************************************/
/***************************************/
/***************************************/

import { resolve } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filename = "example.dat"
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day19/${filename}`);

async function main() {
    let blueprints = await getBlueprints(filepath);

    console.log(blueprints.stringify());
    console.log("");
    
    console.log(`Total quality level: ${blueprints.qualityLevel(24)}`);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
