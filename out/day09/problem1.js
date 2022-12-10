import { Simulation } from './rope.js';
import { resolve } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filename = "data.dat";
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day09/${filename}`);
async function main() {
    const sim = new Simulation();
    await sim.reset(filepath);
    sim.run(2);
    console.log(`Number of visited cells: ${sim.nVisited}`);
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