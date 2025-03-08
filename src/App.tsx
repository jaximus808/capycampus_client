import { BrowserRouter, Routes, Route } from "react-router"

import Landing from "./pages/Landing"
import GamePage from "./pages/GamePage"

function App()
{

    return ( 
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing/>}></Route>
                <Route path="/game" element={<GamePage/>}></Route>
            </Routes>
        </BrowserRouter>
    )

}

export default App
