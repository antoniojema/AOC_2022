import * as fs from 'fs';
import * as readline from 'readline';
export var Command;
(function (Command_1) {
    class Command {
        str;
        constructor(str) {
            this.str = str;
        }
    }
    Command_1.Command = Command;
    class Addx extends Command {
        value;
        constructor(value) {
            super("addx");
            this.set(value);
        }
        set(value) {
            this.value = value;
        }
    }
    Command_1.Addx = Addx;
    class Noop extends Command {
        str = "noop";
        constructor() {
            super("noop");
        }
    }
    Command_1.Noop = Noop;
})(Command || (Command = {}));
export class CommandList {
    commands = [];
    async reset(filepath) {
        if (filepath === undefined) {
            this.commands = new Array(0);
            return;
        }
        console.log(`Reading commands from file: ${filepath}`);
        const rl = readline.createInterface({
            input: fs.createReadStream(filepath)
        });
        for await (let line of rl) {
            line = line.trim();
            if (line == "")
                continue;
            let cmd, value;
            if (line.indexOf(" ") == -1) {
                cmd = line;
            }
            else {
                let value_str;
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
    push(command) {
        this.commands.push(command);
    }
}
export class Screen {
    screen;
    hsize;
    pos_x;
    pos_y;
    constructor(hsize) {
        this.reset(hsize);
    }
    push() {
        this.screen.push(new Array(this.hsize));
        for (let x = 0; x < this.hsize; x++) {
            this.screen[this.screen.length - 1][x] = ".";
        }
    }
    reset(hsize) {
        if (hsize === undefined)
            hsize = 40;
        this.hsize = hsize;
        this.pos_x = 0;
        this.pos_y = 0;
        this.screen = [new Array(hsize)];
    }
    advance(char) {
        this.screen[this.pos_y][this.pos_x] = char.charAt(0);
        this.pos_x++;
        if (this.pos_x == this.hsize) {
            this.pos_y++;
            this.pos_x = 0;
            this.screen.push(new Array(this.hsize));
        }
    }
    get drawing() {
        let drawing = "";
        for (let y = 0; y < this.screen.length; y++) {
            for (let x = 0; x < this.hsize; x++) {
                drawing += this.screen[y][x];
            }
            if (y < this.screen.length - 1)
                drawing += "\n";
        }
        return drawing;
    }
}
export class CPU {
    X = 1;
    n_cmd = 0;
    signal_strength = 0;
    screen;
    constructor(X, screen_hsize) {
        this.reset(X, screen_hsize);
    }
    reset(X, screen_hsize) {
        this.n_cmd = 0;
        this.signal_strength = 0;
        if (X === undefined)
            this.X = 1;
        else
            this.X = X;
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
    apply(commands) {
        for (const command of commands.commands) {
            if (command.str == "addx") {
                this.increment();
                this.increment();
                this.X += command.value;
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
//# sourceMappingURL=cpu.js.map