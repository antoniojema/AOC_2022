import { resolve } from 'path';
import { exit } from 'process';
import { getStream } from './datastream.js';
const filename = "data.dat";
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day06/${filename}`);
async function main() {
    var stream = await getStream(filepath);
    if (stream === undefined) {
        console.error("Error getting stream.");
        exit();
    }
    console.log(`Stream: ${stream.stream}`);
    console.log(`Start position: ${stream.packetStartPos}`);
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