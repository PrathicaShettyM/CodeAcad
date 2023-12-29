import { useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isEmail, isValidPassword } from "../helper/regexMatcher";
import HomeLayout from "../layout/HomeLayout";
import { createAccount } from "../redux/slices/authSlice";

function Signup(){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [signupdetails, setSignupdetails] = useState({
        email:'',
        fullName: '',
        password: '',
        avatar: ''
    });
    const [previewImage, setPreviewImage] = useState("");


    function handleImage(e){
        e.preventDefault();
        // receive the file present in the 0th index : becoz we are receiving only 1 file
        const uploadedImage = e.target.files[0];
        if(!uploadedImage) return;

        setSignupdetails({
            ...signupdetails,
            avatar: uploadedImage
        });
        // upload image file using built in js function
        const fileReader = new FileReader();
        fileReader.readAsDataURL(uploadedImage);
        fileReader.addEventListener("load", function(){
            setPreviewImage(this.result);
        })
    }

    function handleUserInput(e){
        const {name, value} = e.target;
        setSignupdetails({
            ...signupdetails,
            [name]: value
        })

    }

    async function onFormSubmit(e){
        // to prevent page refresh during form submission
        e.preventDefault();
        console.log(signupdetails);
        if(!signupdetails.email || !signupdetails.password || !signupdetails.fullName){
            toast.error("Please fill all the details");
            return;
        }
        if(signupdetails.fullName.length < 5){
            toast.error("Name should be atleast of 5 characters")
            return;
        }
        if(!isEmail(signupdetails.email)){
            toast.error("Invalid email provided")
            return;
        }
        if(!isValidPassword(signupdetails.password)){
            toast.error("Invalid password provided, password 6-16 characters long with alteast a number and a special character")
            return;
        }

        //serialising the image data
        const formData = new FormData();
        formData.append("fullName", signupdetails.fullName);
        formData.append("email", signupdetails.email);
        formData.append("password", signupdetails.password);
        formData.append("avatar", signupdetails.avatar);


        const response = await dispatch(createAccount(formData));
        console.log(response);

        // redirect to home page after account sign up
        if(response?.payload?.data){
            navigate("/")
        }
        // reset the form
        setSignupdetails({
            email:'',
            fullName: '',
            password: '',
            avatar: ''
            });
        
            setPreviewImage("")

    }

    return(
        <div>
            <HomeLayout>
                <div className="flex overflow-x-auto items-center justify-center h-[90vh]">
                    <form onSubmit={onFormSubmit} noValidate className="flex flex-col items-center justify-center gap-3 rounded-lg px-16 py-8 text-white border-2">
                        <h1 className="text-3xl text-center font-bold">Registration Page</h1>
                        <label htmlFor="image_uploads" className="cursor-pointer">
                            {previewImage ? (
                                <img src={previewImage} className="w-24 h-24 rounded-full m-auto"/>
                            ): (
                                <BsPersonCircle className="w-24 h-24 rounded-full m-auto"/>
                            )}
                        </label>

                        <input
                                onChange={handleImage}
                                type="file"
                                className="hidden"
                                name="image_uploads"
                                id="image_uploads"
                                accept=".jpg, .jpeg, .png, .svg"
                        />
                        
                        <div className="flex flex-col gap-1">
                            <label htmlFor="fullName">Name</label>
                            <input
                                onChange={handleUserInput}
                                value={signupdetails.fullName}
                                required
                                type="text"
                                name="fullName"
                                id="fullName"
                                className="bg-transparent px-2 py-1 border"
                                placeholder="Enter your username ..."
                            />   
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={handleUserInput}
                                value={signupdetails.email}
                                required
                                type="text"
                                name="email"
                                id="email"
                                className="bg-transparent px-2 py-1 border"
                                placeholder="Enter your email ..."
                            />    
                        </div>

                        <div className="flex flex-col gap-1">
                        <label htmlFor="password">Password</label>
                        <input
                                onChange={handleUserInput}
                                value={signupdetails.password}
                                required
                                type="password"
                                name="password"
                                id="password"
                                className="bg-transparent px-2 py-1 border"
                                placeholder="Enter your password ..."
                        />  
                        </div>
                        <button className="mt-2 px-2 py-2 rounded bg-green-500 hover:bg-green-700 transition-all ease-in-out duration-300 font-semibold cursor-pointer text-lg">
                            Create account
                        </button>
                        <p className="">
                            Already have an account? <Link to="/signin" className="cursor-pointer text-accent font-semibold">Login</Link>
                        </p>
                    </form>
                </div>
            </HomeLayout>
        </div>
    )
}
export default Signup;