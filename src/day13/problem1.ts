import { getMessage, getComparisonIndex } from './signal.js'

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
const filepath = resolve(rootpath + `/src/day13/${filename}`);

async function main() {
    const message = await getMessage(filepath)

    console.log(`Comparison index: ${getComparisonIndex(message)}`);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
