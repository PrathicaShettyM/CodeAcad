import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CourseCard from "../../components/CourseCard";
import HomeLayout from "../../layout/HomeLayout";
import { getAllCourses } from "../../redux/slices/courseSlice";

function CourseList() {
  const dispatch = useDispatch();
  const { coursesData } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(getAllCourses());
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 pl-20 flex flex-col gap-10 text-white">
        <h1 className="text-center text-4xl font-semibold mb-5">
          Explore courses made by{" "}
          <span className="font-bold text-yellow-500">Industry experts</span>
        </h1>

        <div className="mb-10 flex flex-wrap gap-14">
          {coursesData?.map((element) => (
            <CourseCard key={element._id} data={element} />
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}

export default CourseList;