import { notDeepEqual } from 'assert';
import * as fs from 'fs';
import { stringify } from 'querystring';
import * as readline from 'readline';

type MonkeOperands = {
    L: Monke;
    R: Monke;
}

type MonkeOperation = number | {
    operands : MonkeOperands;
    operator : string;
};

function stringifyOperation(operation : MonkeOperation) : string {
    if (typeof operation === "number") {
        return String(operation);
    }
    else {
        return `${operation.operands.L.name} ${operation.operator} ${operation.operands.R.name}`;
    }
}

class Monke {
    private _name : string;
    private _operation : MonkeOperation;
    private _result : number;

    constructor(name : string){
        this.reset(name)
    }

    get name() {return this._name;}

    get operation() {return this._operation;}

    reset(name : string) {
        this._name = name;
        this._operation = undefined;
        this._result = undefined;
    }

    setOperation(operation : MonkeOperation) {
        this._operation = operation;
        if (typeof this._operation === "number") {
            this._result = this._operation;
        }
    }

    get hasResult() : boolean { return this._result !== undefined; }

    get result() : number {
        if (!this.hasResult) {
            if (typeof this._operation === "number") throw "Error: Found unevaluated number operation.";

            let left_op  = String(this._operation.operands.L.result);
            let right_op = String(this._operation.operands.R.result);

            this._result = Number(eval(`${left_op} ${this._operation.operator} ${right_op}`));
        }
        return this._result;
    }

    stringify() : string {
        return `${this.name}: ${stringifyOperation(this._operation)}`;
    }
}

type BinaryOperation = "humn" | number | {
    L : Node,
    R : Node,
    op : string
}

class Node {
    private _name : string;
    private _operation : BinaryOperation;

    constructor(name : string, operation : BinaryOperation) {
        this.reset(name, operation);
    }

    reset(name : string, operation : BinaryOperation) {
        this._name = name;
        this._operation = operation;
    }

    get name() {return this._name;}
    get operation() {return this._operation;}

    simplify() : BinaryOperation {
        if (typeof this._operation !== "number" && this._operation !== "humn") {
            let L = this._operation.L.simplify();
            let R = this._operation.R.simplify();

            if (typeof L === "number" && typeof R === "number") {
                this._operation = Number(eval(`${String(L)} ${this._operation.op} ${String(R)}`));
            }
        }
        return this._operation;
    }

    stringify(level : number = 0) : string {
        let s = " ".repeat(level*2);

        if (this._operation === "humn") {
            return s + this._operation;
        }
        else if (typeof this._operation === "number") {
            return s + String(this._operation);
        }
        else {
            let L = this._operation.L;
            let R = this._operation.R;
            
            return (
                `${s}{\n` +
                `${s}  Name: ${this._name}\n` +
                `${s}  Operation: ${this._operation.op}\n` +
                `${L.stringify(level+1)}\n` +
                `${R.stringify(level+1)}\n` +
                `${s}}`
            );
        }
    }
}

class NodeSet {
    private _nodes : Node[];
    private _root : Node;

    constructor(nodes : Node[], root : Node) {
        this.reset(nodes, root);
    }

    reset(nodes : Node[], root : Node) {
        this._nodes = nodes;
        this._root = root;
    }

    stringify() : string {
        return this._root.stringify();
    }

    simplify() {
        this._root.simplify();
    }

    solve() {
        this.simplify();

        if (typeof this._root.operation === "number" || this._root.operation === "humn")
            throw "Error: Invalid root to solve."

        let L = this._root.operation.L;
        let R = this._root.operation.R;

        let humn_node : Node;
        let result : number;
        if (typeof L.operation === "number") {
            result = L.operation;
            humn_node = R;
        }
        else if (typeof R.operation === "number") {
            result = R.operation;
            humn_node = L;
        }
        else throw "Error: Could not find any number branch in solve."
        
        while (humn_node.operation !== "humn") {
            if (typeof humn_node.operation === "number")
                throw "Eror: humn branch cannot contain only a number."

            let L = humn_node.operation.L;
            let R = humn_node.operation.R;
            let op = humn_node.operation.op;

            let value : number;
            let branch : Node;
            let which_humn : "L" | "R";
            if (typeof L.operation === "number") {
                value = L.operation;
                branch = R;
                which_humn = "R";
            }
            else if (typeof R.operation === "number") {
                value = R.operation;
                branch = L;
                which_humn = "L";
            }
            else throw "Error: Could not find any number branch in solve."
            
            humn_node = branch;

            if (op === "+") {
                result = result - value;
            }
            else if (op === "*") {
                result = result / value;
            }
            else if (op === "-") {
                result = (which_humn === "R")
                    ? (value - result)
                    : (result + value);
            }
            else if (op === "/") {
                result = (which_humn === "R")
                    ? (value / result)
                    : (result * value);
            }
            else {
                throw `Error: Invalid operation in solve: ${op}`;
            }
        }

        return result;
    }
}

class MonkeSet {
    private _monkes : Monke[];

    constructor(monkes : Monke[]) {
        this.reset(monkes);
    }

    get length() { return this._monkes.length; }

    reset(monkes : Monke[]) {
        this._monkes = monkes;
    }

    stringify() : string {
        return this._monkes.map((monke) => monke.stringify()).join("\n");
    }

    monkeByName(name : string) : Monke {
        for (let monke of this._monkes) {
            if (monke.name === name) return monke;
        }
        return undefined;
    }

    monke(n : number) : Monke {
        return this._monkes[n];
    }

    getRootResult() : number {
        return this.monkeByName("root").result;
    }

    getNodes(monke : Monke, nodes : Node[]) : Node {
        let bin_op : BinaryOperation;
        if (typeof monke.operation === "number") {
            bin_op = (monke.name === "humn") ? "humn" : monke.operation;
        }
        else {
            let monke_L = monke.operation.operands.L;
            let monke_R = monke.operation.operands.R;

            bin_op = {
                op : (monke.name === "root") ? "=" : monke.operation.operator,
                L : this.getNodes(monke_L, nodes),
                R : this.getNodes(monke_R, nodes)
            };
        }

        let node = new Node(monke.name, bin_op);
        nodes.push(node);
        return node;
    }

    getNodeSet() : NodeSet {
        let root = this.monkeByName("root");

        let nodes : Node[] = [];

        let root_node = this.getNodes(root, nodes);
        
        return new NodeSet(nodes, root_node);
    }
}

export async function getMonkes(filepath : string) : Promise<MonkeSet> {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    let monkes : Monke[] = [];
    let monke_operations : ({L : string, R : string, op : string} | number)[] = [];

    for await(let line of rl) {
        line = line.trim();
        if (line === "") continue;
        
        let [name, op_str] = line.split(":");

        let op_arr = op_str.trim().split(" ");

        let monke_op = (op_arr.length === 1)
            ? Number(op_arr[0])
            : {L : op_arr[0], op : op_arr[1], R : op_arr[2]};

        monkes.push(new Monke(name));
        monke_operations.push(monke_op);
    }

    for (let n = 0; n < monkes.length; n++) {
        let op = monke_operations[n];

        let operation : MonkeOperation;
        if (typeof op === "number") {
            operation = op;
        }
        else {
            let monke_L : Monke = undefined;
            let monke_R : Monke = undefined;
            for (let n2 = 0; n2 < monkes.length; n2++) {
                let monke = monkes[n2];
                if (monke.name === op.L) monke_L = monke;
                if (monke.name === op.R) monke_R = monke;

                if (monke_L !== undefined && monke_R !== undefined) break;
            }
            if (monke_L === undefined || monke_R === undefined)
                throw `Error: Could not find monke operands: ${op.L} and/or ${op.R}.`

            operation = {operands: {L : monke_L, R : monke_R}, operator : op.op}
        }

        monkes[n].setOperation(operation);
    }

    return new MonkeSet(monkes);
}