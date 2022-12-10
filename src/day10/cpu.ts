import * as fs from 'fs';
import * as readline from 'readline';

export namespace Command {

export abstract class Command {
    str : string

    constructor(str : string) {
        this.str = str;
    }
}

export class Addx extends Command {
    value : number; 

    constructor(value : number) {
        super("addx");
        this.set(value);
    }

    set(value : number) {
        this.value = value;
    }
}

export class Noop extends Command {
    str: string = "noop";

    constructor() {
        super("noop");
    }
}

} // namespace Command

export class CommandList {
    commands : Command.Command[] = []

    async reset(filepath? : string) {
        if (filepath === undefined) {
            this.commands = new Array<Command.Command>(0);
            return;
        }
        console.log(`Reading commands from file: ${filepath}`)
    
        const rl = readline.createInterface({
            input: fs.createReadStream(filepath)
        });

        for await (let line of rl) {
            line = line.trim();
            if (line == "") continue;

            let cmd : string, value : number;

            if (line.indexOf(" ") == -1) {
                cmd = line;
            }
            else {
                let value_str
                [cmd, value_str] = line.split(" ");
                value = Number(value_str);
            }

            if (cmd == "addx") {
                this.push(new Command.Addx(value));
            }
            else if (cmd == "noop") {
                this.push(new Command.Noop);
            }
            else {
                throw `Error: Attempted to push unknown command: ${cmd}`;
            }
        }
    }

    push (command : Command.Command) {
        this.commands.push(command);
    }
}

export class Screen {
    screen : string[][];
    hsize : number;
    pos_x : number;
    pos_y : number;

    constructor(hsize? : number) {
        this.reset(hsize);
    }

    push() {
        this.screen.push(new Array<string>(this.hsize));
        for (let x = 0; x < this.hsize; x++) {
            this.screen[this.screen.length-1][x] = ".";
        }
    }

    reset(hsize? : number) {
        if (hsize === undefined) hsize = 40;

        this.hsize = hsize;
        this.pos_x = 0;
        this.pos_y = 0;
        this.screen = [new Array<string>(hsize)];
    }

    advance(char : string) {
        this.screen[this.pos_y][this.pos_x] = char.charAt(0);
        this.pos_x++;
        if (this.pos_x == this.hsize) {
            this.pos_y++;
            this.pos_x = 0;
            this.screen.push(new Array<string>(this.hsize));
        }
    }

    get drawing() : string {
        let drawing = "";

        for (let y = 0; y < this.screen.length; y++) {
            for (let x = 0; x < this.hsize; x++) {
                drawing += this.screen[y][x];
            }
            if (y < this.screen.length-1) drawing += "\n";
        }

        return drawing;
    }
}

export class CPU {
    X : number = 1;
    n_cmd : number = 0;
    signal_strength : number = 0;
    screen : Screen;

    constructor(X? : number, screen_hsize? : number) {
        this.reset(X, screen_hsize);
    }

    reset(X? : number, screen_hsize? : number) {
        // CPU
        this.n_cmd = 0;
        this.signal_strength = 0;
        if (X === undefined) this.X = 1;
        else this.X = X;
        
        // Screen
        this.screen = new Screen(screen_hsize);
    }

    increment() {
        if (this.X - 1 <= this.screen.pos_x && this.screen.pos_x <= this.X + 1) {
            this.screen.advance("#");
        }
        else {
            this.screen.advance(".");
        }

        this.n_cmd++;
        if ((this.n_cmd - 20) % 40 == 0) {
            this.signal_strength += this.n_cmd * this.X;
        }
    }

    apply(commands : CommandList) {
        for (const command of commands.commands) {
            if (command.str == "addx") {
                this.increment();
                this.increment();
                this.X += (command as Command.Addx).value
            }
            else if (command.str == "noop") {
                this.increment();
            }
            else {
                throw `Error: Attempted to apply unknown command to CPU: ${command.str}`;
            }
        }
    }
}