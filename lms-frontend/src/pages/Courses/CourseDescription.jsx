import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";

function CourseDescription(){
    
    // using a special hook to get the data from course card component
    const { state } = useLocation();
    const navigate = useNavigate();

    const {role, data} = useSelector((state)=> state.auth);

    return(
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 px-20 flex flex-col items-center justify-center text-white">
                <div className="grid grid-cols-2 gap-10 py-10 relative">
                    <div className="space-y-5">
                        <img
                            className="w-full h-64"
                            alt="thumbnail"
                            src={state?.thumnail?.secure_url}
                        />
                        <div className="space-y-4">
                            <div className="flex flex-col items-center justify-between text-xl">
                                <p className="font-semibold">
                                    <span className="font-bold text-yellow-500">Total Lectures : {" "}</span>{state?.numberOfLectures}
                                </p>
                                <p className="font-semibold">
                                    <span className="font-bold text-yellow-500">Instructor : {" "}</span>{state?.createdBy}
                                </p>
                            </div>

                            {role === "ADMIN" || data?.subscription?.status === "active"? (
                                <button 
                                    onClick={()=> navigate("/course/displayLectures", {state: {...state}})}
                                    className="bg-green-500 text-white text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-green-700 transition-all ease-in-out">
                                        Watch Lectures
                                </button>
                                ):(<button
                                    onClick={()=> navigate("/checkout")}
                                    className="bg-green-600 text-white text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-green-700 transition-all ease-in-out">
                                        Subscribe
                                    </button>)}
                        </div>
                            {/*Right side of the grid*/}
                        <div className="space-y-2 text-xl">
                            <h1 className="text-3xl font-bold text-yellow-500 mb-5 text-center">
                                    {state?.title}
                            </h1>
                            <p className="text-yellow-500">
                                Course Description: {" "}
                            </p>
                            <p>
                                {state?.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}
export default CourseDescription;