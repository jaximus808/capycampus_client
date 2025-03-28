import Packet from '../../utils/Packet';
import { server_packets } from '../../utils/enums';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import GameManager from '../gameplay/gamemanager';
import MsgFactory from '../gameplay/msgfactory';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    websocket: WebSocket
    cursor: Phaser.Types.Input.Keyboard.CursorKeys | undefined
    gameManager: GameManager
    localPlayerId: number

    constructor ()
    {
        super('Game');
        this.localPlayerId = -1
    }
    //make type later
    init(data: any) {
        this.websocket = data.websocket
    }

    create ()
    {
        this.gameManager = new GameManager()

        this.input.on('pointerdown', (pointer : any) => {
         
            if(this.localPlayerId === -1) return;
            const packet = MsgFactory.createMovePacket( pointer.x, pointer.y)
            this.websocket.send(packet.getBuffer())
        });
       
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameText = this.add.text(512, 384, "waiting for message!", {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // i need to make this mf a seperate class asap gang

        // put this in the game manager class, im too lazy for this shit 
        
        this.websocket.onmessage = async (event:MessageEvent) => {
           if (event.data instanceof Blob) {
                
                const buffer = await event.data.arrayBuffer()
                const byteArray = new Uint8Array(buffer)
                const msg_packet = new Packet(1024, byteArray)

                //testing time
                const {int32_num: packet_id, err} = msg_packet.readInt32()
                if (err) {
                    console.log("failed to read packet id")
                    return
                }
                //instantiate players
                switch (packet_id) {
                    case server_packets.gameinfo_packet: 
                        const {int32_num: local_id, err: local_id_err }  = msg_packet.readInt32()
                        if(local_id_err) 
                        {
                            console.log("failed to set local player id")
                            return
                        }

                        this.localPlayerId = local_id
                        const {int32_num: player_count, err: player_cont_err}  = msg_packet.readInt32()
                        if (player_cont_err) {
                            console.log("failed to read player count")
                            return
                        }
                        for (let i = 0; i < player_count; i++)
                        {
                            const {int32_num: player_id, err: player_id_err }  = msg_packet.readInt32()
                            const {string_val: player_uname, err: player_uname_err }  = msg_packet.readString()
                            const {float64_num: x_pos, err: x_err }  = msg_packet.readFloat64()
                            const {float64_num: y_pos, err: y_err }  = msg_packet.readFloat64()
                            if(player_id_err || player_uname_err || x_err || y_err) {
                                console.log("failed to read player info")
                                return
                            }
                            const err_add = this.gameManager.addPlayer(
                                player_id, 
                                this.scene.scene,
                                player_uname, 
                                x_pos,
                                y_pos,
                                player_id == local_id
                            )
                            if (err_add) {
                                console.log("faield to add player", err_add.message)
                            }
                        }
                        
                        this.gameText.destroy()
                        break;

                    case server_packets.client_join:
                        const {int32_num: player_id, err: player_id_err }  = msg_packet.readInt32()
                        const {string_val: player_uname, err: player_uname_err }  = msg_packet.readString()
                        const {float64_num: x_pos, err: x_err }  = msg_packet.readFloat64()
                        const {float64_num: y_pos, err: y_err }  = msg_packet.readFloat64()
                        if(player_id_err || player_uname_err || x_err || y_err) {
                            console.log("failed to read player info")
                            return
                        }
                        const err_add = this.gameManager.addPlayer(
                            player_id, 
                            this.scene.scene,
                            player_uname, 
                            x_pos,
                            y_pos,
                            false
                        )
                        if (err_add) {
                            console.log("faield to add player:", err_add.message)
                        }
                        break
                    case server_packets.client_leave: 
                        const {int32_num: delete_ply_id, err: delete_ply_id_err }  = msg_packet.readInt32()
                        if(delete_ply_id_err) {
                            console.log("failed to read player info")
                            return
                        }
                        const err_del = this.gameManager.removePlayer(delete_ply_id)
                        if (err_del) {
                            console.log("faield to delete player:", err_del.message)
                        }
                        console.log("deleted user")
                        break
                    case server_packets.create_move_packet: 
                        const {int32_num: move_p_id, err: move_id_err }  = msg_packet.readInt32()
                        const {float64_num: x_new_pos, err: x_new_err }  = msg_packet.readFloat64()
                        const {float64_num: y_new_pos, err: y_new_err }  = msg_packet.readFloat64()
                        if(move_id_err || x_new_err || y_new_err) {
                            console.log("failed to move player")
                            return
                        }
                        const err_mov = this.gameManager.movePlayer(move_p_id, x_new_pos, y_new_pos )
                        if (err_mov) {
                            console.log("faield to delete player:", err_mov.message)
                        }
                        break
                    default:
                        console.log(`Packet id not reconized ${packet_id}`)
                        return
                }
           }
           else 
           {
            console.log("recieved smth else?")
           }
        }
        
        this.websocket.onclose = () => {
            this.gameText.text = "closed!"
        }
        //lol okay i need to abstrat this
        const ready_packet = MsgFactory.createReadyPacket(this.registry.get("username")) 

        this.websocket.send(ready_packet.getBuffer())
        EventBus.emit('current-scene-ready', this);


    }
    update(time: number, delta: number) 
    {
        this.gameManager.updateGame(time, delta)

    }

    leaveGame ()
    {
        this.scene.start('MainMenu');
    }
}
