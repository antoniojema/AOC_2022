import { getMonkeys } from './monkey.js';
import { resolve } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filename = "data.dat";
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day11/${filename}`);
async function main() {
    const monkeys = await getMonkeys(filepath);
    for (let n = 0; n < 20; n++) {
        monkeys.applyRound(true);
    }
    console.log(`Monkey business: ${monkeys.monkeyBusiness()}`);
}
(async function () {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
//# sourceMappingURL=problem1.js.map