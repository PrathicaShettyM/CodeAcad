import { useState } from "react";
import toast from "react-hot-toast";

import axiosInstance from "../config/axiosInstance";
import { isEmail } from "../helper/regexMatcher";
import HomeLayout from "../layout/HomeLayout";

function Contact(){

    const [userInput, setUserInput] = useState({
        name: "",
        email: "",
        message: ""
    });

    function handleInputChange(e){
        const {name, value} = e.target;
        setUserInput({
            ...userInput,
            [name]: value
    })
    }

    async function onFormSubmit(e){
        e.preventDefault();
        if(!userInput.name || !userInput.email || !userInput.message){
            toast.error("All fields are mandatory")
            return;
        }
        if(!isEmail(userInput.email)){
            toast.error("Invalid email provided")
            return;
        }

        try {
            const response = axiosInstance.post("/contact", userInput);
            toast.promise(response, {
                loading: "Submitting your query",
                success: "Form submitted successfully",
                error: "Failed to submit the form"
            });
            // form reset
            const responseData = await response;
            if(responseData?.data){
                setUserInput({
                    name: "",
                    email: "",
                    message: ""
                })
            }
        } catch (error) {
            toast.error("Operation failed!!")
        }
    }
    return(
       <HomeLayout>
            <div className="flex items-center justify-center h-[90vh] bg-gray-800">
                <form onSubmit={onFormSubmit} noValidate className="flex flex-col items-center justify-center gap-2 p-5 w-[22rem] rounded-md text-white border-2">
                    <h1 className="text-3xl font-semibold">Contact Us</h1>
                        <div className="flex flex-col w-full gap-1">
                            <label htmlFor="name" className="text-xl font-semibold ">
                                Name
                            </label>
                            <input
                               id="name"
                               className="border px-2 py-1 rounded-sm  text-white bg-gray-800"
                               type="text"
                               placeholder="Enter your name..."
                               name="name"
                               onChange={handleInputChange}
                               value={userInput.name}
                            />
                        </div>

                        <div className="flex flex-col w-full gap-1">
                            <label htmlFor="email" className="text-xl font-semibold">
                                Email
                            </label>
                            <input
                               id="email"
                               className="border px-2 py-1 rounded-sm text-white bg-gray-800"
                               type="email"
                               placeholder="Enter your email..."
                               name="email"
                               onChange={handleInputChange}
                               value={userInput.email}
                            />
                        </div>

                        <div className="flex flex-col w-full gap-1">
                            <label htmlFor="message" className="text-xl font-semibold ">
                                Message
                            </label>
                            <textarea
                               id="message"
                               className="border px-2 py-1 rounded-sm resize-none h-40 text-white bg-gray-800"
                               type="text"
                               placeholder="Enter your message..."
                               name="message"
                               onChange={handleInputChange}
                               value={userInput.message}
                            />
                        </div>
                        <button type="submit" className="w-full bg-green-400 hover:bg-green-600 transition-all ease-in-out duration-300 text-white py-2 rounded font-semibold text-lg cursor-pointer">
                            Submit
                        </button>
                    </form>
            </div>
       </HomeLayout> 
    )
}
export default Contact;