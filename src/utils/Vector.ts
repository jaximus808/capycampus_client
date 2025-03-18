class Vector2 {

    public x : number
    public y : number

    constructor(x : number, y : number)
    {
        this.x = x
        this.y = y
    }

    public update(new_x : number, new_y : number)  {
        this.x = new_x
        this.y = new_y
    }

    public updateV(vec : Vector2)  {
        this.x = vec.x
        this.y = vec.y
    }

    public mag() : number {
        return Math.sqrt(this.x**2 + this.y**2)
    }
    
    public norm() : Vector2 {
    
        const _mag = this.mag()
        return new Vector2(this.x/_mag, this.y/_mag)
    }
    
    public Add(delta_vec : Vector2) : Vector2 {
        this.x += delta_vec.x
        this.y += delta_vec.y
        return new Vector2(this.x, this.y)
    }

    public Addc(delta_vec : Vector2) : Vector2 {

        const vec = new Vector2(this.x, this.y)
        vec.x += delta_vec.x
        vec.y += delta_vec.y
        return vec
    }

    public Sub(delta_vec : Vector2) : Vector2 {
        this.x -= delta_vec.x
        this.y -= delta_vec.y
        return new Vector2(this.x, this.y)
    }

    public Subc(delta_vec : Vector2) : Vector2 {

        const vec = new Vector2(this.x, this.y)
        vec.x -= delta_vec.x
        vec.y -= delta_vec.y
        return vec
    }

    public Scale(scaler : number) : Vector2 {
        this.x *= scaler
        this.y *= scaler
        return new Vector2(this.x, this.y)
    }

    public Scalec(scaler : number) : Vector2 {

        const vec = new Vector2(this.x, this.y)
        vec.x *= scaler
        vec.y *= scaler
        return vec
    }
}