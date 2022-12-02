import * as events from 'events';
import * as fs from 'fs';
import * as readline from 'readline';
import {resolve} from 'path';

const filename = "data.dat"
const rootpath = resolve(__dirname + `/../../`);
const filepath = resolve(rootpath + `/src/day01/${filename}`);

(async function main() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(filepath),
            crlfDelay: Infinity
        });

        var top_calories = [0, 0, 0]
        var current_calories = 0
        
        const checkCalories = () => {
            for (let top = 0; top < top_calories.length; top++) {
                if (current_calories > top_calories[top]) {
                    for (let n = 2; n > top; n--) {
                        top_calories[n] = top_calories[n-1]
                    }
                    top_calories[top] = current_calories;
                    break;
                }
            }
        }

        rl.on('line', (line) => {
            line = line.trim()
            if (line === '') {
                checkCalories()
                current_calories = 0
            }
            else {
                current_calories += Number(line)
            }
        });
        await events.once(rl, 'close');
        if (current_calories > 0) {
            checkCalories();
        }
        
        const sum = top_calories.reduce((a, b) => {return a+b})
        console.log('Top 3 calories: ' + top_calories);
        console.log('Top 3 calories sum: ' + sum);
    }
    catch (err) {
        console.error(err);
    }
})();
