import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import { addCourseLecture } from "../../redux/slices/lectureSlice";

function AddLecture() {
  const location = useLocation();
  const courseDetails = location?.state;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    id: "",
    lecture: null,
    title: "",
    description: "",
    videoSrc: ""
  });

  useEffect(() => {
    if (!courseDetails?._id) {
      toast.error("Invalid course details");
      navigate("/course");
      return;
    }
    setUserInput((prev) => ({ ...prev, id: courseDetails._id }));
  }, [courseDetails, navigate]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleVideo(e) {
    const video = e.target.files[0];
    if (video) {
      const src = URL.createObjectURL(video);
      setUserInput((prev) => ({
        ...prev,
        lecture: video,
        videoSrc: src
      }));
    }
  }

  async function onFormSubmit(e) {
  e.preventDefault();
  const { lecture, title, description, id } = userInput;

  if (!lecture || !title || !description) {
    toast.error("All fields are mandatory");
    return;
  }

  const res = await dispatch(addCourseLecture({ id, title, description, lecture }));

  if (res?.payload?.success) {
    toast.success("Lecture added successfully!");

    // Reset form after success
    setUserInput({
      id,
      lecture: null,
      title: "",
      description: "",
      videoSrc: ""
    });

    // Optional: trigger video cleanup
    URL.revokeObjectURL(userInput.videoSrc);

    // stay on same page — already handled
  } else {
    toast.error(
      typeof res?.payload === "string"
        ? res.payload
        : res?.payload?.message || "Failed to add lecture"
    );
  }
}


  return (
    <HomeLayout>
      <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-15">
        <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-96 rounded-lg px-4">
          <header className="flex items-center justify-center relative">
            <button
              className="absolute left-2 text-xl text-green-500"
              onClick={() => navigate("/admin/dashboard")}
            >
              <AiOutlineArrowLeft />
            </button>
            <h1 className="text-xl text-yellow-500 font-semibold">Add new lecture</h1>
          </header>

          <form onSubmit={onFormSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="title"
              placeholder="Enter the title of the lecture"
              className="bg-transparent px-3 py-1 border"
              value={userInput.title}
              onChange={handleInputChange}
            />

            <textarea
              name="description"
              placeholder="Enter the description of the lecture"
              className="bg-transparent px-3 py-1 resize-none h-36 overflow-y-scroll border"
              onChange={handleInputChange}
              value={userInput.description}
            />

            {userInput.videoSrc ? (
              <video
                className="object-fill rounded-lg w-full"
                controls
                muted
                src={userInput.videoSrc}
                controlsList="nodownload"
                disablePictureInPicture
              />
            ) : (
              <div className="h-48 border flex items-center justify-center cursor-pointer">
                <label className="font-semibold text-xl cursor-pointer" htmlFor="lecture">
                  Choose your lecture
                </label>
                <input
                  type="file"
                  className="hidden"
                  id="lecture"
                  name="lecture"
                  onChange={handleVideo}
                  accept="video/mp4,video/x-mp4,video/*"
                />
              </div>
            )}

            <button
              type="submit"
              className="btn-primary py-1 text-lg font-semibold bg-green-500"
            >
              Add new lecture
            </button>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
}

export default AddLecture;
