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
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var fs = require("fs");
var readline = require("readline");
var path_1 = require("path");
var RockPaperScissors_1 = require("./RockPaperScissors");
var filename = "data.dat";
var rootpath = (0, path_1.resolve)(__dirname + "/../../");
var filepath = (0, path_1.resolve)(rootpath + "/src/day02/".concat(filename));
(function main() {
    return __awaiter(this, void 0, void 0, function () {
        var rl, total_score, n_lines, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("Opening file: ".concat(filepath));
                    rl = readline.createInterface({
                        input: fs.createReadStream(filepath)
                    });
                    total_score = 0;
                    n_lines = 0;
                    rl.on('line', function (line) {
                        n_lines++;
                        console.log("--- PLAY at line ".concat(n_lines, " ---"));
                        line = line.trim();
                        if (line == "")
                            return;
                        var foe_play = new RockPaperScissors_1.Play(line.charAt(0));
                        console.log("Foe play: ".concat(foe_play.toHuman()));
                        line = line.substring(1).trim();
                        var result = new RockPaperScissors_1.MatchResult(line.charAt(0));
                        console.log("Desired result: ".concat(result.toHuman()));
                        var my_play = (0, RockPaperScissors_1.playToGetResult)(foe_play, result);
                        console.log("My play:  ".concat(my_play.toHuman()));
                        var score = my_play.scoreAgainst(foe_play);
                        total_score += score;
                        console.log("Score: ".concat(score));
                        console.log("Total score: ".concat(total_score));
                        console.log("");
                    });
                    return [4, events.once(rl, 'close')];
                case 1:
                    _a.sent();
                    console.log("Total score: ".concat(total_score));
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