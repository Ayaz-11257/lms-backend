import { Router } from 'express';
import { addLectureToCourseById, createCourse, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse, removeLectureFromCourse } from '../controller/course.controller.js';
import { isLoggedIn, authorizedRoles, authorizeSubscriber } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();

router.route('/')  //yeh method se yeh faayda hoga ki get aur post dono saath me kr sakte hai
.get(getAllCourses)
.post(
    isLoggedIn, //authentication
    authorizedRoles('ADMIN'), //authorization
    upload.single('thumbnail'),
    createCourse
)
.delete(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        removeLectureFromCourse // <--- ADD THIS
    );

router.route('/:id')
.get(isLoggedIn, authorizeSubscriber, getLecturesByCourseId) // agar login kar chuke ho to hi dikhayenge lectures
.put(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    updateCourse
)
.delete(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    removeCourse
)
.post(
    isLoggedIn,
    authorizedRoles('ADMIN'),
    upload.single('lecture'),
    addLectureToCourseById
);

export default router;