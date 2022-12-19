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

export class SimplifiedNetwork {
    private rooms : Room[];
    private connection_table : number[][];
    private start_room : Room;
    private start_connections : number[];

    constructor(network : Network) {
        this.reset(network);
    }

    reset(network : Network) {
        this.rooms = network.getNonZeroRooms();
        this.start_room = network.start;
        this.setConnections(network);
    }

    private setConnections(network : Network) {
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
}

export type Step_Open = {
    step : "open"
} 

export type Step_Nothing = {
    step : "nothing"
} 

export type Step_Move = {
    step : "move",
    to : number
}

export type Step = Step_Open | Step_Move | Step_Nothing;

export class Path {
    private steps : Step[];
    private network : Network;

    constructor(steps : Step[], network : Network) {
        this.reset(steps, network);
    }

    reset(steps : Step[], network : Network) {
        this.steps = steps;
        this.network = network;
    }

    evaluate() : number {
        const n_steps = this.steps.length;
        
        const is_open = new Array<boolean>(this.network.length)
        is_open.fill(false);

        let released_pressure = 0;
        let n_current = this.network.startIndex;

        for (let n_step = 0; n_step < n_steps; n_step++) {
            const step = this.steps[n_step];
            if (step.step === "open") {
                if (is_open[n_current]) throw `Error: Attempted to open valve in room number ${n_current}`;
                is_open[n_current] = true;
                released_pressure += this.network[n_current].rate * (n_steps - n_step - 1);
            }
            else if (step.step === "move") {
                n_current = step.to;
            }
        }

        return released_pressure;
    }
}

export class SimplifiedPath {
    private n_minutes : number;
    private steps : Step[];
    private network : SimplifiedNetwork;

    constructor(steps : Step[], n_minutes : number, network : SimplifiedNetwork) {
        this.reset(steps, n_minutes, network);
    }

    reset(steps : Step[], n_minutes : number, network : SimplifiedNetwork) {
        this.n_minutes = n_minutes;
        this.steps = steps;
        this.network = network;
    }

    evaluate() : number {
        const is_open = new Array<boolean>(this.network.length)
        is_open.fill(false);

        let released_pressure = 0;
        
        let n_current : number;
        let init_minute : number = 0;
        let init_step : number = 0;

        let step = this.steps[init_step];
        if (step !== undefined && step.step === "open") {
            released_pressure += this.network.start.rate * (this.n_minutes - 1);
            init_minute++;
            init_step++;
        }

        step = this.steps[init_step];
        if (step !== undefined && step.step === "move") {
            n_current = step.to;
            init_minute += this.network.startConnections()[step.to];
            init_step++;
        }
        else {
            return released_pressure;
        }

        let minute = init_minute;
        for (let step of this.steps.slice(init_step)) {
            if (minute >= this.n_minutes-1) break;

            if (step.step === "open") {
                minute ++;

                if (is_open[n_current]) throw `Error: Attempted to open valve in room number ${n_current}`;
                is_open[n_current] = true;
                released_pressure += this.network.roomByIndex(n_current).rate * (this.n_minutes - minute);
            }
            else if (step.step === "move") {
                minute += this.network.connectionsByIndex(n_current)[step.to];

                n_current = step.to;
            }
        }

        return released_pressure;
    }
}

function findBestPath(network : SimplifiedNetwork, n_minutes : number = 30, steps? : Step[], is_open? : boolean[], current? : Room, minute? : number) : Step[] {
    if (steps === undefined) {
        steps = [];
    }

    if (is_open === undefined) {
        is_open = new Array<boolean>(network.length);
        is_open.fill(false);
    }

    if (current === undefined) {
        current = network.start;
    }
    
    if (minute === undefined) {
        minute = 0;
    }

    let connections = (current == network.start)
        ? network.startConnections()
        : network.connectionsByName(current.name);
    
    let unused = is_open.reduce((acc, curr, idx) => {
        if (!curr) acc.push(idx);
        return acc;
    }, new Array<number>(0));

    if (unused.length === 1) {
        let dist = connections[unused[0]];
        if (dist >= n_minutes - minute) {
            return steps;
        }
        else {
            steps.push({step : "move", to : unused[0]});
            steps.push({step : "open"});
            return steps;
        }
    }
    else {
        let best_steps : Step[] = steps;
        let best_evaluation : number = new SimplifiedPath(best_steps, n_minutes, network).evaluate();
        for (let index of unused) {
            let dist = connections[index];
            if (dist >= n_minutes - minute) {
                continue;
            }
            else {
                let new_steps = steps.slice();
                new_steps.push({step : "move", to : index});
                new_steps.push({step : "open"});

                let new_is_open = is_open.slice();
                new_is_open[index] = true;
                
                let candidate_steps = findBestPath(network, n_minutes, new_steps, new_is_open, network.roomByIndex(index), minute + dist + 1);

                let candidate_evaluation = new SimplifiedPath(candidate_steps, n_minutes, network).evaluate();
                
                if (candidate_evaluation > best_evaluation) {
                    best_steps = candidate_steps;
                    best_evaluation = candidate_evaluation;
                }
            }
        }
        return best_steps;
    }
}

export function findBestSimplifiedPath(network : SimplifiedNetwork, n_steps : number = 30) {
    return new SimplifiedPath(findBestPath(network, n_steps), n_steps, network);
}

export function getExamplePath(network : Network) : Path {
    const steps : Step[] = [];

    steps.push({step:"move", to:network.getRoomIndexByName("DD")});
    steps.push({step:"open"});
    steps.push({step:"move", to:network.getRoomIndexByName("CC")});
    steps.push({step:"move", to:network.getRoomIndexByName("BB")});
    steps.push({step:"open"});
    steps.push({step:"move", to:network.getRoomIndexByName("AA")});
    steps.push({step:"move", to:network.getRoomIndexByName("II")});
    steps.push({step:"move", to:network.getRoomIndexByName("JJ")});
    steps.push({step:"open"});
    steps.push({step:"move", to:network.getRoomIndexByName("II")});
    steps.push({step:"move", to:network.getRoomIndexByName("AA")});
    steps.push({step:"move", to:network.getRoomIndexByName("DD")});
    steps.push({step:"move", to:network.getRoomIndexByName("EE")});
    steps.push({step:"move", to:network.getRoomIndexByName("FF")});
    steps.push({step:"move", to:network.getRoomIndexByName("GG")});
    steps.push({step:"move", to:network.getRoomIndexByName("HH")});
    steps.push({step:"open"});
    steps.push({step:"move", to:network.getRoomIndexByName("GG")});
    steps.push({step:"move", to:network.getRoomIndexByName("FF")});
    steps.push({step:"move", to:network.getRoomIndexByName("EE")});
    steps.push({step:"open"});
    steps.push({step:"move", to:network.getRoomIndexByName("DD")});
    steps.push({step:"move", to:network.getRoomIndexByName("CC")});
    steps.push({step:"open"});
    steps.push({step:"nothing"});
    steps.push({step:"nothing"});
    steps.push({step:"nothing"});
    steps.push({step:"nothing"});
    steps.push({step:"nothing"});
    steps.push({step:"nothing"});

    return new Path(steps, network);
}

export function getSimplifiedExamplePath(network : SimplifiedNetwork) : SimplifiedPath {
    const steps : Step[] = [];

    steps.push({step:"move", to:network.getRoomIndexByName("DD")});
    steps.push({step:"open"});
    steps.push({step:"move", to:network.getRoomIndexByName("BB")});
    steps.push({step:"open"});
    steps.push({step:"move", to:network.getRoomIndexByName("JJ")});
    steps.push({step:"open"});
    steps.push({step:"move", to:network.getRoomIndexByName("HH")});
    steps.push({step:"open"});
    steps.push({step:"move", to:network.getRoomIndexByName("EE")});
    steps.push({step:"open"});
    steps.push({step:"move", to:network.getRoomIndexByName("CC")});
    steps.push({step:"open"});

    return new SimplifiedPath(steps, 30, network);
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
            room.addTunnel(network.getRoomByName(name));
        }
    }

    return network;
}