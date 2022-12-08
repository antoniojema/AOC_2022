import * as fs from 'fs';
import * as readline from 'readline';
import { resolve } from 'path';

/***************************************/
/***************************************/
/***************************************/

const filename = "example.dat"
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/dayXX/${filename}`);

async function main() {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    // TODO

    for await(let line of rl) {
        // TODO
    }

}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
