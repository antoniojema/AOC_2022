import { resolve } from 'path';
import { getMaxStack, getInitialCargo, getMoves } from './cargo';

/***************************************/
/***************************************/
/***************************************/

const filename = "data.dat"
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day05/${filename}`);

async function main() {
    const max_stack = await getMaxStack(filepath);
    console.log(`Max stack number: ${max_stack}`);

    const cargo = await getInitialCargo(filepath, max_stack);
    console.log(`Cargo:\n${cargo.stringify()}`);

    const moves = await getMoves(filepath);
    console.log(`Moves:\n${moves.stringify()}`);

    cargo.applyAllAtOnce(moves);
    console.log(`Final cargo:\n${cargo.stringify()}`)

    console.log(`Top crates:\n${cargo.topCrates()}`)

}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
