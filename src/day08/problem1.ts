import { resolve } from 'path';
import { getForest } from './forest';

/***************************************/
/***************************************/
/***************************************/

const filename = "data.dat"
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day08/${filename}`);

async function main() {
    const forest = await getForest(filepath);

    const n_visible = forest.nVisible;

    console.log(`Number of visible trees: ${n_visible}`);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
