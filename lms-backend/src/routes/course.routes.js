import { Router } from 'express'; 
import {
  addLectureToCourseById,
  createCourse,
  deleteCourseById,
  getAllCourses,
  getLecturesByCourseId,
  removeLectureFromCourse,
  updateCourseById,
} from '../controllers/course.controller.js';
import {
  authorizeRoles,
  authorizeSubscribers,
  isLoggedIn,
} from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

// PUBLIC: get all courses
router.route('/').get(getAllCourses);

// ADMIN: create new course
router.post(
  '/',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  upload.single("thumbnail"),
  createCourse
);

// ADMIN: delete a course by ID
router.delete(
  '/:id',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  deleteCourseById
);

// SUBSCRIBER: get lectures in a course
router.get(
  '/:id',
  isLoggedIn,
  authorizeRoles("Subscriber", "ADMIN"),
  getLecturesByCourseId
);
// router.get(
//   '/:id',
//   isLoggedIn,
//   authorizeSubscribers,
//   getLecturesByCourseId
// );

// ADMIN: add a lecture to course
router.post(
  '/:id',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  upload.single('file'),
  addLectureToCourseById
);

// ADMIN: update a course
router.put(
  "/:id",
  isLoggedIn,
  authorizeRoles("ADMIN"),
  upload.single("thumbnail"),
  updateCourseById,
);


//  ADMIN: remove lecture from course (NEW ROUTE)
router.delete(
  '/:courseId/lectures/:lectureId',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  removeLectureFromCourse
);

export default router;
