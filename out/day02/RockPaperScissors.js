"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.playToGetResult = exports.Play = exports.MatchResult = void 0;
var MatchRes;
(function (MatchRes) {
    MatchRes[MatchRes["lose"] = 0] = "lose";
    MatchRes[MatchRes["draw"] = 1] = "draw";
    MatchRes[MatchRes["win"] = 2] = "win";
})(MatchRes || (MatchRes = {}));
var MatchResToHuman = (_a = {},
    _a[MatchRes.lose] = "I lose",
    _a[MatchRes.draw] = "It's a draw",
    _a[MatchRes.win] = "I win",
    _a);
var stringToMatchRes = {
    "X": MatchRes.lose,
    "Y": MatchRes.draw,
    "Z": MatchRes.win,
};
var MatchResult = (function () {
    function MatchResult(res) {
        if (typeof res === 'string') {
            this.fromString(res);
        }
        else {
            this._res = res;
        }
    }
    MatchResult.prototype.fromString = function (str) {
        if (str != "X" && str != "Y" && str != "Z") {
            throw new Error("Invalid string for MatchResult initialization: ".concat(str));
        }
        this._res = stringToMatchRes[str];
        return this;
    };
    MatchResult.prototype.toHuman = function () {
        return MatchResToHuman[this._res];
    };
    MatchResult.prototype.isSame = function (other) {
        return this._res === other._res;
    };
    Object.defineProperty(MatchResult, "LOSE", {
        get: function () { return new MatchResult("X"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MatchResult, "DRAW", {
        get: function () { return new MatchResult("Y"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MatchResult, "WIN", {
        get: function () { return new MatchResult("Z"); },
        enumerable: false,
        configurable: true
    });
    return MatchResult;
}());
exports.MatchResult = MatchResult;
var RPS;
(function (RPS) {
    RPS[RPS["rock"] = 0] = "rock";
    RPS[RPS["paper"] = 1] = "paper";
    RPS[RPS["scissors"] = 2] = "scissors";
})(RPS || (RPS = {}));
var RPSToHuman = (_b = {},
    _b[RPS.rock] = "Rock",
    _b[RPS.paper] = "Paper",
    _b[RPS.scissors] = "Scissors",
    _b);
var stringToRPS = {
    "A": RPS.rock,
    "B": RPS.paper,
    "C": RPS.scissors,
    "X": RPS.rock,
    "Y": RPS.paper,
    "Z": RPS.scissors,
};
var RPS_Table = (_c = {},
    _c[RPS.rock] = (_d = {},
        _d[RPS.rock] = MatchRes.draw,
        _d[RPS.paper] = MatchRes.lose,
        _d[RPS.scissors] = MatchRes.win,
        _d),
    _c[RPS.paper] = (_e = {},
        _e[RPS.rock] = MatchRes.win,
        _e[RPS.paper] = MatchRes.draw,
        _e[RPS.scissors] = MatchRes.lose,
        _e),
    _c[RPS.scissors] = (_f = {},
        _f[RPS.rock] = MatchRes.lose,
        _f[RPS.paper] = MatchRes.win,
        _f[RPS.scissors] = MatchRes.draw,
        _f),
    _c);
var ScoreByRPS = (_g = {},
    _g[RPS.rock] = 1,
    _g[RPS.paper] = 2,
    _g[RPS.scissors] = 3,
    _g);
var ScoreByResult = (_h = {},
    _h[MatchRes.lose] = 0,
    _h[MatchRes.draw] = 3,
    _h[MatchRes.win] = 6,
    _h);
function getScore(my_play, result) {
    return ScoreByRPS[my_play] + ScoreByResult[result];
}
var Play = (function () {
    function Play(rps) {
        if (typeof rps === 'string') {
            this.fromString(rps);
        }
        else {
            this._rps = rps;
        }
    }
    Play.prototype.fromString = function (str, allow_xyz) {
        if (allow_xyz === void 0) { allow_xyz = true; }
        var options = ["A", "B", "C"];
        if (allow_xyz)
            options.concat(["X", "Y", "Z"]);
        if (str in options) {
            throw new Error("Invalid string for Play initialization: ".concat(str));
        }
        this._rps = stringToRPS[str];
        return this;
    };
    Play.prototype.toHuman = function () {
        return RPSToHuman[this._rps];
    };
    Play.prototype.isSame = function (other) {
        return this._rps === other._rps;
    };
    Play.prototype.resultAgainst = function (foe_play) {
        return new MatchResult(RPS_Table[this._rps][foe_play._rps]);
    };
    Play.prototype.scoreAgainst = function (foe_play) {
        return getScore(this._rps, this.resultAgainst(foe_play)._res);
    };
    Object.defineProperty(Play, "ROCK", {
        get: function () { return new Play("A"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Play, "PAPER", {
        get: function () { return new Play("B"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Play, "SCISSORS", {
        get: function () { return new Play("C"); },
        enumerable: false,
        configurable: true
    });
    return Play;
}());
exports.Play = Play;
function playToGetResult(foe_play, result) {
    var rps = (foe_play._rps + result._res + 2) % 3;
    return new Play(rps);
}
exports.playToGetResult = playToGetResult;
//# sourceMappingURL=RockPaperScissors.js.map