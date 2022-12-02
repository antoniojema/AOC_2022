/********************/
/*   Match result   */
/********************/
enum MatchRes {
    lose,
    draw,
    win,
}
const MatchResToHuman = {
    [MatchRes.lose]: "I lose",
    [MatchRes.draw]: "It's a draw",
    [MatchRes.win ]: "I win",
}
const stringToMatchRes = {
    "X": MatchRes.lose,
    "Y": MatchRes.draw,
    "Z": MatchRes.win,
}

export class MatchResult {
    _res: MatchRes

    public constructor(res : string | MatchRes) {
        if (typeof res === 'string') {
            this.fromString(res);
        } else {
            this._res = res;
        }
    }
    public fromString(str : string) : MatchResult {
        if (str != "X" && str != "Y" && str != "Z") {
            throw new Error(`Invalid string for MatchResult initialization: ${str}`)
        }
        this._res = stringToMatchRes[str];
        return this;
    }

    public toHuman() {
        return MatchResToHuman[this._res];
    }

    public isSame(other : MatchResult) {
        return this._res === other._res;
    }

    public static get LOSE() { return new MatchResult("X"); }
    public static get DRAW() { return new MatchResult("Y"); }
    public static get WIN () { return new MatchResult("Z"); }
}

/************/
/*   Play   */
/************/
enum RPS {
    rock,
    paper,
    scissors,
}
const RPSToHuman = {
    [RPS.rock    ]: "Rock",
    [RPS.paper   ]: "Paper",
    [RPS.scissors]: "Scissors",
}
const stringToRPS = {
    "A": RPS.rock,
    "B": RPS.paper,
    "C": RPS.scissors,

    "X": RPS.rock,
    "Y": RPS.paper,
    "Z": RPS.scissors,
}

const RPS_Table = {
    [RPS.rock]: {
        [RPS.rock    ]: MatchRes.draw,
        [RPS.paper   ]: MatchRes.lose,
        [RPS.scissors]: MatchRes.win,
    },
    [RPS.paper]: {
        [RPS.rock    ]: MatchRes.win,
        [RPS.paper   ]: MatchRes.draw,
        [RPS.scissors]: MatchRes.lose,
    },
    [RPS.scissors]: {
        [RPS.rock    ]: MatchRes.lose,
        [RPS.paper   ]: MatchRes.win,
        [RPS.scissors]: MatchRes.draw,
    }
}
const ScoreByRPS    = {
    [RPS.rock    ]: 1,
    [RPS.paper   ]: 2,
    [RPS.scissors]: 3,
}
const ScoreByResult = {
    [MatchRes.lose]: 0,
    [MatchRes.draw]: 3,
    [MatchRes.win ]: 6,
}
function getScore(my_play : RPS, result : MatchRes) : number {
    return ScoreByRPS[my_play] + ScoreByResult[result]
}

export class Play {
    _rps : RPS

    public constructor(rps : string | RPS) {
        if (typeof rps === 'string') {
            this.fromString(rps);
        } else {
            this._rps = rps;
        }
    }
    public fromString(str : string, allow_xyz : boolean = true) : Play {
        let options = ["A", "B", "C"];
        if (allow_xyz) options.concat(["X", "Y", "Z"])

        if (str in options) {
            throw new Error(`Invalid string for Play initialization: ${str}`)
        }
        
        this._rps = stringToRPS[str as "A"|"B"|"C"|"X"|"Y"|"Z"]
        return this;
    }

    public toHuman() {
        return RPSToHuman[this._rps];
    }

    public isSame(other : Play) {
        return this._rps === other._rps;
    }

    public resultAgainst(foe_play : Play) : MatchResult {
        return new MatchResult(RPS_Table[this._rps][foe_play._rps]);
    }

    public scoreAgainst(foe_play : Play): number {
        return getScore(this._rps, this.resultAgainst(foe_play)._res);
    }

    public static get ROCK    () { return new Play("A"); }
    public static get PAPER   () { return new Play("B"); }
    public static get SCISSORS() { return new Play("C"); }
}

export function playToGetResult(foe_play : Play, result : MatchResult) : Play {
    const rps : RPS = (foe_play._rps + result._res + 2) % 3;
    return new Play(rps)
}
