import { getSensors, Index } from './sensor.js'

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
const max = (filename === "example.dat") ? 20 : 4000000;

async function main() {
    const sensor_set = await getSensors(filepath);

    // @ts-ignore
    if (filename === "example.dat") {
        console.log(sensor_set.getMap(new Index(0,0), new Index(max,max)));
    }

    // const indices = sensor_set.getUnknownInRange(new Index(0,0), new Index(max, max));
    // const index = sensor_set.getUnknownInRange_SparseArray(new Index(0,0), new Index(max, max));
    const index = sensor_set.getUnknownInRange_SparseMap(new Index(0,0), new Index(max, max));

    console.log(`Unknown tile in range: ${index.stringify()} - Tuning frequency: ${index.tuningFrequency}`);

}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
