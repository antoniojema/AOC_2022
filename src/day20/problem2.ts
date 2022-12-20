import { getList } from './list.js'

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
const filepath = resolve(rootpath + `/src/day20/${filename}`);

async function main() {
    let list = await getList(filepath);

    console.log(`List length: ${list.length}`);

    console.log(`Coordinates sum: ${list.getGroveCoordinatesSum(10, 811589153)}`);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
