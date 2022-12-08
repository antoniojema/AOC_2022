"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileSystem = exports.splitFirstWord = exports.Directory = exports.File = void 0;
var fs = require("fs");
var readline = require("readline");
var process_1 = require("process");
var File = (function () {
    function File(name, size) {
        this.set(name, size);
    }
    File.prototype.set = function (name, size) {
        this.name = name;
        this.size = size;
    };
    return File;
}());
exports.File = File;
var Directory = (function () {
    function Directory(name, parent) {
        this.name = "";
        this.files = [];
        this.dirs = [];
        this.name = name;
        this.parent = parent;
    }
    Directory.prototype.addFile = function (file) {
        this.files.push(file);
    };
    Directory.prototype.addDir = function (dir) {
        this.dirs.push(dir);
    };
    Directory.prototype.getDirByName = function (name) {
        var e_1, _a;
        try {
            for (var _b = __values(this.dirs), _c = _b.next(); !_c.done; _c = _b.next()) {
                var dir = _c.value;
                if (dir.name === name)
                    return dir;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return undefined;
    };
    Directory.prototype.exclusiveSize = function () {
        var e_2, _a;
        var size = 0;
        try {
            for (var _b = __values(this.files), _c = _b.next(); !_c.done; _c = _b.next()) {
                var file = _c.value;
                size += file.size;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return size;
    };
    Directory.prototype.totalSize = function () {
        var e_3, _a;
        var size = this.exclusiveSize();
        try {
            for (var _b = __values(this.dirs), _c = _b.next(); !_c.done; _c = _b.next()) {
                var dir = _c.value;
                size += dir.totalSize();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return size;
    };
    Directory.prototype.stringify = function (level) {
        var e_4, _a, e_5, _b;
        if (level === undefined)
            level = 0;
        var space = " ".repeat(2 * level);
        var str = space + "[dir] ".concat(this.name, " {\n");
        try {
            for (var _c = __values(this.dirs), _d = _c.next(); !_d.done; _d = _c.next()) {
                var dir = _d.value;
                str += dir.stringify(level + 1) + "\n";
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        try {
            for (var _e = __values(this.files), _f = _e.next(); !_f.done; _f = _e.next()) {
                var file = _f.value;
                str += space + "  - ".concat(file.name, " (").concat(file.size, ")\n");
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_5) throw e_5.error; }
        }
        str += space + "}";
        return str;
    };
    Directory.prototype.dirsRecursive = function () {
        var _a, _b, dir, _c, _d, d, e_6_1, e_7_1;
        var e_7, _e, e_6, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 12, 13, 14]);
                    _a = __values(this.dirs), _b = _a.next();
                    _g.label = 1;
                case 1:
                    if (!!_b.done) return [3, 11];
                    dir = _b.value;
                    return [4, dir];
                case 2:
                    _g.sent();
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 8, 9, 10]);
                    _c = (e_6 = void 0, __values(dir.dirsRecursive())), _d = _c.next();
                    _g.label = 4;
                case 4:
                    if (!!_d.done) return [3, 7];
                    d = _d.value;
                    return [4, d];
                case 5:
                    _g.sent();
                    _g.label = 6;
                case 6:
                    _d = _c.next();
                    return [3, 4];
                case 7: return [3, 10];
                case 8:
                    e_6_1 = _g.sent();
                    e_6 = { error: e_6_1 };
                    return [3, 10];
                case 9:
                    try {
                        if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                    }
                    finally { if (e_6) throw e_6.error; }
                    return [7];
                case 10:
                    _b = _a.next();
                    return [3, 1];
                case 11: return [3, 14];
                case 12:
                    e_7_1 = _g.sent();
                    e_7 = { error: e_7_1 };
                    return [3, 14];
                case 13:
                    try {
                        if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                    }
                    finally { if (e_7) throw e_7.error; }
                    return [7];
                case 14: return [2];
            }
        });
    };
    Directory.prototype.filesRecursive = function () {
        var _a, _b, file, e_8_1, _c, _d, dir, _e, _f, file, e_9_1, e_10_1;
        var e_8, _g, e_10, _h, e_9, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    _k.trys.push([0, 5, 6, 7]);
                    _a = __values(this.files), _b = _a.next();
                    _k.label = 1;
                case 1:
                    if (!!_b.done) return [3, 4];
                    file = _b.value;
                    return [4, file];
                case 2:
                    _k.sent();
                    _k.label = 3;
                case 3:
                    _b = _a.next();
                    return [3, 1];
                case 4: return [3, 7];
                case 5:
                    e_8_1 = _k.sent();
                    e_8 = { error: e_8_1 };
                    return [3, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_g = _a.return)) _g.call(_a);
                    }
                    finally { if (e_8) throw e_8.error; }
                    return [7];
                case 7:
                    _k.trys.push([7, 18, 19, 20]);
                    _c = __values(this.dirs), _d = _c.next();
                    _k.label = 8;
                case 8:
                    if (!!_d.done) return [3, 17];
                    dir = _d.value;
                    _k.label = 9;
                case 9:
                    _k.trys.push([9, 14, 15, 16]);
                    _e = (e_9 = void 0, __values(dir.filesRecursive())), _f = _e.next();
                    _k.label = 10;
                case 10:
                    if (!!_f.done) return [3, 13];
                    file = _f.value;
                    return [4, file];
                case 11:
                    _k.sent();
                    _k.label = 12;
                case 12:
                    _f = _e.next();
                    return [3, 10];
                case 13: return [3, 16];
                case 14:
                    e_9_1 = _k.sent();
                    e_9 = { error: e_9_1 };
                    return [3, 16];
                case 15:
                    try {
                        if (_f && !_f.done && (_j = _e.return)) _j.call(_e);
                    }
                    finally { if (e_9) throw e_9.error; }
                    return [7];
                case 16:
                    _d = _c.next();
                    return [3, 8];
                case 17: return [3, 20];
                case 18:
                    e_10_1 = _k.sent();
                    e_10 = { error: e_10_1 };
                    return [3, 20];
                case 19:
                    try {
                        if (_d && !_d.done && (_h = _c.return)) _h.call(_c);
                    }
                    finally { if (e_10) throw e_10.error; }
                    return [7];
                case 20: return [2];
            }
        });
    };
    Directory.prototype.all = function () {
        var _a, _b, file, e_11_1, _c, _d, dir, e_12_1;
        var e_11, _e, e_12, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 5, 6, 7]);
                    _a = __values(this.files), _b = _a.next();
                    _g.label = 1;
                case 1:
                    if (!!_b.done) return [3, 4];
                    file = _b.value;
                    return [4, file];
                case 2:
                    _g.sent();
                    _g.label = 3;
                case 3:
                    _b = _a.next();
                    return [3, 1];
                case 4: return [3, 7];
                case 5:
                    e_11_1 = _g.sent();
                    e_11 = { error: e_11_1 };
                    return [3, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                    }
                    finally { if (e_11) throw e_11.error; }
                    return [7];
                case 7:
                    _g.trys.push([7, 12, 13, 14]);
                    _c = __values(this.dirs), _d = _c.next();
                    _g.label = 8;
                case 8:
                    if (!!_d.done) return [3, 11];
                    dir = _d.value;
                    return [4, dir];
                case 9:
                    _g.sent();
                    _g.label = 10;
                case 10:
                    _d = _c.next();
                    return [3, 8];
                case 11: return [3, 14];
                case 12:
                    e_12_1 = _g.sent();
                    e_12 = { error: e_12_1 };
                    return [3, 14];
                case 13:
                    try {
                        if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                    }
                    finally { if (e_12) throw e_12.error; }
                    return [7];
                case 14: return [2];
            }
        });
    };
    Directory.prototype.allRecurisve = function () {
        var _a, _b, file, e_13_1, _c, _d, dir, _e, _f, filedir, e_14_1, e_15_1;
        var e_13, _g, e_15, _h, e_14, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    _k.trys.push([0, 5, 6, 7]);
                    _a = __values(this.files), _b = _a.next();
                    _k.label = 1;
                case 1:
                    if (!!_b.done) return [3, 4];
                    file = _b.value;
                    return [4, file];
                case 2:
                    _k.sent();
                    _k.label = 3;
                case 3:
                    _b = _a.next();
                    return [3, 1];
                case 4: return [3, 7];
                case 5:
                    e_13_1 = _k.sent();
                    e_13 = { error: e_13_1 };
                    return [3, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_g = _a.return)) _g.call(_a);
                    }
                    finally { if (e_13) throw e_13.error; }
                    return [7];
                case 7:
                    _k.trys.push([7, 19, 20, 21]);
                    _c = __values(this.dirs), _d = _c.next();
                    _k.label = 8;
                case 8:
                    if (!!_d.done) return [3, 18];
                    dir = _d.value;
                    return [4, dir];
                case 9:
                    _k.sent();
                    _k.label = 10;
                case 10:
                    _k.trys.push([10, 15, 16, 17]);
                    _e = (e_14 = void 0, __values(dir.allRecurisve())), _f = _e.next();
                    _k.label = 11;
                case 11:
                    if (!!_f.done) return [3, 14];
                    filedir = _f.value;
                    return [4, filedir];
                case 12:
                    _k.sent();
                    _k.label = 13;
                case 13:
                    _f = _e.next();
                    return [3, 11];
                case 14: return [3, 17];
                case 15:
                    e_14_1 = _k.sent();
                    e_14 = { error: e_14_1 };
                    return [3, 17];
                case 16:
                    try {
                        if (_f && !_f.done && (_j = _e.return)) _j.call(_e);
                    }
                    finally { if (e_14) throw e_14.error; }
                    return [7];
                case 17:
                    _d = _c.next();
                    return [3, 8];
                case 18: return [3, 21];
                case 19:
                    e_15_1 = _k.sent();
                    e_15 = { error: e_15_1 };
                    return [3, 21];
                case 20:
                    try {
                        if (_d && !_d.done && (_h = _c.return)) _h.call(_c);
                    }
                    finally { if (e_15) throw e_15.error; }
                    return [7];
                case 21: return [2];
            }
        });
    };
    return Directory;
}());
exports.Directory = Directory;
var FileSystem = (function () {
    function FileSystem(root, space_total) {
        this.reset(root, space_total);
    }
    FileSystem.prototype.reset = function (root, space_total) {
        this.setRoot(root);
        this.setTotalSpace(space_total);
    };
    FileSystem.prototype.setRoot = function (root) {
        this.root = root;
    };
    FileSystem.prototype.setTotalSpace = function (space_total) {
        this.space_total = space_total;
    };
    Object.defineProperty(FileSystem.prototype, "usedSpace", {
        get: function () {
            return this.root.totalSize();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileSystem.prototype, "leftSpace", {
        get: function () {
            return this.space_total - this.usedSpace;
        },
        enumerable: false,
        configurable: true
    });
    FileSystem.prototype.stringify = function (level) {
        return this.root.stringify();
    };
    FileSystem.prototype.dirs = function () {
        var _a, _b, dir, e_16_1;
        var e_16, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4, this.root];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 7, 8, 9]);
                    _a = __values(this.root.dirsRecursive()), _b = _a.next();
                    _d.label = 3;
                case 3:
                    if (!!_b.done) return [3, 6];
                    dir = _b.value;
                    return [4, dir];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5:
                    _b = _a.next();
                    return [3, 3];
                case 6: return [3, 9];
                case 7:
                    e_16_1 = _d.sent();
                    e_16 = { error: e_16_1 };
                    return [3, 9];
                case 8:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_16) throw e_16.error; }
                    return [7];
                case 9: return [2];
            }
        });
    };
    FileSystem.prototype.files = function () {
        var _a, _b, file, e_17_1;
        var e_17, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = __values(this.root.filesRecursive()), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3, 4];
                    file = _b.value;
                    return [4, file];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _b = _a.next();
                    return [3, 1];
                case 4: return [3, 7];
                case 5:
                    e_17_1 = _d.sent();
                    e_17 = { error: e_17_1 };
                    return [3, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_17) throw e_17.error; }
                    return [7];
                case 7: return [2];
            }
        });
    };
    FileSystem.prototype.all = function () {
        var _a, _b, filedir, e_18_1;
        var e_18, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4, this.root];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 7, 8, 9]);
                    _a = __values(this.root.allRecurisve()), _b = _a.next();
                    _d.label = 3;
                case 3:
                    if (!!_b.done) return [3, 6];
                    filedir = _b.value;
                    return [4, filedir];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5:
                    _b = _a.next();
                    return [3, 3];
                case 6: return [3, 9];
                case 7:
                    e_18_1 = _d.sent();
                    e_18 = { error: e_18_1 };
                    return [3, 9];
                case 8:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_18) throw e_18.error; }
                    return [7];
                case 9: return [2];
            }
        });
    };
    return FileSystem;
}());
function splitFirstWord(cmd) {
    cmd = cmd.trim();
    var pos = cmd.indexOf(" ");
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
exports.splitFirstWord = splitFirstWord;
function getFileSystem(filepath, space_total) {
    var e_19, _a;
    return __awaiter(this, void 0, void 0, function () {
        var rl, root, current_command, current_dir, n_line, rl_1, rl_1_1, line, cmd, arg, new_dir, str1, str2, e_19_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("Getting filesystem from: ".concat(filepath));
                    rl = readline.createInterface({
                        input: fs.createReadStream(filepath)
                    });
                    root = new Directory("/");
                    n_line = 0;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, 7, 12]);
                    rl_1 = __asyncValues(rl);
                    _d.label = 2;
                case 2: return [4, rl_1.next()];
                case 3:
                    if (!(rl_1_1 = _d.sent(), !rl_1_1.done)) return [3, 5];
                    line = rl_1_1.value;
                    line = line.trim();
                    n_line++;
                    if (line[0] === "$") {
                        cmd = line.substring(1).trim();
                        _b = __read(splitFirstWord(cmd), 2), current_command = _b[0], arg = _b[1];
                        if (current_command === "cd") {
                            if (arg === "/")
                                current_dir = root;
                            else {
                                if (current_dir === undefined) {
                                    console.error("Cannot change to relative dir before knowing current one");
                                    console.error("Line ".concat(n_line, ": ").concat(line));
                                    (0, process_1.exit)();
                                }
                                if (arg === "..")
                                    current_dir = current_dir.parent;
                                else {
                                    new_dir = current_dir.getDirByName(arg);
                                    if (new_dir === undefined) {
                                        console.error("Attempted to change to not existing directory");
                                        console.error("Line ".concat(n_line, ": ").concat(line));
                                        (0, process_1.exit)();
                                    }
                                    current_dir = new_dir;
                                }
                            }
                        }
                    }
                    else if (current_command === "ls") {
                        _c = __read(splitFirstWord(line), 2), str1 = _c[0], str2 = _c[1];
                        if (str1 === "dir") {
                            current_dir.addDir(new Directory(str2, current_dir));
                        }
                        else {
                            current_dir.addFile(new File(str2, Number(str1)));
                        }
                    }
                    else {
                        console.error("Unsupported command: ".concat(current_command));
                        console.error("Line ".concat(n_line, ": ").concat(line));
                        (0, process_1.exit)();
                    }
                    _d.label = 4;
                case 4: return [3, 2];
                case 5: return [3, 12];
                case 6:
                    e_19_1 = _d.sent();
                    e_19 = { error: e_19_1 };
                    return [3, 12];
                case 7:
                    _d.trys.push([7, , 10, 11]);
                    if (!(rl_1_1 && !rl_1_1.done && (_a = rl_1.return))) return [3, 9];
                    return [4, _a.call(rl_1)];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9: return [3, 11];
                case 10:
                    if (e_19) throw e_19.error;
                    return [7];
                case 11: return [7];
                case 12: return [2, new FileSystem(root, space_total)];
            }
        });
    });
}
exports.getFileSystem = getFileSystem;
//# sourceMappingURL=filesystem.js.map