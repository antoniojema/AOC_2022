import { getMap } from './rock.js'
import * as fs from 'fs';

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
const filepath = resolve(rootpath + `/src/day14/${filename}`);

async function main() {
    const map = await getMap(filepath, 2);

    console.log(`Number of sand particles: ${map.dropAll()}`);

    const map_str = map.stringify();

    fs.writeFile(resolve(rootpath + `/map_day14.txt`), map_str, (err) => {if (err) console.error(err)});
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
