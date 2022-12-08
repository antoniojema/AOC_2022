import * as fs from 'fs';
import * as readline from 'readline';
import { exit } from 'process';

export class File {
    name : string;
    size : number;

    constructor(name : string, size : number) {
        this.set(name, size);
    }

    set(name : string, size : number) {
        this.name = name;
        this.size = size;
    }
}

export class Directory {
    name : string = "";
    files : File[] = [];
    dirs : Directory[] = [];
    parent : Directory;

    constructor(name : string, parent? : Directory) {
        this.name = name;
        this.parent = parent;
    }

    addFile(file : File) {
        this.files.push(file);
    }

    addDir(dir : Directory) {
        this.dirs.push(dir);
    }

    getDirByName(name : string) : Directory {
        for (const dir of this.dirs) {
            if (dir.name === name) return dir;
        }
        return undefined;
    }

    exclusiveSize() : number {
        let size : number = 0;
        for (const file of this.files) {
            size += file.size;
        }
        return size;
    }

    totalSize() : number {
        let size : number = this.exclusiveSize();
        for (const dir of this.dirs) {
            size += dir.totalSize();
        }
        return size;
    }

    stringify(level? : number) : string {
        if (level === undefined) level = 0;
        let space : string = " ".repeat(2*level);
        
        let str : string = space + `[dir] ${this.name} {\n`;
        for (const dir of this.dirs) {
            str += dir.stringify(level+1) + "\n";
        }
        for (const file of this.files) {
            str += space + `  - ${file.name} (${file.size})\n`;
        }
        str += space + "}";
        return str;
    }

    *dirsRecursive() : Iterable<Directory> {
        for (const dir of this.dirs) {
            yield dir;
            for (const d of dir.dirsRecursive()) {
                yield d;
            }
        }
    }

    *filesRecursive() : Iterable<File> {
        for (const file of this.files) {
            yield file;
        }
        for (const dir of this.dirs) {
            for (const file of dir.filesRecursive()) {
                yield file;
            }
        }
    }

    *all() : Iterable<File|Directory> {
        for (const file of this.files) {
            yield file;
        }
        for (const dir of this.dirs) {
            yield dir;
        }
    }

    *allRecurisve() : Iterable<File|Directory> {
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
    root : Directory;
    space_total : number;

    constructor(root : Directory, space_total : number) {
        this.reset(root, space_total);
    }

    reset(root : Directory, space_total : number) {
        this.setRoot(root);
        this.setTotalSpace(space_total);
    }

    setRoot(root : Directory) {
        this.root = root;
    }

    setTotalSpace(space_total : number) {
        this.space_total = space_total;
    }

    get usedSpace() : number {
        return this.root.totalSize();
    }

    get leftSpace() : number {
        return this.space_total - this.usedSpace;
    }

    stringify(level? : number) : string {
        return this.root.stringify();
    }

    *dirs() : Iterable<Directory> {
        yield this.root;
        for (const dir of this.root.dirsRecursive()) {
            yield dir;
        }
    }

    *files() : Iterable<File> {
        for (const file of this.root.filesRecursive()) {
            yield file;
        }
    }

    *all() : Iterable<File|Directory> {
        yield this.root;
        for (const filedir of this.root.allRecurisve()) {
            yield filedir;
        }
    }
}

export function splitFirstWord(cmd : string) : [string, string] {
    cmd = cmd.trim();
    const pos = cmd.indexOf(" ");
    if (pos === -1) {
        return [cmd.trim(), ""];
    }
    else {
        return [
            cmd.substring(0, pos).trim(),
            cmd.substring(pos+1 ).trim()
        ];
    }
}

export async function getFileSystem(filepath : string, space_total : number) : Promise<FileSystem> {
    console.log(`Getting filesystem from: ${filepath}`);

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    let root = new Directory("/");
    let current_command : string;
    let current_dir : Directory;
    let n_line = 0;
    
    for await(let line of rl) {
        line = line.trim();
        n_line++;
        if (line[0] === "$") {
            const cmd = line.substring(1).trim();

            var arg : string;
            [current_command, arg] = splitFirstWord(cmd);
            
            if (current_command === "cd") {
                if (arg === "/") current_dir = root;
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
            var str1 : string, str2 : string;
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