import Packet from "../../utils/Packet";

import { client_packets } from "../../utils/enums";

export default class MsgFactory {
    static createReadyPacket(): Packet { 
        const packet = new Packet(256) 
        console.log("WTF?")
        console.log(packet.getBuffer())
        packet.writeInt32(client_packets.ready)  
        console.log(packet.getBuffer())
        packet.writeString("test gangster")  
        return packet
    }
    static createMovePacket(x_mouse_pos: number, y_mouse_pos: number): Packet { 
        const packet = new Packet(256)
        packet.writeInt32(client_packets.move)              
        packet.writeFloat64(x_mouse_pos)
        packet.writeFloat64(y_mouse_pos)
        return packet
    }
}