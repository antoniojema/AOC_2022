import { resolve } from 'path';
import { getFileSystem } from './filesystem.js';
const filename = "data.dat";
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day07/${filename}`);
async function main() {
    const system = await getFileSystem(filepath, 0);
    console.log(`Filesystem: \n${system.stringify()}`);
    let total_size = 0;
    console.log("Iterate all dirs:");
    for (const dir of system.dirs()) {
        const size = dir.totalSize();
        console.log(`Dir ${dir.name}: size = ${size}`);
        if (size <= 100000) {
            console.log("Is at most 100000");
            total_size += size;
        }
        else {
            console.log("Too large");
        }
        console.log(`Total size: ${total_size}\n`);
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