import * as fs from 'fs';
import * as readline from 'readline';


class List {
    private list : number[];
    private pos_in_order : number[];

    constructor(values : number[]) {
        this.list = values;
    }

    get length() {return this.list.length;}

    private move(nth : number) {
        let orig_pos = this.pos_in_order[nth];

        let move = this.list[orig_pos];
        if (move === 0) return;

        let new_pos = orig_pos + move;

        if (new_pos < 0) {
            new_pos = Math.abs(new_pos % (this.length-1));
            if (new_pos !== 0) new_pos = this.length-1 - new_pos;
        }
        if (new_pos >= this.length) {
            new_pos = new_pos % (this.length-1);
        }

        this.list.splice(orig_pos, 1);
        this.list.splice(new_pos, 0, move);

        let middle_move = (new_pos > orig_pos) ? -1 : 1;
        let middle_ini = (new_pos > orig_pos) ? orig_pos + 1 : new_pos;
        let middle_fin = (new_pos > orig_pos) ? new_pos : orig_pos - 1;

        for (let n = 0; n < this.length; n++) {
            let pos = this.pos_in_order[n];
            if (middle_ini <= pos && pos <= middle_fin) {
                this.pos_in_order[n] += middle_move;
            }
        }
        this.pos_in_order[nth] = new_pos;
    }

    private initPosInOrder() {
        this.pos_in_order = new Array<number>(this.length);
        for (let n = 0; n < this.length; n++) this.pos_in_order[n] = n;
    }

    private mix() {
        for (let n = 0; n < this.length; n++) {
            this.move(n)
        }
    }

    private getGrooveCoordinates() : [number, number, number] {
        let pos_0 = this.list.indexOf(0);
        let remain_0 = this.length - pos_0;

        let coords : [number, number, number] = [0,0,0];
        let n = 0;
        for (let pos of [1000, 2000, 3000]) {
            pos = pos % this.length;
            pos = (pos < remain_0) ? (pos_0 + pos) : (pos - remain_0);

            console.log(this.list[pos]);

            coords[n++] = this.list[pos];
        }
        return coords;
    }

    private multiplyAll(multiply : number) {
        for (let n = 0; n < this.length; n++) {
            this.list[n] *= multiply;
        }
    }

    getGroveCoordinatesSum(n_mix : number = 1, multiply : number = 1) : number{
        if (multiply !== 1) this.multiplyAll(multiply);

        this.initPosInOrder();
        
        for (let m = 0; m < n_mix; m++) {
            this.mix();
        }

        return this.getGrooveCoordinates().reduce((acc, curr) => acc+curr, 0);
    }
}

export async function getList(filepath : string) {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    let list : number[] = [];

    for await(let line of rl) {
        line = line.trim();
        if (line === "") continue;
        
        list.push(Number(line));
    }

    return new List(list);
}