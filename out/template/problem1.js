import * as fs from 'fs';
import * as readline from 'readline';
import { resolve } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filename = "example.dat";
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/dayXX/${filename}`);
async function main() {
    console.log(`Opening file: ${filepath}`);
    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });
    for await (let line of rl) {
    }
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