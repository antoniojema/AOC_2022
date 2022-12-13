import * as fs from 'fs';
import * as readline from 'readline';
const ascii_a = 'a'.charCodeAt(0);
const ascii_z = 'z'.charCodeAt(0);
export class Index extends Array {
    constructor(row, col) {
        super(2);
        this[0] = row;
        this[1] = col;
    }
    get row() { return this[0]; }
    get col() { return this[1]; }
    get clone() {
        return new Index(this.row, this.col);
    }
    equals(other) {
        return this.row === other.row && this.col === other.col;
    }
}
export class Map {
    elevation;
    constructor(elevation) {
        this.reset(elevation);
    }
    reset(elevation) {
        this.elevation = elevation;
    }
    get nRows() { return this.elevation.length; }
    get nCols() { return this.elevation[0].length; }
    findShortestDistance(start_pos, connects, found) {
        let distance = new Array(this.nRows);
        for (let row = 0; row < this.nRows; row++) {
            distance[row] = new Array(this.nCols);
            for (let col = 0; col < this.nCols; col++) {
                distance[row][col] = +Infinity;
            }
        }
        distance[start_pos.row][start_pos.col] = 0;
        let current_indices = [start_pos];
        while (current_indices.length > 0) {
            let new_indices = [];
            for (let pos of current_indices) {
                for (const [inc_row, inc_col] of [[-1, 0], [+1, 0], [0, -1], [0, +1]]) {
                    const new_row = pos.row + inc_row;
                    const new_col = pos.col + inc_col;
                    const new_pos = new Index(new_row, new_col);
                    if (new_row < 0 || new_col < 0 || new_row >= this.elevation.length || new_col >= this.elevation[0].length)
                        continue;
                    if (!connects(pos, new_pos, this.elevation))
                        continue;
                    let dist = distance[pos.row][pos.col] + 1;
                    if (found(new_pos, this.elevation)) {
                        return dist;
                    }
                    else {
                        if (distance[new_row][new_col] === Infinity) {
                            new_indices.push(new_pos);
                        }
                        distance[new_row][new_col] = dist;
                    }
                }
            }
            current_indices = new_indices;
        }
        return undefined;
    }
}
export async function getMap(filepath) {
    console.log(`Opening file: ${filepath}`);
    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });
    let elevation = [];
    let start_pos;
    let final_pos;
    let n_row = 0;
    for await (let line of rl) {
        line = line.trim();
        if (line === "")
            continue;
        let row = [];
        for (let n_col = 0; n_col < line.length; n_col++) {
            switch (line.charAt(n_col)) {
                case ('S'):
                    start_pos = new Index(n_row, n_col);
                    row.push(0);
                    break;
                case ('E'):
                    final_pos = new Index(n_row, n_col);
                    row.push(ascii_z - ascii_a);
                    break;
                default:
                    row.push(line.charCodeAt(n_col) - ascii_a);
            }
        }
        elevation.push(row);
        n_row++;
    }
    return [new Map(elevation), start_pos, final_pos];
}
//# sourceMappingURL=elevation.js.map