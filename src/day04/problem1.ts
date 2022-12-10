import * as events from 'events';
import * as fs from 'fs';
import * as readline from 'readline';
import { resolve } from 'path';
import { SectorRangePair } from './ranges.js'

/***************************************/
/***************************************/
/***************************************/

const filename = "data.dat"
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day04/${filename}`);

async function main() {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    var n_redundant = 0;

    rl.on('line', (line : string) : void => {
        console.log(`--- NEW LINE: ${line}`)
        
        const range_pair = new SectorRangePair(line);

        if (range_pair.isRedundant()) {
            console.log("Are redundant.");
            n_redundant++;
        }
        else {
            console.log("Not redundant.");
        }

        console.log(`Number of redundant pairs: ${n_redundant}`);

    });
    await events.once(rl, 'close');

}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
