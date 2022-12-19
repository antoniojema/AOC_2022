import { timeStamp } from 'console';
import * as fs from 'fs';
import * as readline from 'readline';

type Index = {x : number, y : number};

const N_rock_shapes = 5;

const rocks = {
    0: ["####"],
    1: [".#.","###",".#."],
    2: ["..#","..#","###"],
    3: ["#","#","#","#"],
    4: ["##","##"],
} as const;

type RockType = keyof typeof rocks;
type Rock = typeof rocks[RockType];

function *iterateRock(rock : Rock) : Iterable<Index> {
    let rock_width  = getRockWidth (rock);
    let rock_height = getRockHeight(rock);

    for (let rock_y = 0; rock_y < rock_height; rock_y++) {
    for (let rock_x = 0; rock_x < rock_width ; rock_x++) {
        if (rock[rock_height - 1 - rock_y][rock_x] === "#") {
            yield {x : rock_x, y : rock_y};
        }
    }}
}

function getRockHeight(rock : Rock) {return rock.length;}
function getRockWidth (rock : Rock) {return rock[0].length;}

function isRock(value : number) : value is RockType {
    if (value < 0 || value >= N_rock_shapes)
        return false;
    return true;
}

function assertRock(value : number) : value is RockType {
    if (value < 0 || value >= N_rock_shapes)
        throw `Error: ${value} is not a valid rock index.`
    return true;
}

const Jet = {
    L : "left",
    R : "right"
} as const;

type JetType = typeof Jet[keyof typeof Jet];

const Emptyness = {
    empty : false,
    full  : true
} as const;

type EmptynessType = typeof Emptyness[keyof typeof Emptyness];

export class Chamber {
    private chamber : EmptynessType[][];
    private width  : number;
    private height : number;
    private current_height : number;
    private current_jet : number;
    private jets : JetType[];
    private removed_height : number;
    private n_compressions : number;
    private empty_row : EmptynessType[];

    constructor(jets : JetType[], width : number = 7) {
        this.reset(jets, width);
    }

    reset(jets? : JetType[], width : number = 7) {
        if (jets !== undefined) this.jets = jets;

        this.width = width;
        this.height = 1024*1024;

        this.current_height = 0;
        this.current_jet = 0;

        this.removed_height = 0;
        this.n_compressions = 0;
        this.empty_row = new Array<EmptynessType>(this.width).fill(Emptyness.empty);

        this.chamber = new Array<EmptynessType[]>(this.height);
        for (let n = 0; n < this.height; n++) {
            this.chamber[n] = new Array<EmptynessType>(width);
            this.chamber[n].fill(Emptyness.empty);
        }
    }

    get rocksHeight() {return this.current_height + this.removed_height;}

    stringify() {
        let str = "";
        for (let y = this.current_height-1; y >= 0; y--) {
            let arr = this.chamber[y];
            str += (
                "|" +
                arr.map((elem) => {
                    return (elem === Emptyness.full) ? "#" : "."
                }).join("") +
                "|\n"
            );
        }
        str += "|" + "#".repeat(this.width) + "|";
        return str;
    }

    private *iterateRockInChamber(rock : Rock, rock_pos : Index) : Iterable<Index> {
        for (let rock_pixel of iterateRock(rock)) {
            yield {
                x : rock_pixel.x + rock_pos.x,
                y : rock_pixel.y + rock_pos.y
            }
        }
    }

    private rockOverlaps(rock : Rock, rock_pos : Index) : boolean {
        if (
            rock_pos.y < 0 || rock_pos.x < 0 ||
            rock_pos.x + getRockWidth(rock) - 1 >= this.width
        ) {
            return true;
        }

        for (let chamber_pixel of this.iterateRockInChamber(rock, rock_pos)) {
            let pixel = this.chamber[chamber_pixel.y][chamber_pixel.x];
            if (pixel === Emptyness.full) {
                return true;
            }
        }
        return false;
    }

    private fixRock(rock : Rock, rock_pos : Index) {
        for (let chamber_pixel of this.iterateRockInChamber(rock, rock_pos)) {
            this.chamber[chamber_pixel.y][chamber_pixel.x] = Emptyness.full;
        }
    }

    private letOneRockFall(rock : Rock) {
        let rock_pos : Index = {
            x : 2,
            y : this.current_height + 3
        };

        while(true) {
            // Move by jet
            let jet = this.jets[this.current_jet++];
            if (this.current_jet === this.jets.length) this.current_jet = 0;

            let move_x = (jet === Jet.L) ? -1 : +1;

            rock_pos.x += move_x;
            if (this.rockOverlaps(rock, rock_pos)) rock_pos.x -= move_x;

            // Fall down
            rock_pos.y--;
            if (this.rockOverlaps(rock, rock_pos)) {
                rock_pos.y++;
                break;
            }
        }

        this.fixRock(rock, rock_pos);

        let rock_height = rock_pos.y + getRockHeight(rock);
        this.current_height = Math.max(this.current_height, rock_height);
    }

    private remove(n_rows : number) {
        this.removed_height += n_rows;
        this.current_height -= n_rows;
        this.n_compressions++;

        let new_chamber = this.chamber.slice(n_rows);
        new_chamber = new_chamber.concat(new Array<EmptynessType[]>(n_rows).fill(this.empty_row));
        this.chamber = new_chamber;
    }

    private checkHeight() {
        let remove : number;
        if (this.current_height >= this.height - 10) {
            for (let y = this.current_height-1; y >= 0; y--) {
                let row = this.chamber[y];
                let full = row.reduce((acc, curr) => {return acc && (curr === Emptyness.full)}, true);
                if (full) {
                    remove = y+1;
                    break;
                }
            }
            if (remove === undefined) remove = this.height - 1000;

            this.remove(remove);

            if (this.n_compressions % 10 === 0) {
                console.log(`Chamber compressed ${this.n_compressions} times`);
                console.log(`Current height: ${this.rocksHeight}.`);
            }
        }
    }

    letRocksFall(n_rocks : number = 2022) {
        let rock_index = 0;
        for (let n_rock = 0; n_rock < n_rocks; n_rock++) {
            if (!isRock(rock_index)) {
                throw `Error: ${rock_index} is not a valid rock index`;
            }

            this.letOneRockFall(rocks[rock_index]);

            this.checkHeight();

            rock_index++;
            if (rock_index === 5) rock_index = 0;
        }
    }
}


export async function getAirJets(filepath : string) : Promise<JetType[]> {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    let jets : JetType[] = [];

    for await(let line of rl) {
        line = line.trim();
        if (line === "") continue;

        for (let n = 0; n < line.length; n++) {
            let char = line.charAt(n);
            switch (char) {
                case ("<"): jets.push(Jet.L); break;
                case (">"): jets.push(Jet.R); break;
                default : throw `Error: Invalid character in input jet: ${char}`;
            }
        }
    }

    return jets;
}