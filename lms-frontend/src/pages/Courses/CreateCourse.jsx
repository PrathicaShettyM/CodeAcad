import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useLocation,useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { createNewCourse, updateCourse } from "../../redux/slices/courseSlice";

function CreateCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const initialCourseData = location.state?.initialCourseData || { newCourse: true };

    const [isDisabled, setIsDisabled] = useState(!initialCourseData?.newCourse);

    const [userInput, setUserInput] = useState({
        title: initialCourseData?.title || "",
        category: initialCourseData?.category || "",
        createdBy: initialCourseData?.createdBy || "",
        description: initialCourseData?.description || "",
        thumbnail: null,
        previewImage: initialCourseData?.thumbnail?.secure_url || "",
    });

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                setUserInput(prev => ({
                    ...prev,
                    thumbnail: file,
                    previewImage: event.target.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    }

    function handleUserInput(e) {
        const { name, value } = e.target;
        setUserInput(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        const { title, category, createdBy, description, thumbnail } = userInput;

        if (!title || !category || !createdBy || !description || (initialCourseData.newCourse && !thumbnail)) {
            toast.error("All fields are mandatory");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("createdBy", createdBy);
        formData.append("description", description);

        if (initialCourseData.newCourse) {
            formData.append("thumbnail", thumbnail);
        }

        let res;
        if (initialCourseData.newCourse) {
            res = await dispatch(createNewCourse(formData));
        } else {
            formData.append("courseId", initialCourseData._id);
            res = await dispatch(updateCourse(formData));
        }

        if (res?.payload?.success) {
            toast.success(res.payload.message);
            setUserInput({
                title: "",
                category: "",
                createdBy: "",
                description: "",
                thumbnail: null,
                previewImage: "",
            });
            setIsDisabled(false);
            navigate("/admin/dashboard");
        }
    }

    return (
        <HomeLayout>
            <div className="h-[100vh] flex items-center justify-center">
                <form
                    onSubmit={onFormSubmit}
                    className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_black] relative"
                >
                    <Link
                        to={"/admin/dashboard"}
                        className="absolute top-8 text-2xl link text-accent cursor-pointer"
                    >
                        <AiOutlineArrowLeft />
                    </Link>

                    <h1 className="text-center text-2xl font-bold">
                        {!initialCourseData.newCourse ? "Update" : "Create new"}{" "}
                        <span>Course</span>
                    </h1>

                    <main className="grid grid-cols-2 gap-x-10 p-6">
                        <div className="space-y-6">
                            <div
                                onClick={() =>
                                    !initialCourseData.newCourse
                                        ? toast.error("Cannot update thumbnail image")
                                        : ""
                                }
                            >
                                <label htmlFor="image_uploads" className="cursor-pointer">
                                    {userInput?.previewImage ? (
                                        <img
                                            src={userInput.previewImage}
                                            className="w-full h-44 m-auto border"
                                            alt="Course Preview"
                                        />
                                    ) : (
                                        <div className="w-full h-44 m-auto flex items-center justify-center border">
                                            <h1 className="font-bold text-lg">
                                                Upload your course thumbnail
                                            </h1>
                                        </div>
                                    )}
                                </label>
                                <input
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    type="file"
                                    id="image_uploads"
                                    name="thumbnail"
                                    accept=".jpg, .jpeg, .svg, .png"
                                    disabled={isDisabled}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="title" className="text-lg font-semibold mt-6">
                                    Course Title
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter the title of the course.."
                                    className="bg-transparent border px-4 py-1"
                                    value={userInput.title}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="createdBy" className="text-lg font-semibold">
                                    Course Instructor Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter the instructor name..."
                                    className="bg-transparent border px-4 py-1"
                                    value={userInput.createdBy}
                                    onChange={handleUserInput}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="category" className="text-lg font-semibold">
                                    Category
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter the category of the course..."
                                    className="bg-transparent border px-4 py-1"
                                    value={userInput.category}
                                    onChange={handleUserInput}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="description" className="text-lg font-semibold">
                                    Course Description
                                </label>
                                <textarea
                                    required
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description..."
                                    className="bg-transparent border px-4 py-1 h-24 resize-none overflow-y-scroll"
                                    value={userInput.description}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>
                    </main>

                    <button
                        type="submit"
                        className="bg-green-600 py-1 rounded font-semibold text-lg cursor-pointer hover:bg-green-700 transition-all ease-in-out duration-300"
                    >
                        {!initialCourseData.newCourse ? "Update Course" : "Create Course"}
                    </button>
                </form>
            </div>
        </HomeLayout>
    );
}

export default CreateCourse;