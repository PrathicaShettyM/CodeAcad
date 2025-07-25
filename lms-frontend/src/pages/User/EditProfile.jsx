import { useEffect,useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { getUserData,updateProfile } from "../../redux/slices/authSlice";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state?.auth?.data);
  const userId = userData?._id;

  const [data, setData] = useState({
    fullName: "",
    previewImage: "",
    avatar: undefined,
  });

  // Pre-fill form when user data is available
  useEffect(() => {
    if (userData) {
      setData({
        fullName: userData.fullName || "",
        previewImage: userData.avatar?.secure_url || "",
        avatar: undefined, // Start fresh for new upload
      });
    }
  }, [userData]);

  // Handle image upload and preview
  function handleImageUpload(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setData((prev) => ({
          ...prev,
          previewImage: this.result,
          avatar: uploadedImage,
        }));
      });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Submit updated data
  async function onFormSubmit(e) {
    e.preventDefault();

    if (!data.fullName || !data.avatar) {
      toast.error("All fields are mandatory");
      return;
    }

    if (data.fullName.length < 5) {
      toast.error("Name cannot be less than 5 characters");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("avatar", data.avatar);

      await dispatch(updateProfile([userId, formData])).unwrap();
      await dispatch(getUserData());

      toast.success("Profile updated successfully");
      navigate(`/user/${userId}`);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Profile update failed");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[90vh]">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-semibold">Edit Profile</h1>

          <label className="cursor-pointer" htmlFor="image_uploads">
            {data.previewImage ? (
              <img
                src={data.previewImage}
                className="w-28 h-28 rounded-full m-auto"
                alt="Preview"
              />
            ) : (
              <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
            )}
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

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded-sm py-2 cursor-pointer"
          >
            Update Profile
          </button>

          <Link to={`/user/${userId}`}>
            <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
              Go back to profile
            </p>
          </Link>
        </form>
      </div>
    </HomeLayout>
  );
}

export default EditProfile;