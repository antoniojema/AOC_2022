export class SectorRange {
    first = 0;
    last = 0;
    constructor(str) {
        this.fromString(str);
    }
    fromString(str) {
        if (str === undefined) {
            this.first = 0;
            this.last = 0;
        }
        else {
            const sep = str.indexOf("-");
            if (sep === -1) {
                console.error(`Invalid string for SectorRange: ${str}`);
            }
            this.first = Number(str.substring(0, sep).trim());
            this.last = Number(str.substring(sep + 1).trim());
        }
    }
    isSubsetOf(other) {
        return this.first >= other.first &&
            this.last <= other.last;
    }
    isSupersetOf(other) {
        return other.isSubsetOf(this);
    }
    overlaps(other) {
        return this.first <= other.last &&
            this.last >= other.first;
    }
}
export class SectorRangePair {
    range1 = new SectorRange;
    range2 = new SectorRange;
    constructor(str) {
        this.fromString(str);
    }
    fromString(str) {
        if (str === undefined) {
            this.range1 = new SectorRange;
            this.range2 = new SectorRange;
        }
        else {
            const sep = str.indexOf(",");
            if (sep === -1) {
                console.error(`Invalid string for SectorRangePair: ${str}`);
            }
            this.range1.fromString(str.substring(0, sep));
            this.range2.fromString(str.substring(sep + 1));
        }
    }
    isRedundant() {
        return this.range1.isSubsetOf(this.range2) ||
            this.range2.isSubsetOf(this.range1);
    }
    overlap() {
        return this.range1.overlaps(this.range2);
    }
}
//# sourceMappingURL=ranges.js.map