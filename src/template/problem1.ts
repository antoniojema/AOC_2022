import { getXXX } from './module.js'

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
const filepath = resolve(rootpath + `/src/dayXX/${filename}`);

async function main() {
    await getXXX(filepath);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
