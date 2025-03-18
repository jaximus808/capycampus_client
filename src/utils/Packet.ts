export default class Packet {
    private buffer: Uint8Array;
    private capacity: number;
    private cursize: number;
    private pointer: number;

    constructor(capacity: number = 1024, buffer?: Uint8Array) {
        this.capacity = capacity;
        this.cursize = buffer ? buffer.length : 0;
        this.pointer = 0;
        this.buffer = buffer || new Uint8Array(capacity);
    }

    getBuffer(): Uint8Array {
        return this.buffer;
    }

    private hasCapacity(offset: number): boolean {
        return this.cursize + offset <= this.capacity;
    }

    readInt32(): number | Error {
        if (this.pointer + 4 > this.cursize) {
            return new Error("Out of bounds");
        }
        const value = new DataView(this.buffer.buffer).getInt32(this.pointer, false);
        this.pointer += 4;
        return value;
    }

    readInt64(): number | Error {
        if (this.pointer + 8 > this.cursize) {
            return new Error("Out of bounds");
        }
        const value = new DataView(this.buffer.buffer).getBigInt64(this.pointer, false);
        this.pointer += 8;
        return Number(value);
    }

    readFloat32(): number | Error {
        if (this.pointer + 4 > this.cursize) {
            return new Error("Out of bounds");
        }
        const value = new DataView(this.buffer.buffer).getFloat32(this.pointer, false);
        this.pointer += 4;
        return value;
    }

    readFloat64(): number | Error {
        if (this.pointer + 8 > this.cursize) {
            return new Error("Out of bounds");
        }
        const value = new DataView(this.buffer.buffer).getFloat64(this.pointer, false);
        this.pointer += 8;
        return value;
    }

    readString(): string | Error {
        const strLen = this.readInt32();
        if (strLen instanceof Error || this.pointer + strLen > this.cursize) {
            return new Error("Out of bounds");
        }
        const text = new TextDecoder().decode(this.buffer.slice(this.pointer, this.pointer + strLen));
        this.pointer += strLen;
        return text;
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
        const len = encoded.length;
        if (!this.hasCapacity(len + 4)) return new Error("Packet out of space");
        this.writeInt32(len);
        this.buffer.set(encoded, this.cursize);
        this.cursize += len;
    }
}