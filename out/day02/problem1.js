import * as events from 'events';
import * as fs from 'fs';
import * as readline from 'readline';
import { resolve } from 'path';
import { Play } from './RockPaperScissors.js';
const filename = "data.dat";
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day02/${filename}`);
(async function main() {
    try {
        console.log(`Opening file: ${filepath}`);
        const rl = readline.createInterface({
            input: fs.createReadStream(filepath)
        });
        var total_score = 0;
        rl.on('line', (line) => {
            line = line.trim();
            if (line == "")
                return;
            const foe_play = new Play(line.charAt(0));
            line = line.substring(1).trim();
            const my_play = new Play(line.charAt(0));
            const result = my_play.resultAgainst(foe_play);
            const score = my_play.scoreAgainst(foe_play);
            total_score += score;
            console.log("--- PLAY ---");
            console.log(`Foe play: ${foe_play.toHuman()}`);
            console.log(`My play:  ${my_play.toHuman()}`);
            console.log(`${result.toHuman()}`);
            console.log(`Score: ${score}`);
            console.log("");
        });
        await events.once(rl, 'close');
        console.log(`Total score: ${total_score}`);
    }
    catch (err) {
        console.error(err);
    }
})();
//# sourceMappingURL=problem1.js.map