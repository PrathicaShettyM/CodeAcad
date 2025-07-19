import { Link, useNavigate } from "react-router-dom";

function Denied(){
    const navigate = useNavigate();
    console.log(navigate);
    return(
        <main className="h-screen w-full flex flex-col items-center justify-center bg-[#1a2238]">
            <h1 className="text-9xl font-semibold text-white tracking-widest">
                403
            </h1>
            <div className="bg-black text-white px-2 rounded text-sm rotate-12 absolute">
                Access Denied
            </div>
            <button className="mt-5 ">
                <Link to="/">
                    <span className="relative block px-8 py-3 border-2 border-current bg-orange-500 text-white rounded">
                        Go Back
                    </span> 
                </Link>
            </button>
        </main>
    )
}
export default Denied;