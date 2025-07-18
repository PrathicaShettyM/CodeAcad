import fs from "fs/promises";
import path from "path";
import cloudinary from "cloudinary";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import Course from "../models/course.model.js";
import AppError from "../utils/appError.js";

/*
    1. This is a get all course controller (PUBLIC)
       This goes as GET: {{URL}}/api/v1/courses
*/
export const getAllCourses = asyncHandler(async (_req, res, next) => {
    // Find all the courses without lectures
    const courses = await Course.find({}).select("-lectures");

    res.status(200).json({
        success: true,
        message: 'All courses',
        courses
    });
});

/*
    2. This is a create course controller(private: accessible by admins only)
       This goes as POST: {{URL}}/api/v1/courses
*/
export const createCourse = asyncHandler(async(req, res, next) => {
    // destructure the required info from the req.body (form data)
    const {title, description, category, createdBy} = req.body;

    // check if all the fields exits before creating the course
    if (!title || !description || !category || !createdBy) {
        return next(new AppError('All fields are required', 400));
    }

    // create new course object
    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
    });

    // if course doesnt exist, then throw error
    if(!course){
        return next(new AppError('Course could not be created, please try again', 400));
    }

    // this part gets executed only if we are doing any media uploads
    if(req.file){
       try {
            // upload the media file cloudinary into 'code_acad' folder
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'code_acad', // save in this particular folder so its easy to maintain everything  
            });

            // If success
            if(result){
                // Set the public_id and secure_url in array
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }
            
            // After successful upload remove the file from local storage
            fs.rm(`uploads/${req.file.filename}`);
       } catch (error) {
        // Empty the uploads directory without deleting the uploads directory
            for (const file of await fs.readdir('uploads/')) {
                await fs.unlink(path.join('uploads/, file'));
            }

            // Send the error message
            return next(new AppError(JSON.stringify(error) || 'File not uploaded, please try again', 400));
       } 
    }   

    // save the course info(data) in the database
    await course.save();

    // return a json success message
    res.status(201).json({
        success: true,
        message: 'Course created successfully',
    });
});

/*
    3. This is a get lectures(by course id) controller (private: accessible only by admins and subscribed users)
       This goes as GET: {{URL}}/api/v1/courses/:id
*/
export const getLecturesByCourseId = asyncHandler(async (req, res, next) => {
    // grab the course id from the url(req.params)
    const { id } = req.params;
    // get course by id
    const course = await Course.findById(id);

    // if course doesnt exist, then throw error 
    if (!course) {
        return next(new AppError('Invalid course id or course not found.', 404));
    }

    // return a json response
    res.status(200).json({
        success: true,
        message: 'Course lectures fetched successfully',
        lectures: course.lectures,
    });
});

/*
    4. This is a add lectures to course(by id) controller(private: accessible only by admins)
       This goes as POST: {{URL}}/api/v1/courses/:id
*/
export const addLectureToCourseById = asyncHandler(async (req, res, next) => {
    // destructure the required info from the req.body (form data)
    const {title, description} = req.body;
    // grab the id from the url(req.params)
    const {id} = req.params;

    // create an empty lecture data object 
    let lectureData = {};

    // throw error, incase u didnt find any title or description
    if (!title || !description) {
        return next(new AppError('Title and Description are required', 400));
    }

    // find the course by id from the DB
    const course = await Course.findById(id);

    // if no course, throw error
    if (!course) {
        return next(new AppError('Invalid course id or course not found.', 400));
    }

    // this part gets executed only if we are doing any media uploads
    if (req.file) {
        try {
            // upload the media file(video in this case) cloudinary into 'code_acad' folder
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'code_acad',
                chunk_size: 50000000, // 50 mb is the limit
                resource_type: 'video', // add video lectures
            });

            // if success
            if(result){
                // Set the public_id and secure_url in array
                lectureData.public_id = result.public_id;
                lectureData.secure_url = result.secure_url;
            }

            // After successful upload remove the file from local storage
            fs.rm(`uploads/${req.file.filename}`);
        } catch (error) {
            // Empty the uploads directory without deleting the uploads directory
            for (const file of await fs.readdir('uploads/')){
                await fs.unlink(path.join('uploads/', file));
            }

            // Send the error message
            return next(new AppError(JSON.stringify(error) || 'File not uploaded, please try again', 400));
        }
    }

    // this is same as array.push(element)
    course.lectures.push({
        title,
        description,
        lecture: lectureData,
    });

    // count the number of lectures
    course.numberOfLectures = course.lectures.length;

    // save the course details in the database
    await course.save();

    // return a success json response
    res.status(200).json({
        success: true,
        message: 'Course Lecture added successfully',
        course,
    });
});

/*
    5. This is a delete lecture from course controller(private: accessible only by admins)
       This goes as DELETE: {{URL}}/api/v1/courses/:courseId/lectures/:lectureId
*/
export const removeLectureFromCourse = asyncHandler(async (req, res, next) => {
    // grab courseId and lectureId from req.query
    const { courseId, lectureId } = req.query;
    console.log(courseId);

    // Checking if both courseId and lectureId are present
    if (!courseId) {
        return next(new AppError('Course ID is required', 400));
    }

    if (!lectureId) {
        return next(new AppError('Lecture ID is required', 400));
    }

    // Find the course using the courseId
    const course = await Course.findById(courseId);

    // If no course send custom message
    if (!course) {
        return next(new AppError('Invalid ID or Course does not exist.', 404));
    }

    // Find the index of the lecture using the lectureId
    const lectureIndex = course.lectures.findIndex(
        (lecture) => lecture._id.toString() === lectureId.toString()
    );

    // if returned index is -1 then send error message
    if(lectureIndex === -1){
        return next(new AppError('Lecture does not exist.', 404));
    }

    // delete lecture from cloudinary
    await cloudinary.v2.uploader.destroy(
        course.lectures[lectureIndex].lecture.public_id,
        {
            resource_type: 'video',
        }
    );

    // remove lectures from the array
    course.lectures.splice(lectureIndex, 1);

    // update the no of lectures in the course
    course.numberOfLectures = course.lectures.length;

    // save the course object
    await course.save();

    // return response
    res.status(200).json({
        success: true,
        message: 'Course lecture removed successfully'
    });
});

/*
    6. This is a update course(by id) controller(private: only by admins)
       This goes as PUT: {{URL}}/api/v1/courses/:id
*/
export const updateCourseById = asyncHandler(async (req, res, next) => {
    // Extracting the course id from the request params(url)
    const {id} = req.params;

    // find the course to be updated
    const course = await Course.findById(
        id,
        {
            $set: req.body, // This will only update the fields which are present
        },
        {
            runValidators: true, // This will run the validation checks on the new data
        } 
    );

    // If no course found then send the response for the same
    if (!course) {
        return next(new AppError('Invalid course id or course not found.', 400));
    }

    // Sending the response after success
    res.status(200).json({
        success: true,
        message: 'Course updated successfully'
    });
});

/*
    7. This is a delete course(by id) controller(private: admins only)
       This goes as DELETE: {{URL}}/api/v1/courses/:id
*/
export const deleteCourseById = asyncHandler(async (req, res, next) => {
    // Extracting id from the request parameters
    const {id} = req.params;

    // Finding the course via the course ID
    const course = await Course.findById(id);

    // If course not find send the message as stated below
    if (!course) {
        return next(new AppError('Course with given id does not exist.', 404));
    }

    // remove course
    await course.remove();

    // send response
    res.status(200).json({
        success: true,
        message: 'Course deleted successfully',
    });
});
