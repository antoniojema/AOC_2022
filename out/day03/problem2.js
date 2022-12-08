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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var fs = require("fs");
var readline = require("readline");
var path_1 = require("path");
var process_1 = require("process");
function ascii(char) {
    return char.charCodeAt(0);
}
var Item = (function () {
    function Item(c) {
        this.char = c;
    }
    Object.defineProperty(Item.prototype, "priority", {
        get: function () {
            var c = ascii(this.char);
            var a = ascii("a");
            var z = ascii("z");
            var A = ascii("A");
            var Z = ascii("Z");
            if (a <= c && c <= z) {
                return c - a + 1;
            }
            else if (A <= c && c <= Z) {
                return c - A + z - a + 2;
            }
            else {
                console.error("Invalid item: ".concat(this.char));
                (0, process_1.exit)();
            }
        },
        enumerable: false,
        configurable: true
    });
    Item.prototype.equals = function (rhs) {
        return this.char === rhs.char;
    };
    return Item;
}());
var RuckSack = (function () {
    function RuckSack(contents) {
        this.items = [[], []];
        this.fromString(contents);
    }
    RuckSack.prototype.fromString = function (contents) {
        var len = contents.length / 2;
        this.items = [[], []];
        this.specificFromString(0, contents.substring(0, len));
        this.specificFromString(1, contents.substring(len));
    };
    RuckSack.prototype.repeating = function () {
        var e_1, _a;
        var repeating_items = [];
        for (var n0 = 0; n0 < this.items[0].length; n0++) {
            for (var n1 = 0; n1 < this.items[1].length; n1++) {
                var item0 = this.items[0][n0];
                var item1 = this.items[1][n1];
                if (item0.equals(item1)) {
                    var found = false;
                    try {
                        for (var repeating_items_1 = (e_1 = void 0, __values(repeating_items)), repeating_items_1_1 = repeating_items_1.next(); !repeating_items_1_1.done; repeating_items_1_1 = repeating_items_1.next()) {
                            var rep_item = repeating_items_1_1.value;
                            if (rep_item.equals(item0)) {
                                found = true;
                                break;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (repeating_items_1_1 && !repeating_items_1_1.done && (_a = repeating_items_1.return)) _a.call(repeating_items_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    if (!found) {
                        repeating_items.push(item1);
                    }
                }
            }
        }
        return repeating_items;
    };
    RuckSack.prototype.specificFromString = function (which, contents) {
        var items = this.items[which];
        items.length = 0;
        __spreadArray([], __read(contents), false).forEach(function (c) {
            items.push(new Item(c));
        });
    };
    Object.defineProperty(RuckSack.prototype, "allItems", {
        get: function () {
            return this.items[0].concat(this.items[1]);
        },
        enumerable: false,
        configurable: true
    });
    RuckSack.prototype.hasItem = function (item) {
        var e_2, _a;
        try {
            for (var _b = __values(this.allItems), _c = _b.next(); !_c.done; _c = _b.next()) {
                var my_item = _c.value;
                if (item.equals(my_item))
                    return true;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return false;
    };
    return RuckSack;
}());
function matchItem(sacks) {
    var e_3, _a;
    try {
        for (var _b = __values(sacks[0].allItems), _c = _b.next(); !_c.done; _c = _b.next()) {
            var item = _c.value;
            for (var n = 1; n < sacks.length; n++) {
                if (!sacks[n].hasItem(item)) {
                    break;
                }
                else if (n == sacks.length - 1) {
                    return item;
                }
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return undefined;
}
var filename = "data.dat";
var rootpath = (0, path_1.resolve)(__dirname + "/../../");
var filepath = (0, path_1.resolve)(rootpath + "/src/day03/".concat(filename));
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var rl, total_priority, sacks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Opening file: ".concat(filepath));
                    rl = readline.createInterface({
                        input: fs.createReadStream(filepath)
                    });
                    total_priority = 0;
                    sacks = [];
                    rl.on('line', function (line) {
                        if (sacks.length === 0) {
                            console.log("--- NEW SACK SET ---");
                        }
                        sacks.push(new RuckSack(line.trim()));
                        console.log("Sack ".concat(sacks.length, ": ").concat(line.trim()));
                        if (sacks.length === 3) {
                            var match_item = matchItem(sacks);
                            var priority = match_item.priority;
                            total_priority += priority;
                            console.log("Matching item: ".concat(match_item.char));
                            console.log("Priority: ".concat(priority));
                            console.log("Total priority: ".concat(total_priority));
                            sacks = [];
                        }
                    });
                    return [4, events.once(rl, 'close')];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    });
}
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, main()];
                case 1:
                    _a.sent();
                    return [3, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3, 3];
                case 3: return [2];
            }
        });
    });
})();
//# sourceMappingURL=problem2.js.map