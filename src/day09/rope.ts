import * as fs from 'fs';
import * as readline from 'readline';

export interface SetItem {
    equals(other : SetItem) : boolean;
}

export class CustomSet<T extends SetItem> extends Set<T> {
    add(item : T) : this {
        for (const other of this) {
            if (other.equals(item)) {
                return;
            }
        }
        super.add(item);
    }
}

export enum Direction {
    left, right, up, down
}

export type DirectionChar = "L"|"U"|"R"|"D";
export const DirectionCharSet = ["L", "U", "R", "D"];

export const charToDirection = {
    "L" : Direction.left,
    "R" : Direction.right,
    "D" : Direction.down,
    "U" : Direction.up,
}

export class Movement {
    direction : Direction
    amount : number

    constructor(direction : Direction, amount : number) {
        this.set(direction, amount);
    }

    set(direction : Direction, amount : number) {
        this.direction = direction
        this.amount = amount
    }
}

export class MovementSet {
    movements : Movement[] = [];

    push(movement : Movement) {
        this.movements.push(movement);
    }
}

export class Coord {
    x : number
    y : number

    constructor(x : number, y : number) {
        this.set(x,y);
    }

    set (x : number, y : number) {
        this.x = x;
        this.y = y;
    }

    get clone() : Coord {
        return new Coord(this.x, this.y);
    }

    equals(other : Coord) : boolean {
        return this.x == other.x && this.y == other.y;
    }

    applyMovement(dir : Direction) {
        switch (dir) {
            case (Direction.left ): this.x--; break;
            case (Direction.right): this.x++; break;
            case (Direction.down ): this.y--; break;
            case (Direction.up   ): this.y++; break;
        }
    }

    follow(head : Coord) {
        const dist_x = Math.abs(head.x-this.x);
        const dist_y = Math.abs(head.y-this.y);
        const dist = Math.max(dist_x, dist_y);
        if (dist > 1) {
            if      (head.x > this.x) this.x++;
            else if (head.x < this.x) this.x--;
            if      (head.y > this.y) this.y++;
            else if (head.y < this.y) this.y--;
        }
    }
}

export class Simulation {
    movements : MovementSet = new MovementSet;
    visited : CustomSet<Coord> = new CustomSet<Coord>();

    async reset(filepath : string) {
        console.log(`Reading file: ${filepath}`)

        this.movements = new MovementSet;

        const rl = readline.createInterface({
            input: fs.createReadStream(filepath)
        });

        for await(let line of rl) {
            if (line.trim() == "") continue;

            line = line.trim();
            const [dir_char, amount_char] = line.split(" ");

            if (DirectionCharSet.indexOf(dir_char) == -1) {
                throw `Error: Invalid direction ${dir_char}`;
            }

            const dir = charToDirection[dir_char.toUpperCase() as DirectionChar]
            const amount = Number(amount_char.trim());
            this.movements.push(new Movement(dir, amount));
        }
    }

    run(n_knots : number) {
        let knot_coords : Coord[] = new Array<Coord>(n_knots);
        for (let n = 0; n < n_knots; n++) {
            knot_coords[n] = new Coord(0, 0);
        }
        this.visited.add(new Coord(0,0));

        for (const movement of this.movements.movements) {
            for (let n = 0; n < movement.amount; n++) {
                knot_coords[0].applyMovement(movement.direction);
                for (let n = 1; n < n_knots; n++) {
                    knot_coords[n].follow(knot_coords[n-1]);
                }

                this.visited.add(knot_coords[n_knots-1].clone);
            }
        }
    }

    get nVisited() {
        return this.visited.size;
    }
}
