export class SectorRange {
    first : number = 0;
    last  : number = 0;

    constructor(str? : string) {
        this.fromString(str);
    }

    fromString(str? : string) {
        if (str === undefined) {
            this.first = 0;
            this.last = 0;
        } else {
            const sep = str.indexOf("-");
            if (sep === -1) {
                console.error(`Invalid string for SectorRange: ${str}`);
            }
            this.first = Number(str.substring(0, sep).trim())
            this.last  = Number(str.substring(sep+1 ).trim())
        }
    }

    isSubsetOf(other: SectorRange) : boolean {
        return this.first >= other.first &&
               this.last  <= other.last;
    }

    isSupersetOf(other: SectorRange) : boolean {
        return other.isSubsetOf(this);
    }

    overlaps(other: SectorRange) : boolean {
        return this.first <= other.last  &&
               this.last  >= other.first;
    }
}

export class SectorRangePair {
    range1 : SectorRange = new SectorRange;
    range2 : SectorRange = new SectorRange;

    constructor(str? : string) {
        this.fromString(str);
    }

    fromString(str? : string) {
        if (str === undefined) {
            this.range1 = new SectorRange;
            this.range2 = new SectorRange;
        } else {
            const sep = str.indexOf(",");
            if (sep === -1) {
                console.error(`Invalid string for SectorRangePair: ${str}`);
            }
            this.range1.fromString(str.substring(0, sep));
            this.range2.fromString(str.substring(sep+1 ));
        }
    }

    isRedundant() : boolean {
        return this.range1.isSubsetOf(this.range2) ||
               this.range2.isSubsetOf(this.range1);
    }

    overlap() : boolean {
        return this.range1.overlaps(this.range2);
    }
}