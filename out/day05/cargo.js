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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoves = exports.getInitialCargo = exports.getMaxStack = exports.MoveStack = exports.MoveStep = exports.Cargo = exports.CrateStack = exports.Crate = void 0;
var fs = require("fs");
var readline = require("readline");
var Crate = (function () {
    function Crate(label) {
        this.label = label;
    }
    return Crate;
}());
exports.Crate = Crate;
var CrateStack = (function () {
    function CrateStack() {
        this.crates = [];
    }
    CrateStack.prototype.moveOneByOneTo = function (dest, count) {
        var _a;
        (_a = dest.crates).push.apply(_a, __spreadArray([], __read(this.crates.splice(this.crates.length - count, count).reverse()), false));
    };
    CrateStack.prototype.moveOneByOneFrom = function (orig, count) {
        orig.moveOneByOneTo(this, count);
    };
    CrateStack.prototype.moveAllAtOnceTo = function (dest, count) {
        var _a;
        (_a = dest.crates).push.apply(_a, __spreadArray([], __read(this.crates.splice(this.crates.length - count, count)), false));
    };
    CrateStack.prototype.moveAllAtOnceFrom = function (orig, count) {
        orig.moveAllAtOnceTo(this, count);
    };
    return CrateStack;
}());
exports.CrateStack = CrateStack;
var Cargo = (function () {
    function Cargo(crates) {
        this.stacks = [];
        if (crates.length == 0)
            return;
        this.stacks.length = crates[0].length;
        for (var n_stack = 0; n_stack < this.stacks.length; n_stack++) {
            this.stacks[n_stack] = new CrateStack;
            for (var n_crate = crates.length - 1; n_crate >= 0; n_crate--) {
                var crate = crates[n_crate][n_stack];
                if (crate.label != " ") {
                    this.stacks[n_stack].crates.push(crate);
                }
                else {
                    break;
                }
            }
        }
    }
    Cargo.prototype.stringify = function () {
        var e_1, _a;
        var str = "";
        for (var n_stack = 0; n_stack < this.stacks.length; n_stack++) {
            str += "Stack ".concat(n_stack, ": ");
            var stack = this.stacks[n_stack];
            try {
                for (var _b = (e_1 = void 0, __values(stack.crates)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var crate = _c.value;
                    str += "[".concat(crate.label, "] ");
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (n_stack < this.stacks.length - 1)
                str += "\n";
        }
        return str;
    };
    Cargo.prototype.moveOneByOne = function (orig, dest, count) {
        this.stacks[orig].moveOneByOneTo(this.stacks[dest], count);
    };
    Cargo.prototype.moveAllAtOnce = function (orig, dest, count) {
        this.stacks[orig].moveAllAtOnceTo(this.stacks[dest], count);
    };
    Cargo.prototype.applyOneByOne = function (moves) {
        var e_2, _a;
        try {
            for (var _b = __values(moves.steps), _c = _b.next(); !_c.done; _c = _b.next()) {
                var step = _c.value;
                this.moveOneByOne(step.orig, step.dest, step.count);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Cargo.prototype.applyAllAtOnce = function (moves) {
        var e_3, _a;
        try {
            for (var _b = __values(moves.steps), _c = _b.next(); !_c.done; _c = _b.next()) {
                var step = _c.value;
                this.moveAllAtOnce(step.orig, step.dest, step.count);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    Cargo.prototype.topCrates = function () {
        var e_4, _a;
        var str = "";
        try {
            for (var _b = __values(this.stacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                var stack = _c.value;
                str += stack.crates[stack.crates.length - 1].label;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return str;
    };
    return Cargo;
}());
exports.Cargo = Cargo;
var MoveStep = (function () {
    function MoveStep(orig, dest, count) {
        this.orig = orig;
        this.dest = dest;
        this.count = count;
    }
    MoveStep.prototype.stringify = function () {
        return "Move ".concat(this.count, " from ").concat(this.orig, " to ").concat(this.dest);
    };
    return MoveStep;
}());
exports.MoveStep = MoveStep;
var MoveStack = (function () {
    function MoveStack() {
        this.steps = [];
    }
    MoveStack.prototype.push = function (str) {
        var pos_move = str.indexOf("move");
        var pos_from = str.indexOf("from");
        var pos_to = str.indexOf("to");
        var pos_count = pos_move + 4;
        var pos_orig = pos_from + 4;
        var pos_dest = pos_to + 2;
        var count = Number(str.substring(pos_count, pos_from));
        var orig = Number(str.substring(pos_orig, pos_to)) - 1;
        var dest = Number(str.substring(pos_dest)) - 1;
        this.steps.push(new MoveStep(orig, dest, count));
    };
    MoveStack.prototype.stringify = function () {
        var str = "";
        for (var n_step = 0; n_step < this.steps.length; n_step++) {
            var step = this.steps[n_step];
            str += "Step ".concat(n_step, ": ").concat(step.stringify());
            if (n_step < this.steps.length - 1)
                str += "\n";
        }
        return str;
    };
    return MoveStack;
}());
exports.MoveStack = MoveStack;
function getMaxStack(filepath) {
    var e_5, _a;
    return __awaiter(this, void 0, void 0, function () {
        var rl, rl_1, rl_1_1, line, n, pos, e_5_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Precounting in file: ".concat(filepath));
                    rl = readline.createInterface({
                        input: fs.createReadStream(filepath)
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    rl_1 = __asyncValues(rl);
                    _b.label = 2;
                case 2: return [4, rl_1.next()];
                case 3:
                    if (!(rl_1_1 = _b.sent(), !rl_1_1.done)) return [3, 5];
                    line = rl_1_1.value;
                    if (line.trim().charAt(0) != "[") {
                        console.log(line);
                        n = 0;
                        while (true) {
                            pos = line.indexOf(String(n + 1));
                            if (pos == -1) {
                                return [2, n];
                            }
                            else {
                                n++;
                            }
                        }
                    }
                    _b.label = 4;
                case 4: return [3, 2];
                case 5: return [3, 12];
                case 6:
                    e_5_1 = _b.sent();
                    e_5 = { error: e_5_1 };
                    return [3, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(rl_1_1 && !rl_1_1.done && (_a = rl_1.return))) return [3, 9];
                    return [4, _a.call(rl_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3, 11];
                case 10:
                    if (e_5) throw e_5.error;
                    return [7];
                case 11: return [7];
                case 12: return [2, undefined];
            }
        });
    });
}
exports.getMaxStack = getMaxStack;
function getInitialCargo(filepath, max_stack) {
    var e_6, _a;
    return __awaiter(this, void 0, void 0, function () {
        var rl, crates, rl_2, rl_2_1, line, level_crates, n_crate, pos, e_6_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Getting intial cargo in file: ".concat(filepath));
                    rl = readline.createInterface({
                        input: fs.createReadStream(filepath)
                    });
                    crates = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    rl_2 = __asyncValues(rl);
                    _b.label = 2;
                case 2: return [4, rl_2.next()];
                case 3:
                    if (!(rl_2_1 = _b.sent(), !rl_2_1.done)) return [3, 5];
                    line = rl_2_1.value;
                    if (line.trim().charAt(0) != "[")
                        return [3, 5];
                    level_crates = [];
                    for (n_crate = 0; n_crate < max_stack; n_crate++) {
                        pos = n_crate * 4 + 1;
                        level_crates.push(new Crate(line.charAt(pos)));
                    }
                    crates.push(level_crates);
                    _b.label = 4;
                case 4: return [3, 2];
                case 5: return [3, 12];
                case 6:
                    e_6_1 = _b.sent();
                    e_6 = { error: e_6_1 };
                    return [3, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(rl_2_1 && !rl_2_1.done && (_a = rl_2.return))) return [3, 9];
                    return [4, _a.call(rl_2)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3, 11];
                case 10:
                    if (e_6) throw e_6.error;
                    return [7];
                case 11: return [7];
                case 12: return [2, new Cargo(crates)];
            }
        });
    });
}
exports.getInitialCargo = getInitialCargo;
function getMoves(filepath) {
    var e_7, _a;
    return __awaiter(this, void 0, void 0, function () {
        var rl, moves, reading_moves, rl_3, rl_3_1, line, e_7_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Getting moves: ".concat(filepath));
                    rl = readline.createInterface({
                        input: fs.createReadStream(filepath)
                    });
                    moves = new MoveStack;
                    reading_moves = false;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    rl_3 = __asyncValues(rl);
                    _b.label = 2;
                case 2: return [4, rl_3.next()];
                case 3:
                    if (!(rl_3_1 = _b.sent(), !rl_3_1.done)) return [3, 5];
                    line = rl_3_1.value;
                    if (!reading_moves) {
                        if (line.trim().charAt(0) != "[") {
                            reading_moves = true;
                        }
                    }
                    else {
                        if (line.trim() !== "") {
                            moves.push(line.trim());
                        }
                    }
                    _b.label = 4;
                case 4: return [3, 2];
                case 5: return [3, 12];
                case 6:
                    e_7_1 = _b.sent();
                    e_7 = { error: e_7_1 };
                    return [3, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(rl_3_1 && !rl_3_1.done && (_a = rl_3.return))) return [3, 9];
                    return [4, _a.call(rl_3)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3, 11];
                case 10:
                    if (e_7) throw e_7.error;
                    return [7];
                case 11: return [7];
                case 12: return [2, moves];
            }
        });
    });
}
exports.getMoves = getMoves;
//# sourceMappingURL=cargo.js.map