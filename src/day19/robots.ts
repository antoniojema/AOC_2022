import * as fs from 'fs';
import { stringify } from 'querystring';
import * as readline from 'readline';

const Robot = {
    ore      : 0,
    clay     : 1,
    obsidian : 2,
    geode    : 3
} as const;
const RobotKeys = ["ore", "clay", "obsidian", "geode"] as const;

type RobotKey = keyof typeof Robot;
type RobotType = typeof Robot[RobotKey];

type Blueprint = {
    ore      : {ore: number},
    clay     : {ore: number},
    obsidian : {ore: number, clay: number},
    geode    : {ore: number, obsidian: number}
};

function stringifyBlueprint(blueprint : Blueprint) : string {
    return (
        `Each ore robot costs ${blueprint.ore.ore} ore.\n` +
        `Each clay robot costs ${blueprint.clay.ore} ore.\n` +
        `Each obsidian robot costs ${blueprint.obsidian.ore} ore and ${blueprint.obsidian.clay} clay.\n` +
        `Each geode robot costs ${blueprint.geode.ore} ore and ${blueprint.geode.obsidian} obsidian.`
    );
}

function getEmptyBlueprint() {
    return {
        ore      : {ore: 0},
        clay     : {ore: 0},
        obsidian : {ore: 0, clay: 0},
        geode    : {ore: 0, obsidian: 0}
    }
};

class BlueprintSet extends Array<Blueprint> {
    constructor(blueprints : Blueprint[]) {
        super(blueprints.length);
        for (let n = 0; n < this.length; n++) {
            this[n] = blueprints[n];
        }
    }

    stringify() : string {
        return this.map((bp, n) => {
            return `Blueprint ${n+1}:\n${stringifyBlueprint(bp).split("\n").map(str => " ".repeat(4)+str).join("\n")}`
        }).join("\n\n")
    }

    qualityLevel(n_minutes : number) : number {
        let total_quality_level = 0;
        for (let n = 0; n < 1; n++) {
        // for (let n = 0; n < this.length; n++) {
            let blueprint = this[n];
    
            let factory = new Factory(blueprint);
    
            let open_geodes = factory.maxOpenGeodes(n_minutes, true);
            let quality_level = (n+1) * open_geodes;
    
            console.log(`Blueprint ${n+1}: Max open geodes = ${open_geodes}, Quality level: ${quality_level}.`)

            total_quality_level += quality_level;
        }
        return total_quality_level;
    }
}

type Resources = {
    ore      : number,
    clay     : number,
    obsidian : number,
    geode    : number
}

function getEmptyResources() : Resources {
    return {
        ore      : 0,
        clay     : 0,
        obsidian : 0,
        geode    : 0
    };
}

function copyResources(res : Resources) : Resources {
    return {
        ore      : res.ore,
        clay     : res.clay,
        obsidian : res.obsidian,
        geode    : res.geode
    };
}

class Factory {
    private blueprint : Blueprint;

    private resources : Resources;
    private robots : Resources;

    constructor(blueprint : Blueprint) {
        this.reset(blueprint);
    }

    reset(blueprint : Blueprint) {
        this.blueprint = blueprint;

        this.resources = getEmptyResources();
        this.robots = getEmptyResources();
        this.robots.ore = 1;
    }

    private collect_naive(resources : Resources, n_robots : Resources) {
        for (let key of RobotKeys) {
            resources[key] += n_robots[key];
        }
    }

    private collect() {
        for (let key of RobotKeys) {
            this.resources[key] += this.robots[key];
        }
    }

    private buildOreRobot() {
        this.robots.ore++;
        this.resources.ore -= this.blueprint.ore.ore;
    }

    private buildClayRobot() {
        this.robots.clay++;
        this.resources.ore -= this.blueprint.clay.ore;
    }

    private buildObsidianRobot() {
        this.robots.obsidian++;
        this.resources.ore  -= this.blueprint.obsidian.ore;
        this.resources.clay -= this.blueprint.obsidian.clay;
    }

    private buildGeodeRobot() {
        this.robots.geode++;
        this.resources.ore      -= this.blueprint.geode.ore;
        this.resources.obsidian -= this.blueprint.geode.obsidian;
    }

    private build(robot_type : RobotKey) {
        if (robot_type === "ore"     ) this.buildOreRobot     ();
        if (robot_type === "clay"    ) this.buildClayRobot    ();
        if (robot_type === "obsidian") this.buildObsidianRobot();
        if (robot_type === "geode"   ) this.buildGeodeRobot   ();
    }

    private resourcesUntilCanBuildOreRobot() : Resources {
        return {
            ore: this.blueprint.ore.ore - this.resources.ore,
            clay : 0,
            obsidian : 0,
            geode : 0
        }
    }

    private resourcesUntilCanBuildClayRobot() : Resources {
        return {
            ore: this.blueprint.clay.ore - this.resources.ore,
            clay : 0,
            obsidian : 0,
            geode : 0
        }
    }

    private resourcesUntilCanBuildObsidianRobot() : Resources {
        return {
            ore  : this.blueprint.obsidian.ore  - this.resources.ore,
            clay : this.blueprint.obsidian.clay - this.resources.clay,
            obsidian : 0,
            geode : 0
        }
    }

    private resourcesUntilCanBuildGeodeRobot() : Resources {
        return {
            ore : this.blueprint.geode.ore  - this.resources.ore,
            clay : 0,
            obsidian : this.blueprint.geode.obsidian - this.resources.obsidian,
            geode : 0
        }
    }

    private resourcesUntilCanBuild(robot : RobotKey) : Resources {
        if (robot === "ore"     ) return this.resourcesUntilCanBuildOreRobot     ();
        if (robot === "clay"    ) return this.resourcesUntilCanBuildClayRobot    ();
        if (robot === "obsidian") return this.resourcesUntilCanBuildObsidianRobot();
        if (robot === "geode"   ) return this.resourcesUntilCanBuildGeodeRobot   ();
        throw "Error: Invalid robot in resourcesUntilCanBuild";
    }

    private canBuild(robot : RobotKey) {
        for (let nec_res of Object.values(this.resourcesUntilCanBuild(robot))) {
            if (nec_res > 0) return false;
        }
        return true;
    }

    private turnsUntilCanBuild(robot : RobotKey) : number {
        let necessary_resources = this.resourcesUntilCanBuild(robot);
        let max = -Infinity;
        for(let key of RobotKeys) {
            let necessary_turns = Math.ceil(necessary_resources[key] / this.robots[key]);
            if (necessary_turns > max) max = necessary_turns;
        }
        return max;
    }

    private buildableRobots() : RobotKey[] {
        let can_build : RobotKey[] = [];

        for (let key of RobotKeys) {
            if (this.canBuild(key)) can_build.push(key);
        }
        
        return can_build;
    }

    private getFocusRobot() : RobotKey {
        for (let key of RobotKeys) {
            if (this.robots[key] === 0) return key;
        }
        return RobotKeys[RobotKeys.length-1];
    }

    private getBuildRobotByProportion(focus_robot : RobotKey) {
        let necessary_resources = this.blueprint[focus_robot];

        let min : {prop : number, key : RobotKey} = {prop : Infinity, key : undefined};
        for (let key of Object.keys(necessary_resources)) {
            let need = necessary_resources[key as keyof typeof necessary_resources]
            let have = this.resources[key as RobotKey];

            let prop = have/need;
            if (prop < min.prop) {
                min.prop = prop;
                min.key = key as RobotKey;
            }
        }
        
        return min.key
    }

    private getBuildRobot(verbose : boolean) : RobotKey {
        let focus_robot = this.getFocusRobot();
        if (verbose)
            console.log(`  Focus robot: ${focus_robot} robot`);
        

        if (this.canBuild(focus_robot)) {
            return focus_robot;
        }
        else if (this.turnsUntilCanBuild(focus_robot) === 1) {
            return undefined;
        }
        else {
            let build_robot = this.getBuildRobotByProportion(focus_robot);
            if (this.canBuild(build_robot)) {
                return build_robot;
            }
        }
        return undefined;
    }

    private state(n_spaces? : number) : string {
        if (n_spaces === undefined || n_spaces < 0) n_spaces = 0;
        let s = " ".repeat(n_spaces);
        return (
            s + `Robots:` + "\n" +
            s + `  Ore:      ${this.robots.ore     }` + "\n" +
            s + `  Clay:     ${this.robots.clay    }` + "\n" +
            s + `  Obsidian: ${this.robots.obsidian}` + "\n" +
            s + `  Geodes:   ${this.robots.geode   }` + "\n" +
            s + `Resources:` + "\n" +
            s + `  Ore:      ${this.resources.ore     }` + "\n" +
            s + `  Clay:     ${this.resources.clay    }` + "\n" +
            s + `  Obsidian: ${this.resources.obsidian}` + "\n" +
            s + `  Geodes:   ${this.resources.geode   }`
        );
    }

    maxOpenGeodes(n_minutes : number, verbose : boolean) : number {
        for (let minute = 0; minute < n_minutes; minute++) {
            if (verbose)
                console.log(`Minute ${minute+1}`);
            
            let build_robot = this.getBuildRobot(verbose);

            this.collect();

            if (build_robot !== undefined) {
                this.build(build_robot);
                if (verbose)
                    console.log(`  --- Building ${build_robot} robot`);
            }

            if (verbose) {
                console.log("  Final state:");
                console.log(this.state(4));
            }
        }

        return this.resources.geode;
    }
}

export async function getBlueprints(filepath : string) : Promise<BlueprintSet> {
    console.log(`Opening file: ${filepath}`)

    const rl = readline.createInterface({
        input: fs.createReadStream(filepath)
    });

    let blueprints : Blueprint[] = [];

    for await(let line of rl) {
        line = line.trim();
        if (line === "") continue;

        let line_arr = line.split(" ");

        blueprints.push({
            ore      : {ore: Number(line_arr[6 ])},
            clay     : {ore: Number(line_arr[12])},
            obsidian : {ore: Number(line_arr[18]), clay    : Number(line_arr[21])},
            geode    : {ore: Number(line_arr[27]), obsidian: Number(line_arr[30])}
        });
    }

    return new BlueprintSet(blueprints);
}