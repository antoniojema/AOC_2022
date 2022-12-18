export namespace Sparse {

export type Range = {ini : number, fin : number};

export type Slice<T> = {range : Range, value : T};

export class SliceArray<T> {
    private default_val : T;
    private lims : Range;
    private slices : Slice<T>[];

    constructor(lims : Range, default_val : T) {
        this.reset(lims, default_val);
    }

    reset(lims : Range, default_val : T) {
        this.lims = lims;
        this.default_val = default_val;
        this.slices = [];
    }

    getEmptyPos() : number {
        if (this.slices.length === 0) {
            return this.lim_L;
        }
        else {
            if (this.slices[0].range.ini > this.lim_L) {
                return this.lim_L;
            }
            for (let n = 1; n < this.slices.length; n++) {
                if (this.slices[n-1].range.fin+1 < this.slices[n].range.ini) {
                    return this.slices[n-1].range.fin+1;
                }
            }
            if (this.slices[this.slices.length-1].range.fin+1 < this.lim_U) {
                return this.lim_U;
            }
            return undefined;
        }
    }

    get lim_L() {return this.lims.ini;}
    get lim_U() {return this.lims.fin;}

    get length() {return this.lim_U - this.lim_L;}

    get size() {return this.slices.length;}

    get(pos : number) : T {
        const [found, n_slice] = this.findPos(pos);
        return found ? this.slices[n_slice].value : this.default_val;
    }

    private findPos(pos : number) : [boolean, number] {
        let lower = 0;
        let upper = this.size;
        
        while(true) {
            if (upper <= lower) return [false, lower-1];
            let current = Math.floor((lower+upper)/2);
            const current_range = this.slices[current].range;
            if (pos < current_range.ini) {
                upper = current;
            }
            else if (pos > current_range.fin) {
                if (lower === current) return [false, lower];
                lower = current;
            }
            else {
                return [true, current];
            }
        }
    }
    
    private split(n_slice : number, pos : number, value : T) {
        const slice = this.slices[n_slice];
        const ini = slice.range.ini;
        const fin = slice.range.fin;
        if (ini - fin === 0) {
            slice.value = value;
        }
        else if (pos === ini) {
            const new_slice = {range : {ini : pos, fin : pos}, value : value};
            slice.range.ini++;
            this.slices.splice(n_slice, 0, new_slice);
        }
        else if (pos === fin) {
            const new_slice = {range : {ini : pos, fin : pos}, value : value};
            slice.range.ini++;
            this.slices.splice(n_slice+1, 0, new_slice);
        }
        else {
            const new_slice_mid = {range : {ini : pos, fin : pos}, value : value}
            const new_slice_U = {range : {ini : pos+1, fin : fin}, value : slice.value};
            slice.range.fin = pos-1;
            this.slices.splice(n_slice+1, 0, new_slice_mid, new_slice_U);
        }
    }

    set(pos : number, value : T) {
        const [found, n_slice] = this.findPos(pos);
        if (found) {
            if (this.slices[n_slice].value !== value) {
                this.split(n_slice, pos, value);
            }
        }
        else {
            const exists_lower = (n_slice > -1);
            const exists_upper = (n_slice < this.size-1);

            const slice_lower = (exists_lower) ? this.slices[n_slice  ] : undefined;
            const slice_upper = (exists_upper) ? this.slices[n_slice+1] : undefined;

            const touches_lower = exists_lower && slice_lower.range.fin+1 === pos;
            const touches_upper = exists_upper && slice_upper.range.ini-1 === pos;

            const same_val_lower = exists_lower && slice_lower.value === value;
            const same_val_upper = exists_upper && slice_upper.value === value;

            const merge_lower = touches_lower && same_val_lower;
            const merge_upper = touches_upper && same_val_upper;
            const merge_both = merge_lower && merge_upper;

            if (merge_both) {
                slice_lower.range.fin = slice_upper.range.fin;
                this.slices.splice(n_slice+1, 1);
            }
            else if (merge_lower) {
                slice_lower.range.fin++;
            }
            else if (merge_upper) {
                slice_upper.range.ini--;
            }
            else {
                this.slices.splice(n_slice+1, 0, {range : {ini : pos, fin : pos}, value : value})
            }
        }
    }

    setRange_Naive(range : Range, value : T) {
        for (let n = range.ini; n <= range.fin; n++) {
            this.set(n, value);
        }
    }

    setRange(range : Range, value : T) {
        let [lower_found, n_lower] = this.findPos(range.ini);
        let [upper_found, n_upper] = this.findPos(range.fin);
        if (!upper_found) n_upper++;

        if (n_lower === n_upper) {
            const slice = this.slices[n_lower];
            const same_val = slice.value === value;
            
            const cut_lower = (slice.range.ini < range.ini && !same_val);
            const cut_upper = (slice.range.fin > range.fin && !same_val);
            const cut_both = cut_lower && cut_upper;

            if (cut_both) {
                let slice_mid = {range : {ini : range.ini, fin : range.fin}, value : value};
                let slice_upp = {range : {ini : range.fin+1, fin : slice.range.fin}, value : slice.value};

                slice.range.fin = range.ini-1;
                this.slices.splice(n_lower+1, 0, slice_mid, slice_upp);
            }
            else if (cut_lower) {
                let slice_upp = {range : {ini : range.ini, fin : slice.range.fin}, value : value};
                
                slice.range.fin = range.ini-1;
                this.slices.splice(n_lower+1, 0, slice_upp);
            }
            else if (cut_upper) {
                let slice_upp = {range : {ini : range.fin+1, fin : slice.range.fin}, value : slice.value};

                slice.range.fin = range.fin;
                slice.value = value;
                this.slices.splice(n_lower+1, 0, slice_upp);
            }
            else {
                slice.value = value;
            }
        }
        else {
            let n_delete = n_upper - n_lower - 1;

            const exists_lower = (n_lower > -1);
            const exists_upper = (n_upper < this.size-1);

            const slice_lower = (exists_lower) ? this.slices[n_lower] : undefined;
            const slice_upper = (exists_upper) ? this.slices[n_upper] : undefined;

            const same_val_lower = exists_lower && slice_lower.value === value;
            const same_val_upper = exists_upper && slice_upper.value === value;

            let in_lower = exists_lower && slice_lower.range.ini < range.ini && range.ini <= slice_lower.range.fin;
            let in_upper = exists_upper && slice_upper.range.fin > range.fin && range.fin >= slice_upper.range.ini;

            const covers_lower = exists_lower && slice_lower.range.ini === range.ini;
            const covers_upper = exists_upper && slice_upper.range.fin === range.fin;

            let touches_lower = exists_lower && range.ini === slice_lower.range.fin+1;
            let touches_upper = exists_upper && range.fin === slice_upper.range.ini-1;

            if (in_lower) {
                slice_lower.range.fin = range.ini-1;
                touches_lower = true;
            }

            if (in_upper) {
                slice_upper.range.ini = range.fin+1;
                touches_upper = true;
            }

            const merge_lower = covers_lower || (touches_lower && same_val_lower);
            const merge_upper = covers_upper || (touches_upper && same_val_upper);
            const merge_both = merge_lower && merge_upper;

            if (merge_both) {
                slice_lower.range.fin = slice_upper.range.fin;
                slice_lower.value = value;
                this.slices.splice(n_lower + 1, 1 + n_delete);
            }
            else if (merge_lower) {
                slice_lower.range.fin = range.fin;
                slice_lower.value = value;
                this.slices.splice(n_lower + 1, n_delete);
            }
            else if (merge_upper) {
                slice_upper.range.ini = range.ini;
                slice_upper.value = value;
                this.slices.splice(n_lower + 1, n_delete);
            }
            else {
                this.slices.splice(n_lower + 1, n_delete, {range : range, value : value})
            }
        }
    }
}

export type SliceMatrix<T> = SliceArray<T>[];

} // namespace Sparse
