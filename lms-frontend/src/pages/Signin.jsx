import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isEmail } from "../helper/regexMatcher";
import HomeLayout from "../layout/HomeLayout";
import { login } from "../redux/slices/authSlice";

function Signin(){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [signindetails, setSignindetails] = useState({
        email:'',
        password: '',
    });

    function handleUserInput(e){
        const {name, value} = e.target;
        setSignindetails({
            ...signindetails,
            [name]: value
        })
    }

    async function onFormSubmit(e){
        e.preventDefault();
        if(!signindetails.email || !signindetails.password){
            toast.error("Please fill all the details");
            return;
        }
        if(!isEmail(signindetails.email)){
            toast.error("Invalid email provided")
            return;
        }

        const response = await dispatch(login(signindetails));
        if(response?.payload?.data){
            navigate("/")
        }

        setSignindetails({
            email:'',
            password: '',
        });
    }

    return (
        <HomeLayout>
            <div className="flex overflow-x-auto items-center justify-center h-[90vh]">
                <form onSubmit={onFormSubmit} noValidate className="flex flex-col items-center justify-center gap-3 rounded-lg px-16 py-8 text-white border-2">
                    <h1 className="text-3xl text-center font-bold mb-3">Login Page</h1>
                    
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={handleUserInput}
                            value={signindetails.email}
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
                            value={signindetails.password}
                            required
                            type="password"
                            name="password"
                            id="password"
                            className="bg-transparent px-2 py-1 border"
                            placeholder="Enter your password ..."
                        />
                    </div>

                    {/* 🔐 Forgot Password Link */}
                    <div className="w-full text-right text-sm">
                        <Link to="/forgetpassword" className="text-yellow-400 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button className="mt-2 px-8 py-2 rounded bg-green-500 hover:bg-green-700 transition-all ease-in-out duration-300 font-semibold cursor-pointer text-lg">
                        Sign In
                    </button>

                    <p>
                        Don't have an account?{" "}
                        <Link to="/signup" className="cursor-pointer text-accent font-semibold">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </HomeLayout>
    );
}

export default Signin;
