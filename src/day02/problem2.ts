import * as events from 'events';
import * as fs from 'fs';
import * as readline from 'readline';
import {resolve} from 'path';

import {Play, MatchResult, playToGetResult} from './RockPaperScissors';

const filename = "data.dat"
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day02/${filename}`);

(async function main() {
    try {
        console.log(`Opening file: ${filepath}`)

        const rl = readline.createInterface({
            input: fs.createReadStream(filepath)
        });

        var total_score : number = 0;
        var n_lines : number = 0;

        rl.on('line', (line : string) : void => {
            n_lines++;
            console.log(`--- PLAY at line ${n_lines} ---`);

            line = line.trim()
            if (line == "") return
            const foe_play = new Play(line.charAt(0));
            console.log(`Foe play: ${foe_play.toHuman()}`);
            
            line = line.substring(1).trim();
            const result = new MatchResult(line.charAt(0));
            console.log(`Desired result: ${result.toHuman()}`);

            const my_play = playToGetResult(foe_play, result);
            console.log(`My play:  ${my_play.toHuman()}`);

            const score = my_play.scoreAgainst(foe_play);
            total_score += score;
            console.log(`Score: ${score}`);
            console.log(`Total score: ${total_score}`);
            console.log("");
        });
        await events.once(rl, 'close');

        console.log(`Total score: ${total_score}`);
    }
    catch (err) {
        console.error(err);
    }
})();
