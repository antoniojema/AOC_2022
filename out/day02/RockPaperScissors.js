var MatchRes;
(function (MatchRes) {
    MatchRes[MatchRes["lose"] = 0] = "lose";
    MatchRes[MatchRes["draw"] = 1] = "draw";
    MatchRes[MatchRes["win"] = 2] = "win";
})(MatchRes || (MatchRes = {}));
const MatchResToHuman = {
    [MatchRes.lose]: "I lose",
    [MatchRes.draw]: "It's a draw",
    [MatchRes.win]: "I win",
};
const stringToMatchRes = {
    "X": MatchRes.lose,
    "Y": MatchRes.draw,
    "Z": MatchRes.win,
};
export class MatchResult {
    _res;
    constructor(res) {
        if (typeof res === 'string') {
            this.fromString(res);
        }
        else {
            this._res = res;
        }
    }
    fromString(str) {
        if (str != "X" && str != "Y" && str != "Z") {
            throw new Error(`Invalid string for MatchResult initialization: ${str}`);
        }
        this._res = stringToMatchRes[str];
        return this;
    }
    toHuman() {
        return MatchResToHuman[this._res];
    }
    isSame(other) {
        return this._res === other._res;
    }
    static get LOSE() { return new MatchResult("X"); }
    static get DRAW() { return new MatchResult("Y"); }
    static get WIN() { return new MatchResult("Z"); }
}
var RPS;
(function (RPS) {
    RPS[RPS["rock"] = 0] = "rock";
    RPS[RPS["paper"] = 1] = "paper";
    RPS[RPS["scissors"] = 2] = "scissors";
})(RPS || (RPS = {}));
const RPSToHuman = {
    [RPS.rock]: "Rock",
    [RPS.paper]: "Paper",
    [RPS.scissors]: "Scissors",
};
const stringToRPS = {
    "A": RPS.rock,
    "B": RPS.paper,
    "C": RPS.scissors,
    "X": RPS.rock,
    "Y": RPS.paper,
    "Z": RPS.scissors,
};
const RPS_Table = {
    [RPS.rock]: {
        [RPS.rock]: MatchRes.draw,
        [RPS.paper]: MatchRes.lose,
        [RPS.scissors]: MatchRes.win,
    },
    [RPS.paper]: {
        [RPS.rock]: MatchRes.win,
        [RPS.paper]: MatchRes.draw,
        [RPS.scissors]: MatchRes.lose,
    },
    [RPS.scissors]: {
        [RPS.rock]: MatchRes.lose,
        [RPS.paper]: MatchRes.win,
        [RPS.scissors]: MatchRes.draw,
    }
};
const ScoreByRPS = {
    [RPS.rock]: 1,
    [RPS.paper]: 2,
    [RPS.scissors]: 3,
};
const ScoreByResult = {
    [MatchRes.lose]: 0,
    [MatchRes.draw]: 3,
    [MatchRes.win]: 6,
};
function getScore(my_play, result) {
    return ScoreByRPS[my_play] + ScoreByResult[result];
}
export class Play {
    _rps;
    constructor(rps) {
        if (typeof rps === 'string') {
            this.fromString(rps);
        }
        else {
            this._rps = rps;
        }
    }
    fromString(str, allow_xyz = true) {
        let options = ["A", "B", "C"];
        if (allow_xyz)
            options.concat(["X", "Y", "Z"]);
        if (str in options) {
            throw new Error(`Invalid string for Play initialization: ${str}`);
        }
        this._rps = stringToRPS[str];
        return this;
    }
    toHuman() {
        return RPSToHuman[this._rps];
    }
    isSame(other) {
        return this._rps === other._rps;
    }
    resultAgainst(foe_play) {
        return new MatchResult(RPS_Table[this._rps][foe_play._rps]);
    }
    scoreAgainst(foe_play) {
        return getScore(this._rps, this.resultAgainst(foe_play)._res);
    }
    static get ROCK() { return new Play("A"); }
    static get PAPER() { return new Play("B"); }
    static get SCISSORS() { return new Play("C"); }
}
export function playToGetResult(foe_play, result) {
    const rps = (foe_play._rps + result._res + 2) % 3;
    return new Play(rps);
}
//# sourceMappingURL=RockPaperScissors.js.map