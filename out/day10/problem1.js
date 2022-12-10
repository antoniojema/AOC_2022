import { CommandList, CPU } from './cpu.js';
import { resolve } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filename = "data.dat";
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day10/${filename}`);
async function main() {
    const commands = new CommandList;
    await commands.reset(filepath);
    const cpu = new CPU;
    cpu.apply(commands);
    console.log(`Final signal strength: ${cpu.signal_strength}`);
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