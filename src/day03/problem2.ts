import * as events from 'events';
import * as fs from 'fs';
import * as readline from 'readline';
import { resolve } from 'path';
import { exit } from 'process';
import { match } from 'assert';

function ascii(char : string) : number {
    return char.charCodeAt(0);
}

class Item {
    char : string;

    constructor(c : string) {
        this.char = c;
    }

    get priority() : number {
        let c = ascii(this.char);
        let a = ascii("a");
        let z = ascii("z");
        let A = ascii("A");
        let Z = ascii("Z");
        if (a <= c && c <= z) {
            return c - a + 1
        }
        else if (A <= c && c <= Z) {
            return c - A + z - a + 2
        }
        else {
            console.error(`Invalid item: ${this.char}`)
            exit()
        }
    }

    equals(rhs : Item) : boolean {
        return this.char === rhs.char;
    }
}

class RuckSack {
    items : Item[][] = [[], []];

    constructor(contents : string) {
        this.fromString(contents);
    }

    fromString(contents : string) {
        const len = contents.length / 2;
        this.items = [[],[]];
        this.specificFromString(0, contents.substring(0,len));
        this.specificFromString(1, contents.substring(len));
    }

    repeating() : Item[] {
        var repeating_items : Item[] = [];

        for (let n0 = 0; n0 < this.items[0].length; n0++) {
        for (let n1 = 0; n1 < this.items[1].length; n1++) {
            let item0 =this.items[0][n0];
            let item1 =this.items[1][n1];
            if (item0.equals(item1)) {
                let found = false;
                for (let rep_item of repeating_items) {
                    if (rep_item.equals(item0)) {
                        found = true;
                        break;
                    }
                }
                if (!found){
                    repeating_items.push(item1);
                }
            }
        }}

        return repeating_items;
    }

    private specificFromString(which: number, contents : string) {
        var items = this.items[which];
        items.length = 0;
        [...contents].forEach((c : string) => {
            items.push(new Item(c));
        });
    }

    get allItems() : Item[] {
        return this.items[0].concat(this.items[1]);
    }

    hasItem(item : Item) : boolean {
        for (let my_item of this.allItems) {
            if (item.equals(my_item)) return true;
        }
        return false;
    }
}

function matchItem(sacks : RuckSack[]) : Item {
    for (let item of sacks[0].allItems) {
        for (let n = 1; n < sacks.length; n++) {
            if (!sacks[n].hasItem(item)) {
                break;
            }
            else if (n == sacks.length-1) {
                return item;
            }
        }
    }
    return undefined;
}

const filename = "data.dat"
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day03/${filename}`);

async function main() {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    var total_priority : number = 0;
    var sacks : RuckSack[] = [];

    rl.on('line', (line : string) : void => {
        if (sacks.length === 0) {
            console.log(`--- NEW SACK SET ---`);
        }
        sacks.push(new RuckSack(line.trim()));

        console.log(`Sack ${sacks.length}: ${line.trim()}`)

        if (sacks.length === 3) {
            const match_item = matchItem(sacks);
            const priority = match_item.priority;

            total_priority += priority;

            console.log(`Matching item: ${match_item.char}`);
            console.log(`Priority: ${priority}`);
            console.log(`Total priority: ${total_priority}`);

            sacks = [];
        }
    });
    await events.once(rl, 'close');

}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
