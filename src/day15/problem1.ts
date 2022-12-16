import { getSensors } from './sensor.js'

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
const filepath = resolve(rootpath + `/src/day15/${filename}`);

// @ts-ignore
const row = (filename === "example.dat") ? 10 : 2000000;

async function main() {
    const sensor_set = await getSensors(filepath);

    console.log(sensor_set.stringify());

    console.log(`Empty tiles: ${sensor_set.getEmptyTilesAtRow(row)}`);

}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
