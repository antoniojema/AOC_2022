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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForest = exports.Forest = exports.Bound = exports.Dir = void 0;
var fs = require("fs");
var readline = require("readline");
var Dir;
(function (Dir) {
    Dir[Dir["row"] = 0] = "row";
    Dir[Dir["col"] = 1] = "col";
})(Dir = exports.Dir || (exports.Dir = {}));
var Bound;
(function (Bound) {
    Bound[Bound["L"] = 0] = "L";
    Bound[Bound["U"] = 1] = "U";
})(Bound = exports.Bound || (exports.Bound = {}));
var Forest = (function () {
    function Forest(trees) {
        this.trees = trees;
    }
    Object.defineProperty(Forest.prototype, "nRows", {
        get: function () {
            return this.trees.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Forest.prototype, "nCols", {
        get: function () {
            if (this.trees.length <= 0)
                return 0;
            return this.trees[0].length;
        },
        enumerable: false,
        configurable: true
    });
    Forest.prototype.isVisibleInDirection = function (row, col, dir, bound) {
        var limsL = [[0, 0], [row + 1, col + 1]];
        var limsU = [[row, col], [this.nRows, this.nCols]];
        var height = this.trees[row][col];
        var index = [row, col];
        var limL = limsL[bound][dir];
        var limU = limsU[bound][dir];
        var visible = true;
        for (index[dir] = limL; index[dir] < limU; index[dir]++) {
            if (this.trees[index[Dir.row]][index[Dir.col]] >= height) {
                visible = false;
                break;
            }
        }
        return visible;
    };
    Forest.prototype.visibleTreesInDirection = function (row, col, dir, bound) {
        var limsL = [[row - 1, col - 1], [row + 1, col + 1]];
        var limsU = [[-1, -1], [this.nRows, this.nCols]];
        var incs = [-1, 1];
        var height = this.trees[row][col];
        var index = [row, col];
        var limL = limsL[bound][dir];
        var limU = limsU[bound][dir];
        var inc = incs[bound];
        var n_visible = 0;
        for (index[dir] = limL; index[dir] != limU; index[dir] += inc) {
            n_visible++;
            if (this.trees[index[Dir.row]][index[Dir.col]] >= height) {
                break;
            }
        }
        return n_visible;
    };
    Forest.prototype.scenicScore = function (row, col) {
        var e_1, _a, e_2, _b;
        var score = 1;
        try {
            for (var _c = __values([Dir.row, Dir.col]), _d = _c.next(); !_d.done; _d = _c.next()) {
                var dir = _d.value;
                try {
                    for (var _e = (e_2 = void 0, __values([Bound.L, Bound.U])), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var bound = _f.value;
                        score *= this.visibleTreesInDirection(row, col, dir, bound);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return score;
    };
    Object.defineProperty(Forest.prototype, "highestScenicScore", {
        get: function () {
            var max_score = 0;
            for (var row = 0; row < this.nRows; row++) {
                for (var col = 0; col < this.nCols; col++) {
                    max_score = Math.max(max_score, this.scenicScore(row, col));
                }
            }
            return max_score;
        },
        enumerable: false,
        configurable: true
    });
    Forest.prototype.isVisible = function (row, col) {
        var e_3, _a, e_4, _b;
        if (row == 0 || row == this.nRows - 1 || col == 0 || col == this.nCols - 1)
            return true;
        try {
            for (var _c = __values([Dir.row, Dir.col]), _d = _c.next(); !_d.done; _d = _c.next()) {
                var dir = _d.value;
                try {
                    for (var _e = (e_4 = void 0, __values([Bound.L, Bound.U])), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var bound = _f.value;
                        if (this.isVisibleInDirection(row, col, dir, bound))
                            return true;
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    Object.defineProperty(Forest.prototype, "nVisible", {
        get: function () {
            var n_visible = 0;
            for (var row = 0; row < this.nRows; row++) {
                for (var col = 0; col < this.nCols; col++) {
                    if (this.isVisible(row, col))
                        n_visible++;
                }
            }
            return n_visible;
        },
        enumerable: false,
        configurable: true
    });
    return Forest;
}());
exports.Forest = Forest;
function getForest(filepath) {
    var e_5, _a;
    return __awaiter(this, void 0, void 0, function () {
        var rl, trees, rl_1, rl_1_1, line, row, n, e_5_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Getting forest from file: ".concat(filepath));
                    rl = readline.createInterface({
                        input: fs.createReadStream(filepath)
                    });
                    trees = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    rl_1 = __asyncValues(rl);
                    _b.label = 2;
                case 2: return [4, rl_1.next()];
                case 3:
                    if (!(rl_1_1 = _b.sent(), !rl_1_1.done)) return [3, 5];
                    line = rl_1_1.value;
                    line = line.trim();
                    row = [];
                    for (n = 0; n < line.length; n++) {
                        row.push(Number(line[n]));
                    }
                    trees.push(row);
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
                case 12: return [2, new Forest(trees)];
            }
        });
    });
}
exports.getForest = getForest;
//# sourceMappingURL=forest.js.map