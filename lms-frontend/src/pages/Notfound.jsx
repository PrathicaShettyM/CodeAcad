import { Link, useNavigate } from "react-router-dom";

function Notfound(){
    const navigate = useNavigate();
    console.log(navigate);
    return(
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#1a2238]">
            <h1 className="text-9xl font-extrabold text-white">404</h1>
            <div className="bg-black text-white absolute px-2 py-1 rounded text-sm rotate-12">
                Page not found ...
            </div>
            <button className="mt-4">
            <Link to="/">
                <a href="" className="relative inline-block text-sm font-medium text-[#ff6a3d] active:text-yellow-500 focus:outline-none">
                    <span className="relative block px-8 py-3 bg-[#1a2238] border-2 border-current rounded">Go back</span>
                </a>
            </Link>    
            </button>   
        </div>
    )
}
export default Notfound;