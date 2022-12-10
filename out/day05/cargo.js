import * as fs from 'fs';
import * as readline from 'readline';
export class Crate {
    label;
    constructor(label) {
        this.label = label;
    }
}
export class CrateStack {
    crates = [];
    moveOneByOneTo(dest, count) {
        dest.crates.push(...this.crates.splice(this.crates.length - count, count).reverse());
    }
    moveOneByOneFrom(orig, count) {
        orig.moveOneByOneTo(this, count);
    }
    moveAllAtOnceTo(dest, count) {
        dest.crates.push(...this.crates.splice(this.crates.length - count, count));
    }
    moveAllAtOnceFrom(orig, count) {
        orig.moveAllAtOnceTo(this, count);
    }
}
export class Cargo {
    stacks = [];
    constructor(crates) {
        if (crates.length == 0)
            return;
        this.stacks.length = crates[0].length;
        for (let n_stack = 0; n_stack < this.stacks.length; n_stack++) {
            this.stacks[n_stack] = new CrateStack;
            for (let n_crate = crates.length - 1; n_crate >= 0; n_crate--) {
                let crate = crates[n_crate][n_stack];
                if (crate.label != " ") {
                    this.stacks[n_stack].crates.push(crate);
                }
                else {
                    break;
                }
            }
        }
    }
    stringify() {
        let str = "";
        for (let n_stack = 0; n_stack < this.stacks.length; n_stack++) {
            str += `Stack ${n_stack}: `;
            let stack = this.stacks[n_stack];
            for (let crate of stack.crates) {
                str += `[${crate.label}] `;
            }
            if (n_stack < this.stacks.length - 1)
                str += "\n";
        }
        return str;
    }
    moveOneByOne(orig, dest, count) {
        this.stacks[orig].moveOneByOneTo(this.stacks[dest], count);
    }
    moveAllAtOnce(orig, dest, count) {
        this.stacks[orig].moveAllAtOnceTo(this.stacks[dest], count);
    }
    applyOneByOne(moves) {
        for (const step of moves.steps) {
            this.moveOneByOne(step.orig, step.dest, step.count);
        }
    }
    applyAllAtOnce(moves) {
        for (const step of moves.steps) {
            this.moveAllAtOnce(step.orig, step.dest, step.count);
        }
    }
    topCrates() {
        let str = "";
        for (const stack of this.stacks) {
            str += stack.crates[stack.crates.length - 1].label;
        }
        return str;
    }
}
export class MoveStep {
    orig;
    dest;
    count;
    constructor(orig, dest, count) {
        this.orig = orig;
        this.dest = dest;
        this.count = count;
    }
    stringify() {
        return `Move ${this.count} from ${this.orig} to ${this.dest}`;
    }
}
export class MoveStack {
    steps = [];
    push(str) {
        const pos_move = str.indexOf("move");
        const pos_from = str.indexOf("from");
        const pos_to = str.indexOf("to");
        const pos_count = pos_move + 4;
        const pos_orig = pos_from + 4;
        const pos_dest = pos_to + 2;
        const count = Number(str.substring(pos_count, pos_from));
        const orig = Number(str.substring(pos_orig, pos_to)) - 1;
        const dest = Number(str.substring(pos_dest)) - 1;
        this.steps.push(new MoveStep(orig, dest, count));
    }
    stringify() {
        let str = "";
        for (let n_step = 0; n_step < this.steps.length; n_step++) {
            const step = this.steps[n_step];
            str += `Step ${n_step}: ${step.stringify()}`;
            if (n_step < this.steps.length - 1)
                str += "\n";
        }
        return str;
    }
}
export async function getMaxStack(filepath) {
    console.log(`Precounting in file: ${filepath}`);
    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });
    for await (let line of rl) {
        if (line.trim().charAt(0) != "[") {
            console.log(line);
            let n = 0;
            while (true) {
                const pos = line.indexOf(String(n + 1));
                if (pos == -1) {
                    return n;
                }
                else {
                    n++;
                }
            }
        }
    }
    return undefined;
}
export async function getInitialCargo(filepath, max_stack) {
    console.log(`Getting intial cargo in file: ${filepath}`);
    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });
    let crates = [];
    for await (let line of rl) {
        if (line.trim().charAt(0) != "[")
            break;
        let level_crates = [];
        for (let n_crate = 0; n_crate < max_stack; n_crate++) {
            const pos = n_crate * 4 + 1;
            level_crates.push(new Crate(line.charAt(pos)));
        }
        crates.push(level_crates);
    }
    return new Cargo(crates);
}
export async function getMoves(filepath) {
    console.log(`Getting moves: ${filepath}`);
    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });
    let moves = new MoveStack;
    let reading_moves = false;
    for await (let line of rl) {
        if (!reading_moves) {
            if (line.trim().charAt(0) != "[") {
                reading_moves = true;
            }
        }
        else {
            if (line.trim() !== "") {
                moves.push(line.trim());
            }
        }
    }
    return moves;
}
//# sourceMappingURL=cargo.js.map