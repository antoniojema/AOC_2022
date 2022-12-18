import * as fs from 'fs';
import * as readline from 'readline';
import { Sparse } from './sparse.js';

export enum Tile {
    empty, beacon, sensor, unknown
}

function isEmpty(tile : Tile) : boolean {
    return tile === Tile.empty || tile === Tile.sensor;
}

export class Index extends Array<number>{
    constructor(row : number, col : number) {
        super(2)
        this.reset(row, col);
    }

    reset(row : number, col : number) {
        this[0] = row;
        this[1] = col;
    }

    equals(other : Index) : boolean {
        return this.row == other.row &&
               this.col == other.col;
    }
    
    get row() : number {return this[0];}
    get col() : number {return this[1];}
    
    set row(val : number) {this[0] = val;}
    set col(val : number) {this[1] = val;}

    get clone() {return new Index(this.row, this.col);}

    stringify() : string {return `(${this.col},${this.row})`;}

    manhattanDist(other : Index) {
        return Math.abs(this.row - other.row) + Math.abs(this.col - other.col);
    }

    get tuningFrequency() { return this.col * 4000000 + this.row; }
}

class Sensor {
    position : Index;
    closest_beacon : Index;

    constructor(position : Index, closest_beacon : Index) {
        this.reset(position, closest_beacon);
    }

    stringify() : string {
        return `Sensor at ${this.position.stringify()}: closest beacon is at ${this.closest_beacon.stringify()}`;
    }

    reset(position : Index, closest_beacon : Index) {
        this.position = position;
        this.closest_beacon = closest_beacon;
    }
    
    manhattanDist() { return this.position.manhattanDist(this.closest_beacon); }

    // get minRow() { return Math.min(this.position.row, this.closest_beacon.row)}
    // get minCol() { return Math.min(this.position.col, this.closest_beacon.col)}
    // get maxRow() { return Math.max(this.position.row, this.closest_beacon.row)}
    // get maxCol() { return Math.max(this.position.col, this.closest_beacon.col)}

    get minRow() { return this.position.row - this.manhattanDist();}
    get minCol() { return this.position.col - this.manhattanDist();}
    get maxRow() { return this.position.row + this.manhattanDist();}
    get maxCol() { return this.position.col + this.manhattanDist();}
}

export class TileArray {
    private arr : Tile[];
    private lim : [number, number]

    constructor(lim_L : number, lim_U : number) {
        this.reset(lim_L, lim_U);
    }

    reset(lim_L : number, lim_U : number) {
        this.lim = [lim_L, lim_U];
        this.arr = new Array<Tile>(this.length);
        this.fill(Tile.unknown);
    }

    fill(value : Tile) {
        for (let n = 0; n < this.length; n++) this.arr[n] = value;
    }

    get length() {return this.lim[1] - this.lim[0] + 1;}

    indexToArray(index : number) { return index - this.lim[0]; }

    get(index : number) : Tile {
        return this.arr[this.indexToArray(index)];
    }

    set(index : number, value : Tile) {
        this.arr[this.indexToArray(index)] = value;
    }

    allTiles() : Tile[] {
        return this.arr;
    }
}

class SensorSet {
    private sensors : Sensor[] = []

    push(sensor : Sensor) {
        this.sensors.push(sensor);
    }
    stringify() : string {
        return this.sensors.map((s) => s.stringify()).join("\n");
    }

    *allSensors() {
        for (const s of this.sensors) yield s;
    }

    adjustLims(lim_L : Index, lim_U : Index) : [Index, Index] {
        return [
            new Index(
                Math.max(lim_L.row, this.minRow),
                Math.max(lim_L.col, this.minCol)
            ),
            new Index(
                Math.min(lim_U.row, this.maxRow),
                Math.min(lim_U.col, this.maxCol)
            )
        ];
    }

    get minRow() { return this.sensors.reduce((prev, curr) => (prev.minRow < curr.minRow) ? prev : curr).minRow}
    get minCol() { return this.sensors.reduce((prev, curr) => (prev.minCol < curr.minCol) ? prev : curr).minCol}
    get maxRow() { return this.sensors.reduce((prev, curr) => (prev.maxRow > curr.maxRow) ? prev : curr).maxRow}
    get maxCol() { return this.sensors.reduce((prev, curr) => (prev.maxCol > curr.maxCol) ? prev : curr).maxCol}

    hasSensorAt(index : Index) {
        for (const sensor of this.sensors) {
            if (sensor.position.equals(index)) return true;
        }
        return false;
    }

    hasBeaconAt(index : Index) {
        for (const sensor of this.sensors) {
            if (sensor.closest_beacon.equals(index)) return true;
        }
        return false;
    }

    getTilesAtRow(row : number, col_lim : [number, number] = undefined) : TileArray {
        if (col_lim === undefined) {
            col_lim = [this.minCol, this.maxCol];
        }
        else {
            if (col_lim[0] === undefined)
                col_lim[0] = this.minCol;
            if (col_lim[1] === undefined)
                col_lim[1] = this.maxCol;
        }

        const tile_arr = new TileArray(col_lim[0], col_lim[1]);
        for (const sensor of this.sensors) {
            const dist = sensor.manhattanDist();

            const rest = dist - Math.abs(sensor.position.row - row);

            if (rest >= 0) {
                const ini = Math.max(col_lim[0], sensor.position.col - rest);
                const fin = Math.min(col_lim[1], sensor.position.col + rest);

                for (let n = ini; n <= fin; n++) {
                    const idx = new Index(row, n);
                    if (this.hasSensorAt(idx))
                        tile_arr.set(n, Tile.sensor);
                    else if (this.hasBeaconAt(idx))
                        tile_arr.set(n, Tile.beacon);
                    else
                        tile_arr.set(n, Tile.empty);
                }
            }
        }

        return tile_arr;
    }

    getNonUnknownSparseTilesAtRow(row : number, col_lim : [number, number] = undefined) : Sparse.SliceArray<boolean> {
        if (col_lim === undefined) {
            col_lim = [this.minCol, this.maxCol];
        }
        else {
            if (col_lim[0] === undefined)
                col_lim[0] = this.minCol;
            if (col_lim[1] === undefined)
                col_lim[1] = this.maxCol;
        }

        const tile_arr = new Sparse.SliceArray<boolean>({ini : col_lim[0], fin : col_lim[1]}, false);
        for (const sensor of this.sensors) {
            const dist = sensor.manhattanDist();

            const rest = dist - Math.abs(sensor.position.row - row);

            if (rest >= 0) {
                const ini = Math.max(col_lim[0], sensor.position.col - rest);
                const fin = Math.min(col_lim[1], sensor.position.col + rest);

                tile_arr.setRange({ini : ini, fin : fin}, true);
            }
        }

        return tile_arr;
    }

    getEmptyTilesAtRow(row : number) : number {
        return this.getTilesAtRow(row).allTiles().reduce((acc, curr) => acc + (isEmpty(curr) ? 1 : 0), 0)
    }

    getUnknownInRange(lim_L : Index, lim_U : Index) : Index {
        [lim_L, lim_U] = this.adjustLims(lim_L, lim_U);

        for (let row = lim_L.row; row <= lim_U.row; row++) {
            const tiles = this.getTilesAtRow(row, [lim_L.col, lim_U.col]);
            
            for (let col = lim_L.col; col <= lim_U.col; col++) {
                if (tiles.get(col) === Tile.unknown)
                    return new Index(row, col);
            }
        }
        return undefined;
    }

    getUnknownInRange_SparseArray(lim_L : Index, lim_U : Index) : Index {
        [lim_L, lim_U] = this.adjustLims(lim_L, lim_U);

        for (let row = lim_L.row; row <= lim_U.row; row++) {
            const tiles = this.getNonUnknownSparseTilesAtRow(row, [lim_L.col, lim_U.col]);

            const empty_pos = tiles.getEmptyPos();
            if (empty_pos !== undefined) {
                return new Index(row, empty_pos);
            }
        }
        return undefined;
    }

    getUnknownInRange_SparseMap(lim_L : Index, lim_U : Index) : Index {
        [lim_L, lim_U] = this.adjustLims(lim_L, lim_U);

        const sparse_map = this.getSparseMap(lim_L, lim_U);

        for (let row = lim_L.row; row <= lim_U.row; row++) {
            const empty_pos = sparse_map[row - lim_L.row].getEmptyPos();

            if (empty_pos !== undefined) {
                return new Index(row, empty_pos);
            }
        }
        return undefined;
    }

    getSparseMap(lim_L : Index, lim_U : Index) : Sparse.SliceMatrix<boolean> {
        [lim_L, lim_U] = this.adjustLims(lim_L, lim_U);

        const sparse_map = new Array<Sparse.SliceArray<boolean>>(lim_U.row - lim_L.row + 1);
        for (let n = 0; n < lim_U.row - lim_L.row + 1; n++)
            sparse_map[n] = new Sparse.SliceArray<boolean>({ini : lim_L.col, fin : lim_U.col}, false);
        
        for (const sensor of this.sensors) {
            const dist = sensor.manhattanDist();

            const row_min = Math.max(sensor.position.row - dist, lim_L.row);
            const row_max = Math.min(sensor.position.row + dist, lim_U.row);

            for (let row = row_min; row <= row_max; row++) {
                const rest = dist - Math.abs(sensor.position.row - row);

                if (rest >= 0) {
                    const ini = Math.max(lim_L.col, sensor.position.col - rest);
                    const fin = Math.min(lim_U.col, sensor.position.col + rest);
    
                    sparse_map[row - lim_L.row].setRange({ini : ini, fin : fin}, true);
                }
            }
        }
        return sparse_map;
    }

    getMap(lim_L : Index = new Index(-Infinity,-Infinity), lim_U : Index = new Index(Infinity, Infinity)) : string{
        [lim_L, lim_U] = this.adjustLims(lim_L, lim_U);

        let str = "";
        for (let row = lim_L.row; row <= lim_U.row; row++) {
            str += this.getTilesAtRow(row, [lim_L.col, lim_U.col]).allTiles().map((t) => {
                switch(t) {
                case (Tile.unknown): return ".";
                case (Tile.empty  ): return "#";
                case (Tile.beacon ): return "B";
                case (Tile.sensor ): return "S";
                }
            }).join("") + "\n";
        }
        return str;
    }
}

export async function getSensors(filepath : string) : Promise<SensorSet> {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    let sensor_set = new SensorSet;

    for await(let line of rl) {
        line = line.trim()
        if (line === "") continue;

        const [sensor_str, beacon_str] = line.split(":");
        const [sensor_col_str, sensor_row_str] = sensor_str.split(",");
        const [beacon_col_str, beacon_row_str] = beacon_str.split(",");

        const sensor_col = Number(sensor_col_str.substring(sensor_col_str.indexOf("x=")+2))
        const sensor_row = Number(sensor_row_str.substring(sensor_row_str.indexOf("y=")+2))

        const beacon_col = Number(beacon_col_str.substring(beacon_col_str.indexOf("x=")+2))
        const beacon_row = Number(beacon_row_str.substring(beacon_row_str.indexOf("y=")+2))

        sensor_set.push(new Sensor(
            new Index(sensor_row, sensor_col),
            new Index(beacon_row, beacon_col)
        ));
    }

    return sensor_set;
}