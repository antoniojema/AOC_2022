import * as events from 'events';
import * as fs from 'fs';
import * as readline from 'readline';

const filename : string = __dirname + '/data.dat';

(async function main() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(filename)
        });

        var max_calories = 0
        var current_calories = 0

        rl.on('line', (line : string) : void => {
            line = line.trim()
            if (line === '') {
                max_calories = Math.max(max_calories, current_calories)
                current_calories = 0
            }
            else {
                current_calories += Number(line)
            }
        });
        await events.once(rl, 'close');
        if (current_calories > 0) {
            max_calories = Math.max(max_calories, current_calories)
        }
        
        console.log('Max calories: ' + max_calories);
    }
    catch (err) {
        console.error(err);
    }
})();
