import * as events from 'events';
import * as fs from 'fs';
import * as readline from 'readline';
import { resolve } from 'path';
import { exit } from 'process';

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

    rl.on('line', (line : string) : void => {
        const sack = new RuckSack(line.trim());

        const repeating_items = sack.repeating()
        var priority : number = 0;
        repeating_items.forEach((item : Item) =>{
            priority += item.priority;
        });

        total_priority += priority

        console.log(`--- NEW SACK: ${line.trim()} ---`);
        console.log(`Repeating items: ${JSON.stringify(Array.from(repeating_items))}`);
        console.log(`Priority: ${priority}`)
        console.log("")
    });
    await events.once(rl, 'close');

    console.log(`Total priority: ${total_priority}`);
}

(async function() {
    try {
        await main();
    }
    catch (err) {
        console.error(err);
    }
})();
