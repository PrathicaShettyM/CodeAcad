import { useEffect } from "react";
import toast from "react-hot-toast";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { getRazorPayId, purchaseCourseBundle, verifyUserPayment } from "../../redux/slices/razorpaySlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const razorpayKey = useSelector((state) => state?.razorpay?.key);
  const subscription_id = useSelector((state) => state?.razorpay?.subscription_id);

  const paymentsDetails = {
    razorpay_payment_id: "",
    razorpay_subscription_id: "",
    razorpay_signature: "",
  };

  async function handleSubscription(e) {
    e.preventDefault();
    if (!razorpayKey || !subscription_id) {
      toast.error("Something went wrong!!");
      return;
    }

    const options = {
      key: razorpayKey,
      subscription_id: subscription_id,
      name: "Courses .pvt ltd",
      description: "Subscription",
      theme: {
        color: "#F37254",
      },
      handler: async function (response) {
        paymentsDetails.razorpay_payment_id = response.razorpay_payment_id;
        paymentsDetails.razorpay_subscription_id = response.razorpay_subscription_id;
        paymentsDetails.razorpay_signature = response.razorpay_signature;
        toast.success("Payment successful");

        const res = await dispatch(verifyUserPayment(paymentsDetails));
        res?.payload?.success ? navigate("/checkout/success") : navigate("/checkout/fail");
      },
    };

    const paymentOptions = new window.Razorpay(options);
    paymentOptions.open();
  }

  async function load() {
    await dispatch(getRazorPayId());
    await dispatch(purchaseCourseBundle());
  }

  useEffect(() => {
    load();
  }, []);

  return (
  <HomeLayout>
    <div className="min-h-[90vh] flex items-center justify-center text-white px-4">
      <form
        onSubmit={handleSubscription}
        className="w-full max-w-md bg-[#0e1628] rounded-xl shadow-lg flex flex-col justify-between"
      >
        {/* Header */}
        <div className="bg-yellow-500 rounded-t-xl text-center py-4 text-2xl font-bold text-white">
          Subscription Bundle
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-center text-white">
          <p className="text-base">
            This purchase will allow you to access all the available courses on our platform for
            <span className="font-bold text-yellow-400"> 1 yr duration</span>. All the existing and newly launched courses will be available.
          </p>

          <p className="flex items-center justify-center gap-1 text-3xl font-extrabold text-yellow-400">
            <BiRupee />
            <span>499 only</span>
          </p>

          <div className="text-gray-300 text-sm space-y-1">
            <p>100% refund on cancellation</p>
            <p>Terms and conditions apply *</p>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 transition-all duration-300 text-white text-xl font-bold py-3 rounded-b-xl"
        >
          Buy Now
        </button>
      </form>
    </div>
  </HomeLayout>
);

}

export default Checkout;
