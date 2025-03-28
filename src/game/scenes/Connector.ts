import Packet from '../../utils/Packet';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { server_packets } from '../../utils/enums';
export class Connector extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    websocket: WebSocket

    constructor ()
    {
        super('Connector');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameText = this.add.text(512, 384, "connecting!", {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.websocket = new WebSocket('ws://127.0.0.1:3000/ws')
        
        this.websocket.onopen = () => {
            this.gameText.text = "connected, waiting for welcome message"

            
        }
        
        
        this.websocket.onmessage = async (event:MessageEvent) => {
           if (event.data instanceof Blob)
           {
                const buffer = await event.data.arrayBuffer()
                const byteArray = new Uint8Array(buffer)
                const msg_packet = new Packet(1024, byteArray)

                //testing time
                const {int32_num: packet_id, err } = msg_packet.readInt32()
                if(err) 
                {
                    console.log(err.message)
                    return;
                }
               
                if(packet_id === server_packets.welcome_packet) {
                    setTimeout(()=> {
                        this.scene.start("Game", {websocket: this.websocket})
                    }, 3000)
                    this.gameText.text = "message recieved, sending you in!"

                }

           }
           else 
           {
            console.log("recieved smth else?")
           }
        }
        
        this.websocket.onerror = () => {
            this.gameText = this.add.text(512, 384, 'Failed!', {
                fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'center'
            }).setOrigin(0.5).setDepth(100);
    
            
            setTimeout(()=> {
                this.scene.start("MainMenu")
            }, 3000)
        }

        EventBus.emit('current-scene-ready', this);


    }

    
}
