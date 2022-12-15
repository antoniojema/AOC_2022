import * as fs from 'fs';
import * as readline from 'readline';

export class Index extends Array<number>{
    constructor(row : number, col : number) {
        super(2)
        this.reset(row, col);
    }

    reset(row : number, col : number) {
        this[0] = row;
        this[1] = col;
    }
    
    get row() : number {return this[0];}
    get col() : number {return this[1];}

    get clone() {return new Index(this.row, this.col);}

    stringify() : string {return `(${this.col},${this.row})`;}
}

export class Path {
    private indices : Index[] = [];

    push(index : Index) : this {
        this.indices.push(index);
        return this;
    }

    stringify() : string {
        return this.indices.map((index) => index.stringify()).join(" -> ");
    }

    *allIndices() : Iterable<Index> {
        for (let n = 0; n < this.length-1; n++) {
            const idx0 = this.indices[n  ];
            const idx1 = this.indices[n+1];

            const row_lims = [Math.min(idx0.row, idx1.row), Math.max(idx0.row, idx1.row)];
            const col_lims = [Math.min(idx0.col, idx1.col), Math.max(idx0.col, idx1.col)];

            for (let row = row_lims[0]; row <= row_lims[1]; row++) {
            for (let col = col_lims[0]; col <= col_lims[1]; col++) {
                yield new Index(row, col);
            }}
        }
    }

    get length() {return this.indices.length;}

    get minRow() {return this.indices.reduce((prev, curr) => (prev.row < curr.row) ? prev : curr).row;}
    get minCol() {return this.indices.reduce((prev, curr) => (prev.col < curr.col) ? prev : curr).col;}

    get maxRow() {return this.indices.reduce((prev, curr) => (prev.row > curr.row) ? prev : curr).row;}
    get maxCol() {return this.indices.reduce((prev, curr) => (prev.col > curr.col) ? prev : curr).col;}
}

export class PathSet {
    private paths : Path[] = [];

    push(path : Path) {
        this.paths.push(path);
    }

    stringify() : string {
        return this.paths.map((path) => path.stringify()).join("\n");
    }

    *allPaths() : Iterable<Path> {
        for(const path of this.paths) {
            yield path
        }
    }

    get length() {return this.paths.length;}

    get minRow() {return this.paths.reduce((prev, curr) => (prev.minRow < curr.minRow) ? prev : curr).minRow;}
    get minCol() {return this.paths.reduce((prev, curr) => (prev.minCol < curr.minCol) ? prev : curr).minCol;}

    get maxRow() {return this.paths.reduce((prev, curr) => (prev.maxRow > curr.maxRow) ? prev : curr).maxRow;}
    get maxCol() {return this.paths.reduce((prev, curr) => (prev.maxCol > curr.maxCol) ? prev : curr).maxCol;}
}

enum Tile {
    empty, rock, sand
}

function isEmpty(tile : Tile) {return tile === Tile.empty;}
function isFull(tile : Tile) {return tile === Tile.rock || tile === Tile.sand;}

class Map {
    private map : Tile[][];
    private row_lims : [number, number];
    private col_lims : [number, number];
    private source : Index;
    private has_floor : boolean;

    constructor (path_set : PathSet, floor_distance : number = undefined, source : Index = new Index(0, 500)) {
        this.reset(path_set, floor_distance, source);
    }

    reset (path_set : PathSet, floor_distance : number = undefined, source : Index = new Index(0, 500)) {
        this.source = source;

        this.row_lims = [Math.min(path_set.minRow, source.row), Math.max(path_set.maxRow, source.row)];
        this.col_lims = [Math.min(path_set.minCol, source.col), Math.max(path_set.maxCol, source.col)];

        if (floor_distance !== undefined) {
            this.row_lims[1] += floor_distance;
            this.has_floor = true;
            
            const height = this.row_lims[1] - source.row;
            this.col_lims[0] = Math.min(this.col_lims[0], source.col - height - 1);
            this.col_lims[1] = Math.max(this.col_lims[1], source.col + height + 1);
        }
        else {
            this.has_floor = false;
        }

        this.map = new Array<Tile[]>(this.nRows);
        for (let row = 0; row < this.nRows; row++) {
            this.map[row] = new Array<Tile>(this.nCols);
            this.map[row].fill(Tile.empty);
        }

        for (const path of path_set.allPaths()) {
            this.fill(path);
        }

        if (floor_distance !== undefined) {
            this.fill(new Path().push(
                new Index(this.row_lims[1], this.col_lims[0])
            ).push(
                new Index(this.row_lims[1], this.col_lims[1])
            ));
        }
    }

    get nRows() {return this.row_lims[1] - this.row_lims[0] + 1;}
    get nCols() {return this.col_lims[1] - this.col_lims[0] + 1;}

    contains(index : Index) : boolean {
        if (
            index.row < this.row_lims[0] || index.row > this.row_lims[1] ||
            index.col < this.col_lims[0] || index.col > this.col_lims[1]
        )
            return false;
        else
            return true;
    }

    private indexToArray(index : Index) : Index {
        return new Index(
            index.row - this.row_lims[0],
            index.col - this.col_lims[0]
        );
    }

    private arrayToIndex(index : Index) : Index {
        return new Index(
            index.row + this.row_lims[0],
            index.col + this.col_lims[0]
        );
    }

    set(index : Index, value : Tile) {
        const [row, col] = this.indexToArray(index);
        this.map[row][col] = value;
    }

    get(index : Index) : Tile {
        const [row, col] = this.indexToArray(index);
        return this.map[row][col];
    }

    fill(path : Path) {
        for (const index of path.allIndices()) {
            if (!this.contains(index))
                throw `Error: Index out of bounds: ${index.stringify()}`;
            
            this.set(index, Tile.rock)
        }
    }

    stringify() : string {
        let str = ""
        for (let row = 0; row < this.nRows; row++) {
            for (let col = 0; col < this.nCols; col++) {
                switch (this.map[row][col]) {
                case (Tile.empty) : str += "."; break;
                case (Tile.rock ) : str += "#"; break;
                case (Tile.sand ) : str += "o"; break;
                }
            }
            str += (row === this.nRows-1) ? "" : "\n"
        }
        return str;
    }

    dropOne() : boolean {
        if (this.get(this.source) === Tile.sand) return false;

        let index = this.source.clone;
        
        while (true) {
            for (let row = index.row; row <= this.row_lims[1]; row++) {
                const idx = new Index(row+1, index.col);

                if (!this.contains(idx)) return false;

                if (isFull(this.get(idx))) {
                    const idx_sides = [
                        new Index(row+1, index.col-1),
                        new Index(row+1, index.col+1)
                    ]

                    let do_break = false;
                    for (const idx_side of idx_sides) {
                        if (!this.contains(idx_side)) return false;

                        if (isEmpty(this.get(idx_side))) {
                            index = idx_side;
                            do_break = true;
                            break;
                        }
                    }
                    
                    if (do_break) break;

                    this.set(new Index(row, index.col), Tile.sand);
                    return true;
                }
            }
        }
    }

    dropAll() : number {
        let n = 0;
        while(this.dropOne()) n++;
        return n;
    }
}


export async function getMap(
    filepath : string,
    floor_distance : number = undefined,
    source : Index = new Index(0, 500)
) : Promise<Map> {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    let path_set : PathSet = new PathSet

    for await(let line of rl) {
        line = line.trim();
        if (line === "") continue;

        let path = new Path;
        
        for (const index_str of line.split("->")) {
            const [col, row] = index_str.split(",").map((str) => Number(str.trim()))
            
            path.push(new Index(row, col));
        }

        path_set.push(path);
    }

    return new Map(path_set, floor_distance, source);
}