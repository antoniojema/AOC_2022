import { equal } from 'assert';
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

function equal_Emptiness(a : EmptynessType, b : EmptynessType) { return a === b; }
function equal_EmptinessArray(a : EmptynessType[], b : EmptynessType[]) {
    if (a === undefined || b === undefined) return false;
    if (a.length != b.length) return false;
    
    for (let n = 0; n < a.length; n++) {
        if (a[n] !== b[n]) {
            return false;
        }
    }
    return true;
}

export class Chamber {
    private chamber : EmptynessType[][];
    private width  : number;
    private height : number;
    private current_height : number;
    private current_jet : number;
    private jets : JetType[];

    private saved_states : {height : number, n_jet : number, n_rocks : number}[];

    constructor(jets : JetType[], width : number = 7) {
        this.reset(jets, width);
    }

    reset(jets? : JetType[], width : number = 7) {
        if (jets !== undefined) this.jets = jets;

        this.width = width;
        this.height = 1024*1024;

        this.current_height = 0;
        this.current_jet = 0;

        this.saved_states = [];

        this.chamber = new Array<EmptynessType[]>(this.height);
        for (let n = 0; n < this.height; n++) {
            this.chamber[n] = new Array<EmptynessType>(width);
            this.chamber[n].fill(Emptyness.empty);
        }
    }

    get rocksHeight() {return this.current_height;}

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

    private *iteratePreviousMatchingRows() : Iterable<number> {
        let current_row = this.chamber[this.current_height-1];
        for (let n_state = this.saved_states.length-1; n_state >= 0; n_state--) {
            let state = this.saved_states[n_state];
            if (state.n_jet === this.current_jet) {
                let n_prev_row = state.height - 1;
                let previous_row = this.chamber[n_prev_row];
                
                if (equal_EmptinessArray(current_row, previous_row)) {
                    yield n_state;
                }
            }
        }
    }

    private chunksEqual(n_upper : number, n_lower : number) : boolean {
        let distance = n_upper - n_lower;
        if (distance < 0) return false;
        if (n_lower < distance) return false;
        
        for (let n = 1; n <= distance; n++) {
            let n_u = n_upper - n;
            let n_l = n_lower - n;
            let row_upper = this.chamber[n_u];
            let row_lower = this.chamber[n_l];
            if (!equal_EmptinessArray(row_upper, row_lower)) {
                return false;
            }
        }
        return true;
    }

    private findPeriodicity(current_n_rocks : number, total_n_rocks : number) : {final_height : number, remaining_rocks : number} {
        if (this.current_height <= 0) return;

        let n_curr_row = this.current_height-1;
        for (let n_state of this.iteratePreviousMatchingRows()) {
            let state = this.saved_states[n_state];
            let n_prev_row = state.height-1;
            if (this.chunksEqual(n_curr_row, n_prev_row)) {
                let previous_n_rocks = state.n_rocks;

                let n_rocks_diff = current_n_rocks - previous_n_rocks;
                let height_diff = n_curr_row - n_prev_row;

                let remaining_rocks = total_n_rocks - current_n_rocks;
                let remaining_chuncks = Math.floor(remaining_rocks / n_rocks_diff);
                let remaining_rocks_in_chunk = remaining_rocks % n_rocks_diff;

                let final_height = this.current_height + height_diff * remaining_chuncks;
                return {
                    final_height : final_height,
                    remaining_rocks : remaining_rocks_in_chunk
                }
            }
        }
        this.saved_states.push({height : this.current_height, n_jet : this.current_jet, n_rocks : current_n_rocks});
        
        return undefined;
    }

    letRocksFall(n_rocks : number = 2022) : number {
        let sending_remaining_rocks : boolean = false;
        let final_height : number;
        let saved_height : number;
        let remaining_rocks : number;
        let n_remaining_rock : number;

        let rock_index = 0;
        let rock_check = n_rocks % N_rock_shapes;
        for (let n_rock = 0; n_rock < n_rocks; n_rock++) {
            if (!isRock(rock_index)) {
                throw `Error: ${rock_index} is not a valid rock index`;
            }

            this.letOneRockFall(rocks[rock_index]);

            rock_index++;
            if (rock_index === 5) rock_index = 0;

            if (!sending_remaining_rocks) {
                if (rock_index === rock_check) {
                    let result = this.findPeriodicity(n_rock+1, n_rocks)
                    if (result !== undefined) {
                        final_height = result.final_height;
                        saved_height = this.current_height;
                        remaining_rocks = result.remaining_rocks;
                        n_remaining_rock = 0;
                        if (remaining_rocks === 0) return final_height;
                        else {
                            sending_remaining_rocks = true
                        }
                    }
                }
            }
            else {
                n_remaining_rock++;
                if (n_remaining_rock === remaining_rocks) {
                    return final_height + (this.current_height - saved_height);
                }
            }
        }
        return this.current_height;
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