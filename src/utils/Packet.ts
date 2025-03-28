export default class Packet {
    private buffer: Uint8Array;
    private capacity: number;
    private cursize: number;
    private pointer: number;

    constructor(capacity: number = 1024, buffer?: Uint8Array) {
        this.capacity = capacity;
        this.pointer = 0;
        if(!buffer) {
            this.buffer = new Uint8Array(capacity); 
            this.cursize = 0
        }
        else {
            this.buffer = buffer;
            this.cursize = buffer.length
        }
    }

    getBuffer(): Uint8Array {
        return this.buffer;
    }

    private hasCapacity(offset: number): boolean {
        return this.cursize + offset <= this.capacity;
    }

    readInt32(): {int32_num: number, err: Error|undefined} {
        if (this.pointer + 4 > this.cursize) {
            return {
                int32_num: 0, 
                err: new Error("Out of bounds")
            };
        }
        const value = new DataView(this.buffer.buffer).getInt32(this.pointer, false);
        this.pointer += 4;
        return {
            int32_num: value, 
            err: undefined
        };
    }

    readInt64(): {int64_num: BigInt, err: Error|undefined} {
        if (this.pointer + 8 > this.cursize) {
            return {
                int64_num: 0n, 
                err: new Error("Out of bounds")
            };
        }
        const value = new DataView(this.buffer.buffer).getBigInt64(this.pointer, false);
        this.pointer += 8;
        return {
            int64_num: value, 
            err: undefined
        };
    }

    readFloat32(): {float32_num: number, err: Error|undefined} {
        if (this.pointer + 4 > this.cursize) {
            return {
                float32_num: 0, 
                err: new Error("Out of bounds")
            };
        }
        const value = new DataView(this.buffer.buffer).getFloat32(this.pointer, false);
        this.pointer += 4;
        return {
            float32_num: value, 
            err: undefined
        };
    }

    readFloat64(): {float64_num: number, err: Error|undefined} {
        if (this.pointer + 8 > this.cursize) {
            return {
                float64_num: 0, 
                err: new Error("Out of bounds")
            };
        }
        const value = new DataView(this.buffer.buffer).getFloat64(this.pointer, false);
        this.pointer += 8;
        return {
            float64_num: value, 
            err: undefined
        };
    }

    readString(): {string_val: string, err: Error | undefined}  {
        const {int32_num, err} = this.readInt32();
        if (err) {
            return {
                string_val: "", 
                err: new Error("Out of bounds")
            };
        }
        const text = new TextDecoder().decode(this.buffer.slice(this.pointer, this.pointer + int32_num));
        this.pointer += int32_num;
        return {
            string_val: text,  
            err: undefined
        };;
    }

    writeInt32(value: number): Error | void {
        if (!this.hasCapacity(4)) return new Error("Packet out of space");
        new DataView(this.buffer.buffer).setInt32(this.cursize, value, false);
        this.cursize += 4;
    }

    writeInt64(value: number): Error | void {
        if (!this.hasCapacity(8)) return new Error("Packet out of space");
        new DataView(this.buffer.buffer).setBigInt64(this.cursize, BigInt(value), false);
        this.cursize += 8;
    }

    writeFloat32(value: number): Error | void {
        if (!this.hasCapacity(4)) return new Error("Packet out of space");
        new DataView(this.buffer.buffer).setFloat32(this.cursize, value, false);
        this.cursize += 4;
    }

    writeFloat64(value: number): Error | void {
        if (!this.hasCapacity(8)) return new Error("Packet out of space");
        new DataView(this.buffer.buffer).setFloat64(this.cursize, value, false);
        this.cursize += 8;
    }

    writeString(value: string): Error | void {
        const encoded = new TextEncoder().encode(value);
        const len = encoded.length+1;
        if (!this.hasCapacity(len + 4)) return new Error("Packet out of space");
        this.writeInt32(len);
        this.buffer.set(encoded, this.cursize);
        this.cursize += len;
    }
}