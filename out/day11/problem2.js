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
    const monkeys = await getMonkeys(filepath, true);
    for (let n = 0; n < 10000; n++) {
        monkeys.applyRound(false);
    }
    const items_checked = monkeys.itemsChecked;
    for (let n = 0; n < monkeys.nMonkeys; n++) {
        console.log(`Items checked by monkey ${n}: ${items_checked[n]}`);
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
//# sourceMappingURL=problem2.js.map