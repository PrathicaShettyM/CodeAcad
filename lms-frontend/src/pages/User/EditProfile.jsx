import { useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { updateProfile } from "../../redux/slices/authSlice";
import { getUserData } from "../../redux/slices/authSlice";

function EditProfile(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [data, setData] = useState({
        fullName: "",
        previewImage: "",
        avatar: undefined,
        userId: useSelector((state) => state?.auth?.data?._id)
    });

    // image upload has 2 steps: 
    // 1. once u upload the image u can preview the image
    // 2. when u send the whole form data to the backend, at tht pt whole img file is sent to the backend

    // image upload and preview
    // send "edited" form data to backend 
    function handleImageUpload(e){
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        // convert the image into base64 url string, because users keeps updating profile pic, we need not store 
        // tht on the server n directly render it as a string url
        if(uploadedImage){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function(){
                setData({
                    ...data,
                    previewImage: this.result,
                    avatar: uploadedImage
                })
            })
        }   
    }
    // is used to update the app, whenever user edits the profile
    function handleInputChange(e){
        const {name, value} = e.target;
        setData({
            ...data,
            [name]: value
        });
    }

    // handle form submission
    async function onFormSubmit(e){
        e.preventDefault();

        // incase of failure
        if(!data.fullName || !data.avatar){
            toast.error("All fields are mandatory");
            return;
        }

        // incase case of success
        if(data.fullName.length < 5){
            toast.error("Name cannot be less than 5 characters");
            return;
        }
        
        // upload the form
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("avatar", data.avatar);

        await dispatch(updateProfile([data.userId, formData]));
        await dispatch(getUserData());

        navigate("/user/profile");

    }

    return(
        <HomeLayout>
        <div className="flex items-center justify-center h-[90vh]">
            <form
                onSubmit={onFormSubmit}
                className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]"
            >
            <h1 className="text-center text-2xl font-semibold">
                Edit Profile
            </h1>
                <label className="cursor-pointer" htmlFor="image_uploads">
                {
                    data.previewImage ? (
                        <img
                            src={data.previewImage}
                            className="w-28 h-28 rounded-full m-auto"
                        />
                    ) : (
                        <BsPersonCircle className="w-28 h-28 rounded-full m-auto"/>
                    )
                }
                </label>
                <input
                    type="file"
                    onChange={handleImageUpload}
                    id="image_uploads"
                    name="image_uploads"
                    accept=".jpg, .png, .svg, .jpeg"
                    className="hidden"
                />

                <div className="flex flex-col gap-1">
                    <label className="text-lg font-semibold" htmlFor="fullName">
                        Full name
                    </label>
                    <input
                        required
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your name"
                        value={data.fullName}
                        className="bg-transparent px-2 py-1 border"
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded-sm py-2 cursor-pointer">
                    Update profile
                </button>
                <Link to="/user/profile">
                    <p className="link text-accent cursor-pointer flex items-center jsutify-center w-full gap-2">
                        Go back to profile
                    </p>
                </Link>
            </form>
        </div>
        </HomeLayout>
    )
}
export default EditProfile;