import Vector2 from "../../utils/Vector";

export default class Player {

    private id : number
    private uname : string
    private pos : Vector2
    private isLocal : boolean

    private playerName : Phaser.GameObjects.Text
    sprite: Phaser.Physics.Arcade.Sprite;


    constructor(scene: Phaser.Scene, id : number, uname : string, x_pos : number, y_pos : number, is_local: boolean) {
        this.id = id
        this.uname = uname
        this.pos = new Vector2(x_pos, y_pos)
        this.isLocal = is_local
        this.sprite = scene.physics.add.sprite(this.pos.x, this.pos.y, "player_test"); // Ensure "player" is preloaded
        this.playerName = scene.add.text(x_pos, y_pos + 50, `${uname}${is_local ? " (you)" : ""}`, {
            fontSize: '16px',
            color: 'black',
            padding: { x: 4, y: 2 }
        });
        this.playerName.setOrigin(0.5, 1);
        this.sprite.setDisplaySize(100, 100);
        this.sprite.setSize(100, 100);
    }

    public get_name() : string {
        return this.uname
    }

    public get_id() : number {
        return this.id
    }

    public get_pos() : Vector2 {
        return structuredClone(this.pos)
    }

    public moveTo(new_x : number, new_y : number) : Vector2 {
        this.pos.update(new_x, new_y)
        return structuredClone(this.pos)
    }

    public moveToV(new_vec : Vector2) : Vector2 {
        this.pos.updateV(new_vec)
        return structuredClone(this.pos)
    }

    public move(delta_x : number, delta_y : number) : Vector2 {
        this.pos.x += delta_x
        this.pos.y += delta_y
        return structuredClone(this.pos)
    }

    public moveV(new_vec : Vector2): Vector2  {
        this.pos.Add(new_vec)
        return structuredClone(this.pos)
    }

    public update(_time: number, _delta: number) {
        this.sprite.setPosition(
            this.pos.x,
            this.pos.y
        )
        this.playerName.setPosition(this.pos.x, this.pos.y + 50)
    }
    
    public delete() {
        this.sprite.destroy()
        this.playerName.destroy()
    }
    

}