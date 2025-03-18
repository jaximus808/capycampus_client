export default class Player {

    private id : number
    private uname : string
    private pos : Vector2


    constructor(id : number, uname : string, x_pos : number, y_pos : number) {
        this.id = id
        this.uname = uname
        this.pos = new Vector2(x_pos, y_pos)
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

}