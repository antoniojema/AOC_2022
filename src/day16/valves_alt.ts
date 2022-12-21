import * as fs from 'fs';
import * as readline from 'readline';

export class Room {
    name : string; 
    rate : number;
    tunnels : Room[] = [];

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

export class Network {
    private rooms : Room[];
    private connection_table : number[][];
    private start_room : Room;
    private start_connections : number[];

    constructor(network : OldNetwork) {
        this.reset(network);
    }

    reset(network : OldNetwork) {
        this.rooms = network.getNonZeroRooms();
        this.start_room = network.start;
        this.setConnections(network);
    }

    private setConnections(network : OldNetwork) {
        // Start
        this.start_connections = new Array<number>(this.length);
        let start_distances = network.getDistances(this.start_room);
        for (let n = 0; n < this.length; n++) {
            this.start_connections[n] = start_distances[network.getRoomIndexByName(this.rooms[n].name)];
        }

        // Rest
        this.connection_table = new Array<number[]>(this.length);
        for (let n = 0; n < this.length; n++) {
            this.connection_table[n] = new Array<number>(this.length);
        }
        for (let n1 = 0; n1 < this.length; n1++) {
            let distances = network.getDistances(this.rooms[n1]);
            for (let n2 = n1; n2 < this.length; n2++) {
                let dist = distances[network.getRoomIndexByName(this.rooms[n2].name)]
                this.connection_table[n1][n2] = dist;
                this.connection_table[n2][n1] = dist;
            }
        }
    }

    get length() {return this.rooms.length;}
    get start() {return this.start_room;}

    startConnections() {return this.start_connections;}
    connectionsByIndex(idx : number) {return this.connection_table[idx];}
    connectionsByName(name : string) {return this.connection_table[this.getRoomIndexByName(name)];}

    roomByIndex(index : number) : Room {
        return this.rooms[index];
    }

    roomByName(name : string) : Room {
        for (const room of this.rooms) if (room.name === name) return room;
        return undefined;
    }

    getRoomIndexByName(name : string) : number {
        for (let n = 0; n < this.length; n++) if (this.rooms[n].name === name) return n;
        return undefined;
    }

    private stringifyConnection(connections: number[]) : string {
        return connections.map((dist, idx) => {return `${this.rooms[idx].name} (${dist})`}).join(", ");
    }

    stringify() : string {
        return (
            `Starting room: ${this.start_room.name}. Connections: ${this.stringifyConnection(this.start_connections)}\n` +
            this.rooms.map((room, idx) => 
                `Room ${room.name}. Connections: ${this.stringifyConnection(this.connection_table[idx])}`
            ).join("\n")
        );
    }

    *allCombinations(length : number, n_minutes : number = Infinity, used? : boolean[], mins_accum? : number, prev? : number) : Iterable<number[]> {
        if (length <= 0 || this.length < length) return;

        if (used === undefined) {
            used = new Array<boolean>(this.length);
            used.fill(false);
        }
        if (mins_accum === undefined) mins_accum = 0;

        for (let n = 0; n < this.length; n++) {
            if (!used[n]) {
                let new_mins_accum = mins_accum + (
                    (prev === undefined)
                        ? this.start_connections[n] + 1
                        : this.connection_table[prev][n] + 1
                );
                
                if (new_mins_accum >= n_minutes) {
                    continue;
                }
                
                if (length > 1) {
                    let new_used = used.slice();
                    new_used[n] = true;
                    let n_combs = 0;
                    for (let combination_next of this.allCombinations(length-1, n_minutes, new_used, new_mins_accum, n)) {
                        yield [n].concat(combination_next);
                        n_combs++;
                    }
                    if (n_combs === 0) yield [n];
                } else {
                    yield [n]
                }
            }
        }
    }

    *allPaths(n_minutes : number = Infinity) : Iterable<number[]> {
        for (let len = 1; len <= this.length; len++) {
            for (let combination of this.allCombinations(len, n_minutes)) {
                yield combination;
            }
        }
    }
}

class Path {
    private _rooms : number[];
    private _network : Network;
    private _n_minutes : number;

    constructor(network : Network, rooms : number[], n_minutes : number) {
        this.reset(network, rooms, n_minutes);
    }

    reset(network : Network, rooms : number[], n_minutes : number) {
        this._network = network;
        this._rooms = rooms;
        this._n_minutes = n_minutes;
    }

    evaluate() : number {
        const is_open = new Array<boolean>(this._network.length)
        is_open.fill(false);

        let released_pressure = 0;
        
        let n_previous_room : number;

        let minute = 0;
        for (let n_current_room of this._rooms) {
            if (is_open[n_current_room]) throw `Error: Attempted to open valve in room number ${n_current_room}`;

            minute += (n_previous_room === undefined)
                ? this._network.startConnections()[n_current_room]
                : this._network.connectionsByIndex(n_previous_room)[n_current_room];
            
            minute += 1

            if (minute >= this._n_minutes) break;

            released_pressure += this._network.roomByIndex(n_current_room).rate * (this._n_minutes - minute);

            n_previous_room = n_current_room;
        }

        return released_pressure;
    }
}

export function findBestPathWithTwoAgents(network : Network, n_minutes : number = 26) {
    let max = 0;
    for (let path_1 of network.allCombinations(network.length, n_minutes)) {
        let used = new Array<boolean>(network.length).fill(false);
        for (let n of path_1) used[n] = true;

        for (let path_2 of network.allCombinations(network.length, n_minutes, used)) {
            // console.log(
            //     `Path 1: [${path_1.map((n) => network.roomByIndex(n).name).join(",")}]\n`
            //     +
            //     `Path 2: [${path_2.map((n) => network.roomByIndex(n).name).join(",")}]\n`
            // );
            max = Math.max(max,
                new Path(network, path_1, n_minutes).evaluate()
                +
                new Path(network, path_2, n_minutes).evaluate()
            );
        }
    }
    return max;
}

export function findBestPath(network : Network, n_minutes : number = 30) : number {
    let max = 0;
    for (let path of network.allCombinations(network.length, n_minutes)) {
        max = Math.max(max, new Path(network, path, n_minutes).evaluate());
    }
    return max;
}

export function evaluateExample(network : Network) : number {
    const rooms : number[] = [];

    rooms.push()

    rooms.push(network.getRoomIndexByName("DD"));
    rooms.push(network.getRoomIndexByName("BB"));
    rooms.push(network.getRoomIndexByName("JJ"));
    rooms.push(network.getRoomIndexByName("HH"));
    rooms.push(network.getRoomIndexByName("EE"));
    rooms.push(network.getRoomIndexByName("CC"));

    return new Path(network, rooms, 30).evaluate();
}

class OldNetwork extends Array<Room> {
    constructor() {
        super(0);
    }

    sortByRate() {
        this.sort((a, b) => b.rate - a.rate);
    }

    stringify() : string {
        return this.map((room) => room.stringify()).join("\n");
    }

    getRoomByName(name : string) : Room {
        for (const room of this) {
            if (room.name === name) return room;
        }
        return undefined;
    }

    getRoomIndexByName(name : string) : number {
        for (let n = 0; n < this.length; n++) {
            if (this[n].name === name) return n;
        }
        return undefined;
    }

    getNonZeroRooms() : Room[] {
        return this.reduce((acc, curr) => {
            if (curr.rate > 0) acc.push(curr);
            return acc;
        }, new Array<Room>(0));
    }

    getDistances(orig : Room) : number[] {
        let used = new Array<boolean>(this.length);
        used.fill(false);
        used[this.getRoomIndexByName(orig.name)] = true;

        let distance = new Array<number>(this.length);

        let curr_dist = 0;
        let current : Room[] = [orig];
        
        while(current.length > 0) {
            let new_current : Room[] = [];
            for (const room of current) {
                distance[this.getRoomIndexByName(room.name)] = curr_dist;

                for (const tunnel of room.tunnels) {
                    let n_tunnel = this.getRoomIndexByName(tunnel.name);
                    if (!used[n_tunnel]) {
                        used[n_tunnel] = true;
                        new_current.push(tunnel);
                    }
                }
            }
            current = new_current;
            curr_dist++;
        }
        return distance;
    }

    get start() : Room {return this.getRoomByName("AA");}
    get startIndex() : number {return this.getRoomIndexByName("AA");}

    get maxRate() : Room {
        return this.reduce((prev, curr) => (prev.rate > curr.rate) ? prev : curr);
    }

    get maxRateSorted() : Room {
        return this[this.length-1];
    }
}

export async function getNetwork(filepath : string) : Promise<Network> {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    const network = new OldNetwork;
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
            room.addTunnel(network.getRoomByName(name));
        }
    }

    return new Network(network);
}