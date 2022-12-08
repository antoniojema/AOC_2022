"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorRangePair = exports.SectorRange = void 0;
var SectorRange = (function () {
    function SectorRange(str) {
        this.first = 0;
        this.last = 0;
        this.fromString(str);
    }
    SectorRange.prototype.fromString = function (str) {
        if (str === undefined) {
            this.first = 0;
            this.last = 0;
        }
        else {
            var sep = str.indexOf("-");
            if (sep === -1) {
                console.error("Invalid string for SectorRange: ".concat(str));
            }
            this.first = Number(str.substring(0, sep).trim());
            this.last = Number(str.substring(sep + 1).trim());
        }
    };
    SectorRange.prototype.isSubsetOf = function (other) {
        return this.first >= other.first &&
            this.last <= other.last;
    };
    SectorRange.prototype.isSupersetOf = function (other) {
        return other.isSubsetOf(this);
    };
    SectorRange.prototype.overlaps = function (other) {
        return this.first <= other.last &&
            this.last >= other.first;
    };
    return SectorRange;
}());
exports.SectorRange = SectorRange;
var SectorRangePair = (function () {
    function SectorRangePair(str) {
        this.range1 = new SectorRange;
        this.range2 = new SectorRange;
        this.fromString(str);
    }
    SectorRangePair.prototype.fromString = function (str) {
        if (str === undefined) {
            this.range1 = new SectorRange;
            this.range2 = new SectorRange;
        }
        else {
            var sep = str.indexOf(",");
            if (sep === -1) {
                console.error("Invalid string for SectorRangePair: ".concat(str));
            }
            this.range1.fromString(str.substring(0, sep));
            this.range2.fromString(str.substring(sep + 1));
        }
    };
    SectorRangePair.prototype.isRedundant = function () {
        return this.range1.isSubsetOf(this.range2) ||
            this.range2.isSubsetOf(this.range1);
    };
    SectorRangePair.prototype.overlap = function () {
        return this.range1.overlaps(this.range2);
    };
    return SectorRangePair;
}());
exports.SectorRangePair = SectorRangePair;
//# sourceMappingURL=ranges.js.map