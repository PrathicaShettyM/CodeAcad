import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";

function CourseDescription(){
    
    // using a special hook to get the data from course card component
    const { state } = useLocation();
    const navigate = useNavigate();

    const {role, data} = useSelector((state)=> state.auth);

    useEffect(() => {
        if (!state) {
            navigate("/courses"); // or show error
        }
    }, [state]);


    return(
    <HomeLayout>
        <div className="min-h-[90vh] flex items-center justify-center px-4 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10 border border-gray-400 rounded-2xl shadow-xl bg-opacity-10 bg-white/5 w-full max-w-6xl">
            
            {/* Left side: Thumbnail + Info + Button */}
            <div className="space-y-5">
                <img
                className="w-full h-64 object-cover rounded-lg"
                alt="thumbnail"
                src={state?.thumbnail?.secure_url}
                />
                <div className="space-y-4">
                <div className="text-xl space-y-2">
                    <p className="font-semibold">
                    <span className="font-bold text-yellow-500">Total Lectures: </span>
                    {state?.numberOfLectures}
                    </p>
                    <p className="font-semibold">
                    <span className="font-bold text-yellow-500">Instructor: </span>
                    {state?.createdBy}
                    </p>
                </div>

                {role === "ADMIN" || data?.subscription?.status === "active" ? (
                    <button
                    onClick={() => navigate("/course/displayLectures", { state: { ...state } })}
                    className="bg-green-500 text-white text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-green-700 transition-all"
                    >
                    Watch Lectures
                    </button>
                ) : (
                    <button
                    onClick={() => navigate("/checkout")}
                    className="bg-green-600 text-white text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-green-700 transition-all"
                    >
                    Subscribe
                    </button>
                )}
                </div>
            </div>

            {/* Right side: Title + Description */}
            <div className="space-y-6 text-xl">
                <h1 className="text-3xl font-bold text-yellow-500 text-center">
                {state?.title}
                </h1>
                <div>
                <p className="text-yellow-500 mb-2 font-semibold">
                    Course Description:
                </p>
                <p className="text-gray-200">
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