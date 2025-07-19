import { useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { getUserData } from "../../redux/slices/authSlice";

function CheckoutSuccess() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] flex items-center justify-center text-white">
        <div className="w-80 h-[28rem] flex flex-col justify-between items-center shadow-[0_0_10px_black] rounded-lg relative bg-[#1f1f1f]">
          {/* Top banner */}
          <h1 className="bg-green-500 w-full py-4 text-2xl font-bold text-center rounded-t-lg">
            Payment Successful
          </h1>

          {/* Content */}
          <div className="px-4 mt-4 flex flex-col items-center justify-center space-y-2">
            <AiFillCheckCircle className="text-5xl text-green-500" />
            <h2 className="text-lg font-semibold text-center">
              Welcome to the Pro Bundle!
            </h2>
            <p className="text-sm text-center text-gray-300">
              You now have access to all premium content.
            </p>
          </div>

          {/* Bottom banner */}
          <Link
            to="/"
            className="bg-green-500 hover:bg-green-600 transition-all ease-in-out duration-300 w-full py-3 text-center text-white font-semibold rounded-b-lg"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </HomeLayout>
  );
}
export default CheckoutSuccess;
