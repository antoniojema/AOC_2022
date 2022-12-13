import { getMap } from './elevation.js';
import { resolve } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filename = "data.dat";
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day12/${filename}`);
async function main() {
    const [map, start_pos, final_pos] = await getMap(filepath);
    const dist = map.findShortestDistance(start_pos, (from, to, elev) => elev[to.row][to.col] <= elev[from.row][from.col] + 1, (pos) => pos.equals(final_pos));
    console.log(`Shortest distance 1: ${dist}`);
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