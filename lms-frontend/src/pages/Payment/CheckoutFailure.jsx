import { RxCrossCircled } from "react-icons/rx";
import { Link } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";

function CheckoutFailure() {
  return (
    <HomeLayout>
      <div className="min-h-[90vh] flex items-center justify-center text-white">
        <div className="w-80 h-[28rem] flex flex-col justify-between items-center shadow-[0_0_10px_black] rounded-lg relative bg-[#1f1f1f]">
          {/* Top banner */}
          <h1 className="bg-red-500 w-full py-4 text-2xl font-bold text-center rounded-t-lg">
            Payment Failed
          </h1>

          {/* Content */}
          <div className="px-4 mt-4 flex flex-col items-center justify-center space-y-2">
            <RxCrossCircled className="text-5xl text-red-500" />
            <h2 className="text-lg font-semibold text-center">
              Oops! Something went wrong.
            </h2>
            <p className="text-sm text-center text-gray-300">
              Please try again later or use a different payment method.
            </p>
          </div>

          {/* Bottom banner */}
          <Link
            to="/"
            className="bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-300 w-full py-3 text-center text-white font-semibold rounded-b-lg"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </HomeLayout>
  );
}
export default CheckoutFailure;
