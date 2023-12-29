import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import createNewCourse from "../../redux/slices/courseSlices.js"

function CreateCourse(){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        title: "",
        description: "",
        category: "",
        createdBy: "",
        thumbnail: null,
        previewImage: ""      
    })

    function handleImageUpload(e){
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if(uploadedImage){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function(){
                setUserInput({
                    ...userInput,
                    thumbnail: uploadedImage,
                    previewImage: this.result
                })
            })
        }
    }

    function handleUserInput(e){
        const {name, value} = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    async function onFormSubmit(e){
        e.preventDefault();
        if(!userInput.title || !userInput.description || !userInput.createdBy || !userInput.category || !userInput.thumbnail){
            toast.error("All fields are mandatory")
            return;
        }

        const response = await dispatch(createNewCourse(userInput))
        if(response?.payload?.success){
            setUserInput({
                title: "",
                description: "",
                category: "",
                createdBy: "",
                thumbnail: null,
                previewImage: ""   
            })
            navigate("/courses")
        }
    }

    return(
        <HomeLayout>
            <div className="h-[100vh] flex items-center justify-center">
                <form 
                    onSubmit={onFormSubmit}
                    className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_black] relative"
                >
                <Link 
                    onClick={() => navigate(-1)}
                    className="absolute top-8 text-2xl link text-accent cursor-pointer">
                    <AiOutlineArrowLeft/>
                </Link>
                <h1 className="text-center text-2xl font-bold">Create new course</h1>
                
                <main className="grid grid-cols-2 gap-x-10 p-6">
                {/* left */}
                    <div className="gap-y-6">
                        <div>
                            <label htmlFor="image_uploads" className="cursor-pointer">
                            {userInput?.previewImage ? (
                                <img 
                                    src={userInput?.previewImage}
                                    className="w-full h-44 m-auto border"
                                />
                                ): (
                                <div className="w-full h-44 m-auto flex items-center justify-center border">
                                    <h1 className="font-bold text-lg">Upload course thumbnail</h1>
                                </div>
                            )}
                            </label>
                            <input
                                type="file"
                                className="hidden"
                                id="image_uploads"
                                accept=".jpg, .jpeg, .svg, .png"
                                name="image_uploads"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="title" className="text-lg font-semibold mt-6">Course Title</label>
                            <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter the title of the course.."
                                    onChange={handleUserInput}
                                    className="bg-transparent border px-4 py-1"
                                    value={userInput.title}
                            />
                        </div>
                    </div>
                    {/* right */}
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col gap-1">
                        <label htmlFor="createdBy" className="text-lg font-semibold">Course Instructor</label>
                        <input
                                required
                                type="text"
                                name="createdBy"
                                id="createdBy"
                                placeholder="Enter the instructor of the course.."
                                onChange={handleUserInput}
                                className="bg-transparent border px-4 py-1"
                                value={userInput.createdBy}
                        />
                        </div>

                        
                        <div className="flex flex-col gap-1">
                        <label htmlFor="category" className="text-lg font-semibold">Category</label>
                        <input
                                required
                                type="text"
                                name="category"
                                id="category"
                                placeholder="Enter the instructor of the course.."
                                onChange={handleUserInput}
                                className="bg-transparent border px-4 py-1"
                                value={userInput.category}
                        />
                        </div>
              
                    <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="text-lg font-semibold">Description</label>
                    <input
                            required
                            type="text"
                            name="description"
                            id="description"
                            placeholder="Enter the course description..."
                            onChange={handleUserInput}
                            className="bg-transparent border px-4 py-1 h-24 resize-none overflow-y-scroll "
                            value={userInput.description}
                    />
                    </div>
               
                    </div>   
                </main>
                <button
                    type="submit"
                    className="bg-green-600 py-1 rounded font-semibold text-lg cursor-pointer hover:bg-green-700 transition-all ease-in-out duration-300"
                    
                    >Create Course</button>
                </form>

            </div>
        </HomeLayout>
    )
}
export default CreateCourse;