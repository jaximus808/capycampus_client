
import Player from "./player"
import Vector2 from "../../utils/Vector"
export default class GameManager {

    public players: Map<number, Player>

    constructor() {
    
        this.players = new Map<number, Player>()

    }

    public addPlayer(id: number, scene: Phaser.Scene, uname: string, x_pos: number, y_pos: number): Error | undefined {

        if(this.players.has(id)) {
            return new Error(`player of id ${id} alr exists`)
        }
        this.players.set(id, 
            new Player(
                scene,
                id,
                uname,
                x_pos,
                y_pos
            )
        )
        return undefined
    }

    public removePlayer(id: number) : Error | undefined {
        if(!this.players.has(id)) {
            return new Error(`player of id ${id} doesn't exists`)
        }
        this.players.delete(id)
        return undefined
    }   

    public movePlayer(id: number, new_x: number, new_y: number): Error | undefined {
        if(!this.players.has(id)) {
            return new Error(`player of id ${id} doesn't exists`)
        }
        this.players.get(id)?.moveToV(new Vector2(new_x, new_y))
        return undefined
    }


    public updateGame(time: number, delta: number)
    {
        for(const [_, player ] of this.players) {
            player.update(time, delta)
        }
    }



}