import * as fs from 'fs';
import * as readline from 'readline';
import { exit } from 'process';
export class File {
    name;
    size;
    constructor(name, size) {
        this.set(name, size);
    }
    set(name, size) {
        this.name = name;
        this.size = size;
    }
}
export class Directory {
    name = "";
    files = [];
    dirs = [];
    parent;
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
    }
    addFile(file) {
        this.files.push(file);
    }
    addDir(dir) {
        this.dirs.push(dir);
    }
    getDirByName(name) {
        for (const dir of this.dirs) {
            if (dir.name === name)
                return dir;
        }
        return undefined;
    }
    exclusiveSize() {
        let size = 0;
        for (const file of this.files) {
            size += file.size;
        }
        return size;
    }
    totalSize() {
        let size = this.exclusiveSize();
        for (const dir of this.dirs) {
            size += dir.totalSize();
        }
        return size;
    }
    stringify(level) {
        if (level === undefined)
            level = 0;
        let space = " ".repeat(2 * level);
        let str = space + `[dir] ${this.name} {\n`;
        for (const dir of this.dirs) {
            str += dir.stringify(level + 1) + "\n";
        }
        for (const file of this.files) {
            str += space + `  - ${file.name} (${file.size})\n`;
        }
        str += space + "}";
        return str;
    }
    *dirsRecursive() {
        for (const dir of this.dirs) {
            yield dir;
            for (const d of dir.dirsRecursive()) {
                yield d;
            }
        }
    }
    *filesRecursive() {
        for (const file of this.files) {
            yield file;
        }
        for (const dir of this.dirs) {
            for (const file of dir.filesRecursive()) {
                yield file;
            }
        }
    }
    *all() {
        for (const file of this.files) {
            yield file;
        }
        for (const dir of this.dirs) {
            yield dir;
        }
    }
    *allRecurisve() {
        for (const file of this.files) {
            yield file;
        }
        for (const dir of this.dirs) {
            yield dir;
            for (const filedir of dir.allRecurisve()) {
                yield filedir;
            }
        }
    }
}
class FileSystem {
    root;
    space_total;
    constructor(root, space_total) {
        this.reset(root, space_total);
    }
    reset(root, space_total) {
        this.setRoot(root);
        this.setTotalSpace(space_total);
    }
    setRoot(root) {
        this.root = root;
    }
    setTotalSpace(space_total) {
        this.space_total = space_total;
    }
    get usedSpace() {
        return this.root.totalSize();
    }
    get leftSpace() {
        return this.space_total - this.usedSpace;
    }
    stringify(level) {
        return this.root.stringify();
    }
    *dirs() {
        yield this.root;
        for (const dir of this.root.dirsRecursive()) {
            yield dir;
        }
    }
    *files() {
        for (const file of this.root.filesRecursive()) {
            yield file;
        }
    }
    *all() {
        yield this.root;
        for (const filedir of this.root.allRecurisve()) {
            yield filedir;
        }
    }
}
export function splitFirstWord(cmd) {
    cmd = cmd.trim();
    const pos = cmd.indexOf(" ");
    if (pos === -1) {
        return [cmd.trim(), ""];
    }
    else {
        return [
            cmd.substring(0, pos).trim(),
            cmd.substring(pos + 1).trim()
        ];
    }
}
export async function getFileSystem(filepath, space_total) {
    console.log(`Getting filesystem from: ${filepath}`);
    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });
    let root = new Directory("/");
    let current_command;
    let current_dir;
    let n_line = 0;
    for await (let line of rl) {
        line = line.trim();
        n_line++;
        if (line[0] === "$") {
            const cmd = line.substring(1).trim();
            var arg;
            [current_command, arg] = splitFirstWord(cmd);
            if (current_command === "cd") {
                if (arg === "/")
                    current_dir = root;
                else {
                    if (current_dir === undefined) {
                        console.error(`Cannot change to relative dir before knowing current one`);
                        console.error(`Line ${n_line}: ${line}`);
                        exit();
                    }
                    if (arg === "..")
                        current_dir = current_dir.parent;
                    else {
                        const new_dir = current_dir.getDirByName(arg);
                        if (new_dir === undefined) {
                            console.error(`Attempted to change to not existing directory`);
                            console.error(`Line ${n_line}: ${line}`);
                            exit();
                        }
                        current_dir = new_dir;
                    }
                }
            }
        }
        else if (current_command === "ls") {
            var str1, str2;
            [str1, str2] = splitFirstWord(line);
            if (str1 === "dir") {
                current_dir.addDir(new Directory(str2, current_dir));
            }
            else {
                current_dir.addFile(new File(str2, Number(str1)));
            }
        }
        else {
            console.error(`Unsupported command: ${current_command}`);
            console.error(`Line ${n_line}: ${line}`);
            exit();
        }
    }
    return new FileSystem(root, space_total);
}
//# sourceMappingURL=filesystem.js.map