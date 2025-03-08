import { useNavigate } from "react-router";

const App = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5E8C7] text-[#4B3F2F] p-6">
            
            <img src="/assets/capy_placeholder.png"></img>
            <h1 className="text-5xl font-extrabold mb-6 text-center text-[#A67C52]">Welcome to <span className="underline">CapyCampus!</span></h1>
            <p className="text-lg text-[#5C4A3D] mb-8 max-w-md text-center">
                Explore a fun, social world inspired by Club Penguin—where capybaras rule the campus!
            </p>
            <button 
                onClick={() => navigate('/game')}
                className="px-6 py-3 bg-[#D9A066] text-white rounded-2xl shadow-lg hover:bg-[#C68B59] transition-transform transform hover:scale-105 border-2 border-[#8C5A2B] hover:cursor-pointer"
            >
                Enter the Campus
            </button>
        </div>
    );
}
export default App;