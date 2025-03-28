import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from '../game/PhaserGame';
import { MainMenu } from '../game/scenes/MainMenu';
import { Game } from '../game/scenes/Game';

function GamePage()
{
    // The sprite can only be moved in the MainMenu Scene

    const [joined, SetJoined] = useState<boolean>(false)
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const [username, setUsername] = useState<string>("")
    const [responseMsg, setResponseMsg] = useState<string>("")

    const LeaveGame = () => {
        if(phaserRef.current) {
            const scene = phaserRef.current.scene as Game;
            if(scene) {
                scene.leaveGame();
            }
        }
    }
    const JoinGame = () => {
        if (username.trim() == "") {
            setResponseMsg("please enter a username")
            return
        }
        setResponseMsg("")
        if(phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenu;
            if(scene) {
                scene.joinGame(username);
            }
        }
    }



    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {

        if(scene.scene.key === 'MainMenu') {
            SetJoined(false)
        }
        else
        {
            SetJoined(true)
        }

        
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
                <div>
                    {(joined) ? 
                        <button className="button" onClick={LeaveGame}>Leave</button> 
                        :  
                        <div>
                            <input value={username} onChange={(e) => setUsername(e.currentTarget.value)} placeholder='set username...'/>
                            <button className="button" onClick={JoinGame}>Join</button>
                        </div>
                    
                    }
                   
                </div>
                <div>{responseMsg}</div>
                
                   
                
            </div>
        </div>
    )
}

export default GamePage
