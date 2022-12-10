import { resolve } from 'path';
import { getForest } from './forest.js';

/***************************************/
/***************************************/
/***************************************/

const filename = "data.dat"
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day08/${filename}`);

async function main() {
    const forest = await getForest(filepath);

    const highest_score = forest.highestScenicScore;

    console.log(`Highest scenic score: ${highest_score}`);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
