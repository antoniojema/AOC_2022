import * as events from 'events';
import * as fs from 'fs';
import * as readline from 'readline';
import { resolve } from 'path';
import { exit } from 'process';
function ascii(char) {
    return char.charCodeAt(0);
}
class Item {
    char;
    constructor(c) {
        this.char = c;
    }
    get priority() {
        let c = ascii(this.char);
        let a = ascii("a");
        let z = ascii("z");
        let A = ascii("A");
        let Z = ascii("Z");
        if (a <= c && c <= z) {
            return c - a + 1;
        }
        else if (A <= c && c <= Z) {
            return c - A + z - a + 2;
        }
        else {
            console.error(`Invalid item: ${this.char}`);
            exit();
        }
    }
    equals(rhs) {
        return this.char === rhs.char;
    }
}
class RuckSack {
    items = [[], []];
    constructor(contents) {
        this.fromString(contents);
    }
    fromString(contents) {
        const len = contents.length / 2;
        this.items = [[], []];
        this.specificFromString(0, contents.substring(0, len));
        this.specificFromString(1, contents.substring(len));
    }
    repeating() {
        var repeating_items = [];
        for (let n0 = 0; n0 < this.items[0].length; n0++) {
            for (let n1 = 0; n1 < this.items[1].length; n1++) {
                let item0 = this.items[0][n0];
                let item1 = this.items[1][n1];
                if (item0.equals(item1)) {
                    let found = false;
                    for (let rep_item of repeating_items) {
                        if (rep_item.equals(item0)) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        repeating_items.push(item1);
                    }
                }
            }
        }
        return repeating_items;
    }
    specificFromString(which, contents) {
        var items = this.items[which];
        items.length = 0;
        [...contents].forEach((c) => {
            items.push(new Item(c));
        });
    }
}
const filename = "data.dat";
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day03/${filename}`);
async function main() {
    console.log(`Opening file: ${filepath}`);
    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });
    var total_priority = 0;
    rl.on('line', (line) => {
        const sack = new RuckSack(line.trim());
        const repeating_items = sack.repeating();
        var priority = 0;
        repeating_items.forEach((item) => {
            priority += item.priority;
        });
        total_priority += priority;
        console.log(`--- NEW SACK: ${line.trim()} ---`);
        console.log(`Repeating items: ${JSON.stringify(Array.from(repeating_items))}`);
        console.log(`Priority: ${priority}`);
        console.log("");
    });
    await events.once(rl, 'close');
    console.log(`Total priority: ${total_priority}`);
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