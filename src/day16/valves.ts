import * as fs from 'fs';
import * as readline from 'readline';


export class Room {
    name : string; 
    rate : number;
    tunnels : Room[] = []
    open : boolean = false;

    constructor(name : string, rate : number) {
        this.name = name;
        this.rate = rate;
    }

    addTunnel(room : Room) {
        this.tunnels.push(room);
    }

    stringify() : string {
        return `Valve ${this.name} has flow rate=${this.rate}; tunnels lead to `
            + ((this.tunnels.length == 1) ? "valve " : "valves ")
            + this.tunnels.map((room) => room.name).join(", ");
    }
}

class Network extends Array<Room> {
    constructor() {
        super(0);
    }

    sortByRate() {
        this.sort((a, b) => b.rate - a.rate);
    }

    stringify() : string {
        return this.map((room) => room.stringify()).join("\n");
    }

    getRoomOfName(name : string) : Room {
        for (const room of this) {
            if (room.name === name) return room;
        }
        return undefined;
    }

    get start() : Room {return this.getRoomOfName("AA");}

    get maxRate() : Room {
        return this.reduce((prev, curr) => (prev.rate > curr.rate) ? prev : curr);
    }

    get maxRateSorted() : Room {
        return this[this.length-1];
    }

    get closedMaxRate() : Room {
        let ret_room : Room = undefined;
        for (const room of this) {
            if (!room.open) {
                if (ret_room === undefined || room.rate > ret_room.rate)
                    ret_room = room;
            }
        }
        return ret_room;
    }

    get closedMaxRateSorted() : Room {
        for (let n = this.length-1; n >= 0; n--) {
            const room = this[n];
            if (!room.open) return room;
        }
    }
}


export async function getNetwork(filepath : string) : Promise<Network> {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    const network = new Network;
    const all_tunnels : string[][] = [];

    for await(let line of rl) {
        line = line.trim();
        if (line == "") continue;

        const [valve_str, tunnels_str] = line.split(";");

        const name = valve_str.split(" ")[1];
        const rate = Number(valve_str.split("=")[1]);

        let tunnel_names = tunnels_str.split((tunnels_str.indexOf("valves ") !== -1) ? "valves " : "valve ")[1];
        all_tunnels.push(tunnel_names.split(",").map((s) => s.trim()));

        network.push(new Room(name, rate));
    }

    for (let n = 0; n < all_tunnels.length; n++) {
        const room = network[n];
        const tunnels = all_tunnels[n];

        for (const name of tunnels) {
            room.addTunnel(network.getRoomOfName(name));
        }
    }

    return network;
}