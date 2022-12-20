import * as fs from 'fs';
import * as readline from 'readline';



export async function getXXX(filepath : string) {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    // TODO

    for await(let line of rl) {
        line = line.trim();
        if (line === "") continue;
        
        // TODO
    }
}