import * as fs from 'fs';
import * as readline from 'readline';

type Index = {x : number, y : number, z : number};
const IndexKeys = ["x", "y", "z"] as const;

function emptyIndex() {
    return {x : 0, y : 0, z : 0};
}

function copyIndex(index : Index) {
    return {x : index.x, y : index.y, z : index.z};
}

const RelativeNeighbours = (() => {
    let indices : Index[] = []
    for (let key of IndexKeys) {
        for (let sum of [+1, -1]) {
            let index = emptyIndex();
            index[key] = sum;
            indices.push(index);
        }
    }
    return indices;
})();

const Emptyness = {
    empty : false,
    full  : true
} as const;

type EmptynessType = typeof Emptyness[keyof typeof Emptyness];

class LavaDroplet extends Array<Array<Array<EmptynessType>>> {
    private ini : Index;
    private size : Index;
    private air_pocket : boolean[][][];

    get getSize() : Index { return this.size; }
    get min() : Index { return this.ini; }
    get max() : Index {
        let index : Index = emptyIndex();
        for (const key of IndexKeys) {
            index[key] = this.ini[key] + this.size[key] - 1
        }
        return index;
    }

    constructor(ini : Index, size : Index, cubes : Index[]) {
        super(size.x);

        this.ini = ini;
        this.size = size;
        
        for (let i = 0; i < size.x; i++) {
            this[i] = new Array<boolean[]>(size.y);
            for (let j = 0; j < size.y; j++) {
                this[i][j] = new Array<boolean>(size.z).fill(Emptyness.empty);
            }
        }

        this.fillByIndex(cubes, Emptyness.full);

        this.setAirPockets();
    }

    private setAirPockets() {
        this.air_pocket = new Array<boolean[][]>(this.size.x);
        for (let i = 0; i < this.size.x; i++) {
            this.air_pocket[i] = new Array<boolean[]>(this.size.y);
            for (let j = 0; j < this.size.y; j++) {
                this.air_pocket[i][j] = new Array<boolean>(this.size.z).fill(undefined);
            }
        }

        for (let i = 0; i < this.size.x; i++) {
        for (let j = 0; j < this.size.y; j++) {
        for (let k = 0; k < this.size.z; k++) {
            if (this[i][j][k] === Emptyness.full) {
                this.air_pocket[i][j][k] = false;
            }
            else if (this.air_pocket[i][j][k] === undefined) {
                let index = {x : i, y : j, z : k}
                let [indices, touches_limits] = this.growFromArrayIndex(index);
                let is_air_pocket = (touches_limits) ? false : true

                for (let idx of indices) {
                    this.air_pocket[idx.x][idx.y][idx.z] = is_air_pocket;
                }
            }
        }}}
    }

    private growFromArrayIndex(index : Index) : [Index[], boolean] {
        let value = this.getByArrayIndex(index);

        let visited = new Array<boolean[][]>(this.size.x);
        for (let i = 0; i < this.size.x; i++) {
            visited[i] = new Array<boolean[]>(this.size.y);
            for (let j = 0; j < this.size.y; j++) {
                visited[i][j] = new Array<boolean>(this.size.z).fill(false);
            }
        }

        let indices : Index[] = [index];
        let touches_limits = false;

        let current_indices : Index[] = [index];

        while(current_indices.length > 0) {
            let new_indices : Index[] = [];

            for (let curr_index of current_indices) {
                for (let neighbour_index of this.iterateNeighbours(curr_index)) {
                    let i = neighbour_index.x;
                    let j = neighbour_index.y;
                    let k = neighbour_index.z;
                    if (!this.arrayIndexInside(neighbour_index)) {
                        touches_limits = true;
                    }
                    else if ((!visited[i][j][k]) && this.getByArrayIndex(neighbour_index) === value){
                        visited[i][j][k] = true;
                        indices.push(neighbour_index);
                        new_indices.push(neighbour_index);
                    }
                }
            }

            current_indices = new_indices;
        }

        return [indices, touches_limits];
    }

    empty() {
        for (let index of this.iterateAllByArrayIndices()) {
            this.setByArrayIndex(index, Emptyness.empty);
        }
    }

    fillByArrayIndex(cubes : Index[], value : EmptynessType) {
        for (let index of cubes) {
            this.setByArrayIndex(index, value);
        }
    }

    fillByIndex(cubes : Index[], value : EmptynessType) {
        for (let index of cubes) {
            this.setByIndex(index, value);
        }
    }

    private indexToArray(index : Index) : Index {
        let arr_index : Index = emptyIndex();
        for (const key of IndexKeys) {
            arr_index[key] = index[key] - this.ini[key];
        }
        return arr_index;
    }

    private arrayToIndex(index : Index) : Index {
        let arr_index : Index = emptyIndex();
        for (const key of IndexKeys) {
            arr_index[key] = index[key] + this.ini[key];
        }
        return arr_index;
    }

    private indexInside(index : Index) : boolean {
        for (const key of IndexKeys) {
            if (index[key] < this.ini[key] || index[key] > this.max[key]) {
                return false;
            }
        }
        return true;
    }

    private arrayIndexInside(index : Index) : boolean {
        for (const key of IndexKeys) {
            if (index[key] < 0 || index[key] >= this.size[key]) {
                return false;
            }
        }
        return true;
    }

    getByArrayIndex(index : Index) : boolean {
        return this[index.x][index.y][index.z];
    }
    getByIndex(index : Index) : boolean {
        return this.getByArrayIndex(this.indexToArray(index));
    }

    getByArrayIndex_Outside(index : Index) : boolean {
        if (!this.arrayIndexInside(index)) return false;
        else return this.getByArrayIndex(index);
    }

    getByIndex_Outside(index : Index) : boolean {
        return this.getByArrayIndex_Outside(this.indexToArray(index));
    }

    setByArrayIndex(index : Index, value : boolean) {
        this[index.x][index.y][index.z] = value;
    }

    setByIndex(index : Index, value : boolean) {
        this.setByArrayIndex(this.indexToArray(index), value);
    }

    *iterateAllByArrayIndices() : Iterable<Index> {
        for (let i = 0; i < this.size.x; i++) {
        for (let j = 0; j < this.size.y; j++) {
        for (let k = 0; k < this.size.z; k++) {
            yield {x : i, y : j, z : k};
        }}}
    }

    *iterateAllByIndices() : Iterable<Index> {
        for (let index of this.iterateAllByArrayIndices()) {
            yield this.arrayToIndex(index);
        }
    }

    *iterateByArrayIndices(value : EmptynessType) : Iterable<Index> {
        for (let index of this.iterateAllByArrayIndices()) {
            if (this.getByArrayIndex(index) === value) {
                yield index;
            }
        }
    }

    *iterateByIndices(value : EmptynessType) : Iterable<Index> {
        for (let index of this.iterateByArrayIndices(value)) {
            yield this.arrayToIndex(index);
        }
    }

    *iterateNeighbours(index : Index) : Iterable<Index> {
        for (let sum of RelativeNeighbours) {
            let neighbour_index = copyIndex(index);
            for (let key of IndexKeys) {
                neighbour_index[key] += sum[key];
            }
            yield neighbour_index;
        }
    }

    get surface() : number {
        let surface = 0;
        for (let index of this.iterateByArrayIndices(Emptyness.full)) {
            for (let neighbour_index of this.iterateNeighbours(index)) {
                if (!this.getByArrayIndex_Outside(neighbour_index)) {
                    surface++;
                }
            }
        }
        return surface;
    }

    get exteriorSurface() : number {
        let surface = 0;
        for (let index of this.iterateByArrayIndices(Emptyness.full)) {
            for (let neighbour_index of this.iterateNeighbours(index)) {
                if (this.getByArrayIndex_Outside(neighbour_index) === false) {
                    if (!this.arrayIndexInside(neighbour_index)){
                        surface++;
                    }
                    else if (!this.air_pocket[neighbour_index.x][neighbour_index.y][neighbour_index.z]) {
                        surface++;
                    }
                }
            }
        }
        return surface;
    }
}

export async function getLavaDroplet(filepath : string) : Promise<LavaDroplet> {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    let cubes : Index[] = [];
    let max : Index = {x : -Infinity, y : -Infinity, z : -Infinity};
    let min : Index = {x : +Infinity, y : +Infinity, z : +Infinity};

    for await(let line of rl) {
        line = line.trim();
        if (line === "") continue;

        let coord = line.split(",").map((num) => Number(num.trim()));
        let index : Index = {x : coord[0], y : coord[1], z : coord[2]} as const;
        
        cubes.push(index);

        for (const key of IndexKeys) {
            max[key] = Math.max(max[key], index[key]);
            min[key] = Math.min(min[key], index[key]);
        }
    }

    let size : Index = emptyIndex();
    for (const key of IndexKeys) {
        size[key] = max[key] - min[key] + 1;
    }

    return new LavaDroplet(min, size, cubes);
}