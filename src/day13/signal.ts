import * as fs from 'fs';
import * as readline from 'readline';

export type Elem = number | Elem[];

export type Packet = Elem[];

export type PacketPair = [Packet, Packet];

export type Message = PacketPair[];

export type RawMessage = Packet[];

function findMatchingBraketComma(str : string, pos : number) : number {
    if (str.length <= pos || str.charAt(pos) !== "[")
        throw `Error: Attempted to find matching bracket from pos ${pos} in string: ${str}`
    
    let n_brackets = 1
    let n = pos+1;
    while (n < str.length) {
        const char = str.charAt(n);

        if (char === "[") {
            n_brackets++;
        }
        else if (char === "]") {
            n_brackets--;
        }
        else if (char === "," && n_brackets === 0) {
            break;
        }
        n++;
    }

    if (n_brackets !== 0)
        throw `Error: Could not find matching bracket comma from pos ${pos} in string: ${str}`;
    
    return n;
}


function splitPacket(str : string) : string[] {
    str = str.trim();
    
    if (str.charAt(0) !== "[" || str.charAt(str.length-1) !== "]")
        throw `Attempted to split invalid packet: ${str}`

    str = str.substring(1, str.length-1);

    let tokens : string[] = []

    let n0 = 0;
    let n = 0;
    while(n < str.length) {
        const char = str.charAt(n);
        
        if (char === ",") {
            tokens.push(str.substring(n0, n).trim());
            n0 = n+1;
        }
        else if (char === "[") {
            n = findMatchingBraketComma(str, n);
            tokens.push(str.substring(n0, n).trim());
            n0 = n+1;
        }
        else if (char === "]")
            throw `Error: Found mismatching bracket in string: ${str}`

        n++;
    }
    const last_str = str.substring(n0).trim();
    if (last_str !== "") tokens.push(last_str);

    return tokens;
}

function parsePacket(str : string) : Packet {
    str = str.trim()

    if (str.charAt(0) !== "[" || str.charAt(str.length-1) !== "]")
        throw `Attempted to parse invalid packet: ${str}`
    
    const tokens = splitPacket(str);
    
    let packet : Packet = []
    for (const token of tokens) {
        if (token[0] === "[") {
            packet.push(parsePacket(token));
        }
        else {
            packet.push(Number(token));
        }
    }

    return packet;
}


export async function getMessage(filepath : string) : Promise<Message> {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    let message : Message = []
    let packet_pair : PacketPair = [undefined, undefined]

    for await(let line of rl) {
        line = line.trim()
        if (line === "") continue;

        const packet = parsePacket(line);

        for (let n = 0; n < packet_pair.length; n++) {
            if (packet_pair[n] === undefined) {
                packet_pair[n] = packet;
                break;
            }
        }

        if (packet_pair.reduce((prev, curr) => prev && (curr !== undefined), true)) {
            message.push(packet_pair.slice() as PacketPair);

            for (let n = 0; n < packet_pair.length; n++) {
                packet_pair[n] = undefined;
            }
        }
    }

    return message;
}

export enum Comparison {
    less = -1, equal, greater
}

function opposite(comp : Comparison) {
    if (comp === Comparison.less   ) return Comparison.greater;
    if (comp === Comparison.greater) return Comparison.less;
    else                             return Comparison.equal;
}

function compareNumbers(left : number, right : number) : Comparison {
    if (left < right) return Comparison.less;
    if (left > right) return Comparison.greater;
    else              return Comparison.equal;
}

function compareLists(left : Elem[], right : Elem[]) : Comparison {
    let n_left  = 0;
    let n_right = 0;
    while (n_left < left.length && n_right < right.length) {
        const comp = compare(left[n_left], right[n_right]);
        
        if (comp === Comparison.less || comp == Comparison.greater) {
            return comp;
        }

        n_left ++;
        n_right++;
    }

    const end_left  = (n_left  === left .length);
    const end_right = (n_right === right.length);

    if (end_left && end_right) {
        return Comparison.equal
    }
    else if (end_left) {
        return Comparison.less;
    }
    else if (end_right) {
        return Comparison.greater
    }
    else {
        throw "Error: List comparison ended without reaching any end"
    }
}

function compareNumberAndList(left : number, right : Elem[]) : Comparison {
    return compareLists([left], right);
}

export function compare(left : Elem, right : Elem) : Comparison {
    const left_is_number  = (typeof left  === "number");
    const right_is_number = (typeof right === "number");

    if (left_is_number && right_is_number) {
        return compareNumbers(left, right);
    }
    else if (left_is_number  && !right_is_number) {
        return compareNumberAndList(left, right);
    }
    else if (!left_is_number && right_is_number) {
        return opposite(compareNumberAndList(right, left));
    }
    else if (!left_is_number && !right_is_number) {
        return compareLists(left, right);
    }
}

export function getComparisonIndex(message : Message) : number {
    let comp_index = 0;

    for (let n = 0; n < message.length; n++) {
        const pair = message[n];
        const comp = compare(pair[0], pair[1]);
        
        if (comp === Comparison.less) {
            comp_index += n+1;
        }
        else if (comp === Comparison.equal) {
            throw `Packet pair of index ${n} compared equal`;
        }
    }

    return comp_index;
}

export function makeRaw(message : Message) : RawMessage {
    let new_message : RawMessage = [];
    
    for (let n = 0; n < message.length; n++) {
    for (let p = 0; p < 2; p++) {
        new_message.push(message[n][p]);
    }}

    return new_message;
}

export function sort(message : RawMessage) : RawMessage {
    return message.sort((left, right) => compare(left, right));
}

export function getDecoderKey(message : Message, addition : Packet[] = [[[2]], [[6]]]) : number {
    let new_message = makeRaw(message);

    new_message.push(...addition);

    sort(new_message);

    let indices = new Array<number>(addition.length);

    for (let n = 0; n < new_message.length; n++) {
        for (let n_add = 0; n_add < addition.length; n_add++) {
            if (compare(new_message[n], addition[n_add]) === Comparison.equal) {
                indices[n_add] = n+1;
            }
        }
    }

    return indices.reduce((prev, curr) => prev*curr, 1);
}