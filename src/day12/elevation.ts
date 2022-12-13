import * as fs from 'fs';
import * as readline from 'readline';
import { start } from 'repl';

const ascii_a = 'a'.charCodeAt(0);
const ascii_z = 'z'.charCodeAt(0);

export class Index extends Array<number> {
    constructor(row : number, col : number) {
        super(2);
        this[0] = row;
        this[1] = col;
    }

    get row() : number {return this[0];}
    get col() : number {return this[1];}

    get clone() : Index {
        return new Index(this.row, this.col);
    }

    equals(other : Index) : boolean {
        return this.row === other.row && this.col === other.col;
    }
}

export type Path = Index[];

export class Map {
    private elevation : number[][];

    constructor(elevation : number[][]) {
        this.reset(elevation);
    }

    reset(elevation : number[][]) {
        this.elevation = elevation;
    }

    get nRows() : number {return this.elevation.length;}
    get nCols() : number {return this.elevation[0].length;}

    findShortestDistance(
        start_pos : Index,
        connects : (from : Index, to : Index, elevation : number[][]) => boolean,
        found : (pos: Index, elev : number[][]) => boolean
    ) : number {
        let distance : number[][] = new Array<number[]>(this.nRows);
        for (let row = 0; row < this.nRows; row++) {
            distance[row] = new Array<number>(this.nCols);
            for (let col = 0; col < this.nCols; col++) {
                distance[row][col] = +Infinity;
            }
        }

        distance[start_pos.row][start_pos.col] = 0;
        
        let current_indices : Index[] = [start_pos];

        while(current_indices.length > 0) {
            let new_indices : Index[] = [];
            
            for (let pos of current_indices) {
                for (const [inc_row, inc_col] of [[-1, 0], [+1, 0], [0, -1], [0, +1]]) {
                    const new_row = pos.row + inc_row;
                    const new_col = pos.col + inc_col;
                    const new_pos = new Index(new_row, new_col);

                    // Check bounds
                    if (new_row < 0 || new_col < 0 || new_row >= this.elevation.length || new_col >= this.elevation[0].length)
                        continue;
                    
                    // Check elevation
                    // if (this.elevation[new_row][new_col] > this.elevation[pos.row][pos.col] + 1)
                    if (!connects(pos, new_pos, this.elevation))
                        continue;

                    let dist = distance[pos.row][pos.col] + 1;

                    if (found(new_pos, this.elevation)){
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

export async function getMap(filepath : string) : Promise<[Map,Index,Index]> {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    let elevation : number[][] = [];
    let start_pos : Index;
    let final_pos : Index;
    let n_row = 0;

    for await(let line of rl) {
        line = line.trim();
        if (line === "") continue;

        let row : number[] = [];
        for (let n_col = 0; n_col < line.length; n_col++) {
            switch(line.charAt(n_col)) {
                case('S') :
                    start_pos = new Index(n_row, n_col);
                    row.push(0);
                    break;
                case('E') :
                    final_pos = new Index(n_row, n_col);
                    row.push(ascii_z - ascii_a);
                    break;
                default :
                    row.push(line.charCodeAt(n_col) - ascii_a);
            }
        }
        elevation.push(row);
        
        n_row++;
    }

    return [new Map(elevation), start_pos, final_pos];
}
