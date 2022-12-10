import { resolve } from 'path';
import { getFileSystem } from './filesystem.js';


/***************************************/
/***************************************/
/***************************************/

const filename = "data.dat"
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day07/${filename}`);

const space_total  = 70000000;
const space_needed = 30000000;

async function main() {
    const system = await getFileSystem(filepath, space_total);
    console.log(`Filesystem:\n${system.stringify()}`);

    const space_remove = space_needed - system.leftSpace;

    console.log(`Space used     : ${system.usedSpace}`);
    console.log(`Space left     : ${system.leftSpace}`);
    console.log(`Space needed   : ${space_needed}`);
    console.log(`Space to remove: ${space_remove}`);

    let candidate = system.root;

    for (const dir of system.root.dirsRecursive()) {
        const size = dir.totalSize();
        if (size >= space_remove && size < candidate.totalSize()) {
            candidate = dir;
        }
    }
    
    console.log(`Directory to remove: ${candidate.name} (size = ${candidate.totalSize()})`);

}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
