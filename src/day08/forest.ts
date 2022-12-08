import * as fs from 'fs';
import * as readline from 'readline';

export enum Dir  {
    row, col
}

export enum Bound {
    L, U
}

export class Forest {
    trees : number[][];

    constructor(trees : number[][]) {
        this.trees = trees;
    }

    get nRows() : number {
        return this.trees.length;
    }

    get nCols() : number {
        if (this.trees.length <= 0) return 0;
        return this.trees[0].length;
    }

    isVisibleInDirection(row : number, col : number, dir : Dir, bound : Bound) : boolean {
        let limsL = [[  0,   0], [     row+1,      col+1]];
        let limsU = [[row, col], [this.nRows, this.nCols]];

        let height = this.trees[row][col];

        let index = [row, col];
        let limL = limsL[bound][dir];
        let limU = limsU[bound][dir];

        let visible = true;
        for (index[dir] = limL; index[dir] < limU; index[dir]++) {
            if (this.trees[index[Dir.row]][index[Dir.col]] >= height) {
                visible = false;
                break;
            }
        }
        return visible;
    }

    visibleTreesInDirection(row : number, col : number, dir : Dir, bound : Bound) : number {
        let limsL = [[row-1, col-1], [     row+1,      col+1]];
        let limsU = [[   -1,    -1], [this.nRows, this.nCols]];
        let incs = [-1, 1];

        let height = this.trees[row][col];

        let index = [row, col];
        let limL = limsL[bound][dir];
        let limU = limsU[bound][dir];
        let inc = incs[bound];

        let n_visible = 0;
        for (index[dir] = limL; index[dir] != limU; index[dir] += inc) {
            n_visible++;
            if (this.trees[index[Dir.row]][index[Dir.col]] >= height) {
                break;
            }
        }

        return n_visible;
    }

    scenicScore(row : number, col : number) : number {
        let score = 1;
        for (let dir of [Dir.row, Dir.col]) {
        for (let bound of [Bound.L, Bound.U]) {
            score *= this.visibleTreesInDirection(row, col, dir, bound);
        }}
        return score;
    }

    get highestScenicScore() {
        let max_score = 0;
        for (let row = 0; row < this.nRows; row++) {
        for (let col = 0; col < this.nCols; col++) {
            max_score = Math.max(max_score, this.scenicScore(row, col));
        }}
        return max_score;
    }

    isVisible(row : number, col : number) : boolean {
        if (row == 0 || row == this.nRows-1 || col == 0 || col == this.nCols-1)
            return true;
        
        for (let dir of [Dir.row, Dir.col]) {
        for (let bound of [Bound.L, Bound.U]) {
            if (this.isVisibleInDirection(row, col, dir, bound))
                return true;
        }}
        return false;
    }

    get nVisible() : number {
        let n_visible = 0;
        for (let row = 0; row < this.nRows; row++) {
        for (let col = 0; col < this.nCols; col++) {
            if (this.isVisible(row, col)) n_visible++;
        }}
        return n_visible;
    }
}

export async function getForest(filepath : string) : Promise<Forest> {
    console.log(`Getting forest from file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    let trees : number[][] = [];

    for await(let line of rl) {
        line = line.trim();

        let row : number[] = []
        for (let n = 0; n < line.length; n++) {
            row.push(Number(line[n]));
        }

        trees.push(row);
    }

    return new Forest(trees);
}