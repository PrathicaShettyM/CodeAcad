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
export const createCourse = asyncHandler(async (req, res, next) => {
    const { title, category, createdBy, description } = req.body;

    if (!title || !description || !category || !createdBy) {
        return next(new AppError('All fields are required', 400));
    }

    if (!req.file) {
        return next(new AppError('Thumbnail image is required', 400));
    }

    let uploadedImage;
    try {
        uploadedImage = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'code_acad',
        });

        // cleanup local file
        await fs.rm(`uploads/${req.file.filename}`, { force: true });
    } catch (error) {
        return next(new AppError('Image upload failed. Try again.', 500));
    }

    // ✅ Now create course AFTER image is uploaded
    const course = await Course.create({
        title,
        category,
        createdBy,
        description,
        thumbnail: {
            public_id: uploadedImage.public_id,
            secure_url: uploadedImage.secure_url,
        },
    });

    if (!course) {
        return next(new AppError('Course could not be created, please try again', 400));
    }

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
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
        return next(new AppError('Invalid course id or course not found.', 404));
    }

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
    const {title, description} = req.body;
    const {id} = req.params;

    let lectureData = {};

    if (!title || !description) {
        return next(new AppError('Title and Description are required', 400));
    }

    const course = await Course.findById(id);

    if (!course) {
        return next(new AppError('Invalid course id or course not found.', 400));
    }

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'code_acad',
                chunk_size: 50000000,
                resource_type: 'video',
            });

            if(result){
                lectureData.public_id = result.public_id;
                lectureData.secure_url = result.secure_url;
            }

            await fs.rm(`uploads/${req.file.filename}`, { force: true });
        } catch (error) {
            for (const file of await fs.readdir('uploads/')){
                await fs.unlink(path.join('uploads/', file));
            }

            return next(new AppError(JSON.stringify(error) || 'File not uploaded, please try again', 400));
        }
    }

    course.lectures.push({
        title,
        description,
        lecture: lectureData,
    });

    course.numberOfLectures = course.lectures.length;
    await course.save();

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
    const { courseId, lectureId } = req.query;

    if (!courseId) {
        return next(new AppError('Course ID is required', 400));
    }

    if (!lectureId) {
        return next(new AppError('Lecture ID is required', 400));
    }

    const course = await Course.findById(courseId);

    if (!course) {
        return next(new AppError('Invalid ID or Course does not exist.', 404));
    }

    const lectureIndex = course.lectures.findIndex(
        (lecture) => lecture._id.toString() === lectureId.toString()
    );

    if(lectureIndex === -1){
        return next(new AppError('Lecture does not exist.', 404));
    }

    await cloudinary.v2.uploader.destroy(
        course.lectures[lectureIndex].lecture.public_id,
        { resource_type: 'video' }
    );

    course.lectures.splice(lectureIndex, 1);
    course.numberOfLectures = course.lectures.length;
    await course.save();

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
    const {id} = req.params;

    const course = await Course.findByIdAndUpdate(
        id,
        { $set: req.body },
        { runValidators: true, new: true }
    );

    if (!course) {
        return next(new AppError('Invalid course id or course not found.', 400));
    }

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
    const {id} = req.params;

    const course = await Course.findById(id);

    if (!course) {
        return next(new AppError('Course with given id does not exist.', 404));
    }

    await course.remove();

    res.status(200).json({
        success: true,
        message: 'Course deleted successfully',
    });
});
