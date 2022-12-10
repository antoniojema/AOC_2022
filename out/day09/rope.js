import * as fs from 'fs';
import * as readline from 'readline';
export class CustomSet extends Set {
    add(item) {
        for (const other of this) {
            if (other.equals(item)) {
                return;
            }
        }
        super.add(item);
    }
}
export var Direction;
(function (Direction) {
    Direction[Direction["left"] = 0] = "left";
    Direction[Direction["right"] = 1] = "right";
    Direction[Direction["up"] = 2] = "up";
    Direction[Direction["down"] = 3] = "down";
})(Direction || (Direction = {}));
export const DirectionCharSet = ["L", "U", "R", "D"];
export const charToDirection = {
    "L": Direction.left,
    "R": Direction.right,
    "D": Direction.down,
    "U": Direction.up,
};
export class Movement {
    direction;
    amount;
    constructor(direction, amount) {
        this.set(direction, amount);
    }
    set(direction, amount) {
        this.direction = direction;
        this.amount = amount;
    }
}
export class MovementSet {
    movements = [];
    push(movement) {
        this.movements.push(movement);
    }
}
export class Coord {
    x;
    y;
    constructor(x, y) {
        this.set(x, y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    get clone() {
        return new Coord(this.x, this.y);
    }
    equals(other) {
        return this.x == other.x && this.y == other.y;
    }
    applyMovement(dir) {
        switch (dir) {
            case (Direction.left):
                this.x--;
                break;
            case (Direction.right):
                this.x++;
                break;
            case (Direction.down):
                this.y--;
                break;
            case (Direction.up):
                this.y++;
                break;
        }
    }
    follow(head) {
        const dist_x = Math.abs(head.x - this.x);
        const dist_y = Math.abs(head.y - this.y);
        const dist = Math.max(dist_x, dist_y);
        if (dist > 1) {
            if (head.x > this.x)
                this.x++;
            else if (head.x < this.x)
                this.x--;
            if (head.y > this.y)
                this.y++;
            else if (head.y < this.y)
                this.y--;
        }
    }
}
export class Simulation {
    movements = new MovementSet;
    visited = new CustomSet();
    async reset(filepath) {
        console.log(`Reading file: ${filepath}`);
        this.movements = new MovementSet;
        const rl = readline.createInterface({
            input: fs.createReadStream(filepath)
        });
        for await (let line of rl) {
            if (line.trim() == "")
                continue;
            line = line.trim();
            const [dir_char, amount_char] = line.split(" ");
            if (DirectionCharSet.indexOf(dir_char) == -1) {
                throw `Error: Invalid direction ${dir_char}`;
            }
            const dir = charToDirection[dir_char.toUpperCase()];
            const amount = Number(amount_char.trim());
            this.movements.push(new Movement(dir, amount));
        }
    }
    run(n_knots) {
        let knot_coords = new Array(n_knots);
        for (let n = 0; n < n_knots; n++) {
            knot_coords[n] = new Coord(0, 0);
        }
        this.visited.add(new Coord(0, 0));
        for (const movement of this.movements.movements) {
            for (let n = 0; n < movement.amount; n++) {
                knot_coords[0].applyMovement(movement.direction);
                for (let n = 1; n < n_knots; n++) {
                    knot_coords[n].follow(knot_coords[n - 1]);
                }
                this.visited.add(knot_coords[n_knots - 1].clone);
            }
        }
    }
    get nVisited() {
        return this.visited.size;
    }
}
//# sourceMappingURL=rope.js.map