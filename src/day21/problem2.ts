import { getMonkes } from './monke.js'

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
const filepath = resolve(rootpath + `/src/day21/${filename}`);

async function main() {
    let monkes = await getMonkes(filepath);

    console.log(monkes.stringify());

    let nodes = monkes.getNodeSet();

    console.log(nodes.stringify());

    nodes.simplify();

    console.log(nodes.stringify());

    console.log(`Human value: ${nodes.solve()}`);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
