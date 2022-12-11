import * as fs from 'fs';
import * as readline from 'readline';
export class Queue {
    items = [];
    constructor(items) {
        this.reset(items);
    }
    reset(items) {
        if (items === undefined)
            this.items = [];
        else if (Array.isArray(items))
            this.resetFromArray(items);
        else
            this.resetFromQueue(items);
    }
    resetFromQueue(other) {
        if (other !== undefined)
            this.items = other.items.slice();
    }
    resetFromArray(items) {
        if (items !== undefined)
            this.items = items.slice();
    }
    enqueue(item) {
        if (item !== undefined)
            this.items.push(item);
    }
    dequeue() {
        return this.items.shift();
    }
    get length() {
        return this.items.length;
    }
}
export class Operation {
    operator;
    operand_left;
    operand_right;
    constructor(operator, operand_left, operand_right) {
        if (operator === undefined)
            throw "Error: Attempted to set undefined operator";
        if (operand_left === undefined)
            throw "Error: Attempted to set undefined left operand";
        if (operand_right === undefined)
            throw "Error: Attempted to set undefined right operand";
        this.operator = operator;
        this.operand_left = operand_left;
        this.operand_right = operand_right;
    }
    perform(values) {
        let op_left = this.operand_left;
        let op_right = this.operand_right;
        for (const [key, val] of Object.entries(values)) {
            if (key === this.operand_left) {
                op_left = String(val);
            }
            if (key === this.operand_right) {
                op_right = String(val);
            }
        }
        let op = `${op_left} ${this.operator} ${op_right}`;
        return eval(op);
    }
}
export class Monkey {
    operation;
    divisible;
    items = new Queue();
    monkey_true;
    monkey_false;
    n_items_checked;
    constructor(operation, divisible, items) {
        this.reset(operation, divisible, items);
    }
    reset(operation, divisible, items) {
        this.operation = operation;
        this.divisible = divisible;
        this.items.reset(items);
        this.monkey_true = undefined;
        this.monkey_false = undefined;
        this.n_items_checked = 0;
    }
    setMonkeys(monkey_true, monkey_false) {
        this.monkey_true = monkey_true;
        this.monkey_false = monkey_false;
    }
    applyTurns(relief, modulus) {
        while (this.items.length > 0) {
            this.n_items_checked++;
            let item = this.items.dequeue();
            item = this.operation.perform({ "old": item });
            if (relief)
                item = Math.floor(item / 3);
            if (modulus !== undefined)
                item %= modulus;
            if (item % this.divisible == 0)
                this.monkey_true.items.enqueue(item);
            else
                this.monkey_false.items.enqueue(item);
        }
    }
    get itemsChecked() {
        return this.n_items_checked;
    }
    get divisibleNumber() {
        return this.divisible;
    }
}
export class MonkeySet {
    monkeys;
    modulus;
    constructor(monkeys, get_modulus) {
        this.reset(monkeys, get_modulus);
    }
    reset(monkeys, get_modulus) {
        if (monkeys === undefined)
            this.monkeys = [];
        else
            this.monkeys = monkeys;
        if (get_modulus === true) {
            this.modulus = 1;
            for (const monkey of this.monkeys) {
                this.modulus *= monkey.divisibleNumber;
            }
        }
        else {
            this.modulus = undefined;
        }
    }
    get nMonkeys() {
        return this.monkeys.length;
    }
    applyRound(relief) {
        for (const monkey of this.monkeys) {
            monkey.applyTurns(relief, this.modulus);
        }
    }
    get itemsChecked() {
        let items_checked = [];
        for (const monkey of this.monkeys) {
            items_checked.push(monkey.itemsChecked);
        }
        return items_checked;
    }
    monkeyBusiness(top) {
        if (top === undefined)
            top = 2;
        let checked_top = new Array(top);
        for (let n = 0; n < checked_top.length; n++)
            checked_top[n] = 0;
        for (const monkey of this.monkeys) {
            let checked = monkey.itemsChecked;
            for (let n = 0; n < top; n++) {
                if (checked > checked_top[n]) {
                    for (let n_ = top - 1; n_ > n; n_--) {
                        checked_top[n_] = checked_top[n_ - 1];
                    }
                    checked_top[n] = checked;
                    break;
                }
            }
        }
        return checked_top.reduce((sum, val) => sum * val, 1);
    }
}
export async function getMonkeys(filepath, get_modulus) {
    console.log(`Opening file: ${filepath}`);
    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });
    let monkeys = [];
    let monkey_links = [];
    let current_items;
    let current_operation;
    let current_divisible;
    let current_monkey_true;
    let current_monkey_false;
    for await (let line of rl) {
        line = line.trim();
        if (line === "")
            continue;
        const line_split = line.toLowerCase().split(":");
        if (line_split[0].substring(0, line_split[0].length - 1).trim() === "monkey") {
            continue;
        }
        else if (line_split[0] == "starting items") {
            let items_str = line_split[1].split(",");
            current_items = [];
            for (const item_str of items_str) {
                current_items.push(Number(item_str.trim()));
            }
        }
        else if (line_split[0] == "operation") {
            let op_str = line_split[1].trim();
            op_str = op_str.split("=")[1].trim();
            let ops = op_str.split(" ");
            current_operation = new Operation(ops[1].trim(), ops[0].trim(), ops[2].trim());
        }
        else if (line_split[0] == "test") {
            let test_str = line_split[1].trim();
            let divisible_str = test_str.split(" ")[2];
            current_divisible = Number(divisible_str);
        }
        else if (line_split[0] == "if true") {
            let link_str = line_split[1].trim();
            current_monkey_true = Number(link_str.split(" ")[3]);
        }
        else if (line_split[0] == "if false") {
            let link_str = line_split[1].trim();
            current_monkey_false = Number(link_str.split(" ")[3]);
        }
        else {
            throw `Error: Invalid line: ${line}`;
        }
        if (current_items !== undefined &&
            current_operation !== undefined &&
            current_divisible !== undefined &&
            current_monkey_true !== undefined &&
            current_monkey_false !== undefined) {
            monkeys.push(new Monkey(current_operation, current_divisible, current_items));
            monkey_links.push([current_monkey_true, current_monkey_false]);
            current_items = undefined;
            current_operation = undefined;
            current_divisible = undefined;
            current_monkey_true = undefined;
            current_monkey_false = undefined;
        }
    }
    for (let n = 0; n < monkey_links.length; n++) {
        let monkey_true = monkeys[monkey_links[n][0]];
        let monkey_false = monkeys[monkey_links[n][1]];
        monkeys[n].setMonkeys(monkey_true, monkey_false);
    }
    return new MonkeySet(monkeys, get_modulus);
}
//# sourceMappingURL=monkey.js.map