import * as fs from 'fs';
import * as readline from 'readline';

export class DataStream {
    stream : string = ""

    constructor(str : string) {
        this.set(str);
    }

    set(str: string) {
        this.stream = str.trim();
    }

    distinctCharactersPos(count : number) : number {
        let marker : string = "";
        for (let pos = 0; pos < this.stream.length; pos++) {
            let char = this.stream[pos];
            for (let m_pos = this.stream.length-1; m_pos >= 0; m_pos--) {
                if (marker[m_pos] == char) {
                    marker = marker.slice(m_pos+1);
                    break;
                }
            }
            marker += char;
            if (marker.length == count) {
                return pos+1;
            }
        }
        return undefined;
    }

    get packetStartPos() : number {
        return this.distinctCharactersPos(4);
    }

    get messageStartPos() : number {
        return this.distinctCharactersPos(14);
    }
}

export async function getStream(filepath : string) : Promise<DataStream> {
    console.log(`Getting stream: ${filepath}`);

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    for await(let line of rl) {
        return new DataStream(line);
    }

    return undefined;
}