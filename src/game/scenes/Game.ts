import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    websocket: WebSocket

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
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameText = this.add.text(512, 384, "waiting for message!", {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        
        this.websocket.onmessage = (event:MessageEvent) => {
            this.gameText.text = event.data
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
