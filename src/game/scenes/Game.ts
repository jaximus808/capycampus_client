import Packet from '../../utils/Packet';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    websocket: WebSocket
    cursor: Phaser.Types.Input.Keyboard.CursorKeys | undefined

    constructor ()
    {
        super('Game');
    }
    //make type later
    init(data: any) {
        this.websocket = data.websocket
    }

    create ()
    {

        this.input.on('pointerdown', (pointer : any) => {
            console.log(`Mouse clicked at: X=${pointer.x}, Y=${pointer.y}`);
        });
        // this.cursor = this.input.keyboard?.createCursorKeys();
        // if (!this.cursor) {
        //     window.alert("u need a keyboard gang lol")
        //     this.scene.start("MainMenu")
        // }
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
           if (event.data instanceof Blob)
           {
                const buffer = await event.data.arrayBuffer()
                const byteArray = new Uint8Array(buffer)
                console.log(byteArray)
                const msg_packet = new Packet(1024, byteArray)

                //testing time
                const packet_id = msg_packet.readInt32()

                //instantiate players
                switch (packet_id) {
                    case 1: 
                        const player_count = msg_packet.readInt64()

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

        EventBus.emit('current-scene-ready', this);


    }

    leaveGame ()
    {
        this.scene.start('MainMenu');
    }
}
