import { useEffect, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../layout/HomeLayout";
import {
  deleteCourseLecture,
  getCourseLecture,
} from "../../redux/slices/lectureSlice";

function DisplayLectures() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { lectures } = useSelector((state) => state.lecture);
  const { role, data } = useSelector((state) => state.auth);

  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    if (!state?._id) {
      navigate("/courses");
      return;
    }

    // check subscription status if not admin
    if (role !== "ADMIN" && data?.subscription?.status !== "active") {
      navigate("/denied");
      return;
    }

    dispatch(getCourseLecture(state._id));
  }, [state, dispatch, navigate, role, data]);

  const onLectureDelete = async (cid, lid) => {
    await dispatch(deleteCourseLecture({ courseId: cid, lectureId: lid }));
    await dispatch(getCourseLecture(cid));
  };

  if (!state?._id) return null;

  return (
    <HomeLayout>
      <div className="min-h-screen w-full px-[5%] py-6 text-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg flex justify-between items-center shadow-md">
          <h1 className="text-3xl font-bold text-yellow-500">
            Course: {state?.title}
          </h1>

          {role === "ADMIN" && (
            <button
              onClick={() =>
                navigate("/course/addlecture", { state: { ...state } })
              }
              className="btn-primary px-4 py-2 rounded-md font-semibold bg-green-500 hover:bg-green-400 transition"
            >
              Add new lecture
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-10 mt-6">
          {/* Video Player */}
          <div className="md:w-[65%] sticky top-[100px] bg-white bg-opacity-5 backdrop-blur-md rounded-xl p-4 shadow-lg">
            <video
              src={
                lectures[currentVideo]?.lecture?.secure_url ||
                lectures[currentVideo]?.secure_url
              }
              className="w-full h-[400px] object-contain rounded-md"
              controls
              disablePictureInPicture
              controlsList="nodownload"
              muted
            />
            <div className="mt-4 space-y-2">
              <h2>
                <span className="text-yellow-500 font-semibold">Title: </span>
                {lectures[currentVideo]?.title}
              </h2>
              <p>
                <span className="text-yellow-500 font-semibold">Description: </span>
                {lectures[currentVideo]?.description}
              </p>
            </div>
          </div>

          {/* Lecture List */}
          <div className="md:w-[35%] max-h-[calc(100vh-150px)] overflow-y-auto p-4 rounded-xl border border-white bg-white bg-opacity-5 backdrop-blur-md shadow-md">
            <h2 className="text-yellow-400 text-xl font-bold mb-4">
              Lectures List
            </h2>

            {lectures.length > 0 ? (
              lectures.map((lecture, idx) => (
                <div className="mb-4" key={lecture._id}>
                  <button
                    className="flex items-center gap-2 text-left text-white font-medium hover:text-yellow-300 transition"
                    onClick={() => setCurrentVideo(idx)}
                  >
                    <FaPlayCircle className="text-yellow-400" />
                    <span>
                      Lecture {idx + 1}: {lecture?.title}
                    </span>
                  </button>

                  {role === "ADMIN" && (
                    <button
                      onClick={() => onLectureDelete(state._id, lecture._id)}
                      className="px-3 py-1 text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
                    >
                      Delete lecture
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-yellow-300">
                No lectures found.{" "}
                {role === "ADMIN" &&
                  "Click the 'Add new lecture' button above to add one."}
              </p>
            )}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default DisplayLectures;
