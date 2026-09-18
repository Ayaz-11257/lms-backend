import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import fs from 'fs/promises';
import cloudinary from 'cloudinary';

const getAllCourses = async function(req, res, next) {
    try{
     const courses = await Course.find({}).select('-lectures'); //lectures ka details mat leke aana

     res.status(200).json({
         success: true,
         message: 'All courses',
         courses,
     });
    } catch(e) {
        return next(
            new AppError(e.message, 500)
        )
    }
}

const getLecturesByCourseId = async function(req, res, next) {
    try{
        const { id } = req.params;

        const course = await Course.findById(id);
        if (!course) {
            return next(
                new AppError('invalid course id', 400)
            )
        }
        res.status(200).json({
           success: true,
            message: 'Course lectures fetched successfully',
            lectures: course.lectures,
            course
        }); 
    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )    
}
} 

const createCourse = async (req, res, next) => {
    const { title, description, category, createdBy} = req.body;

    if(!title || !description || !category || !createdBy) {
        return next(
            new AppError('All fields are required', 400)
        )
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: 'default',
            secure_url: 'https://res.cloudinary.com/gpyyipre/image/upload/ar_1:1,c_crop,g_auto:face,w_300/r_max/co_rgb:68D2E7,e_outline:outer:15/main-sample.png',
        },
    });

    if(!course) {
        return next(
            new AppError('Course could not be created, please try again!', 500)
        )
    }

    if (req.file) {
        try{

        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'lms',
            
        });
        if (result) {
            course.thumbnail.public_id = result.public_id;
            course.thumbnail.secure_url = result.secure_url;
        }

        fs.rm(`uploads/${req.file.filename}`);
    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )    
      }
    }
    
    await course.save();

    res.status(200).json({
           success: true,
            message: 'Course created successfully',
            course,
        });

}

const updateCourse = async (req, res, next) => {
    try{
        const { id } = req.params;
        const course = await  Course.findByIdAndUpdate(
            id,
            {
                $set: req.body //jitna data doge utna hi update karega sara update nhi karega
            },
            {
                runValidators: true
            }
        );
        
        if (!course) {
            return next(
                new AppError('course with given id does not exists', 500)
            )
        }

        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course
        })
    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )    
      }
}

const removeCourse = async (req, res, next) => {
    try{
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return next(
                new AppError('course with given id does not exists', 500)
            )
        }

        await Course. findByIdAndDelete(id); //.remove bhi check kar lena

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        })

    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )    
      }
}

const addLectureToCourseById = async (req, res, next) => {
    try{
    const { title, description } = req.body;
    const { id } = req.params;

    if(!title || !description) {
        return next(
            new AppError('All fields are required', 400)
        )
    }

    const course = await Course.findById(id);

    if (!course) {
            return next(
                new AppError('course with given id does not exists', 500)
            )
        }

        const lectureData = {
            title,
            description,
            lecture: {}
        };

        if (req.file) {
        try{

        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'lms',
            resource_type: 'video',
            chunk_size: 50000000
        });
        if (result) {
            lectureData.lecture.public_id = result.public_id;
            lectureData.lecture.secure_url = result.secure_url;
        }

        await fs.rm(`uploads/${req.file.filename}`);
    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )    
      }
    }

    console.log('lecture>', JSON.stringify(lectureData));
    course.lectures.push(lectureData);

    course.numbersOfLectures = course.lectures.length;

    await course.save();

    res.status(200).json({
            success: true,
            message: 'Lecture successfully added to the course',
            course
        })
    } catch (e) {
         return next(
            new AppError(e.message, 500)
        ) 
    }

};

const removeLectureFromCourse = async (req, res, next) => {
    try {
        const { courseId, lectureId } = req.query;

        if (!courseId) {
            return next(new AppError("Course ID is required", 400));
        }

        if (!lectureId) {
            return next(new AppError("Lecture ID is required", 400));
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new AppError("Course with given ID does not exist", 404));
        }

        const lectureIndex = course.lectures.findIndex(
            (lecture) => lecture._id.toString() === lectureId.toString()
        );

        if (lectureIndex === -1) {
            return next(new AppError("Lecture does not exist", 404));
        }

        // Delete video from Cloudinary
        if (course.lectures[lectureIndex].lecture?.public_id) {
            await cloudinary.v2.uploader.destroy(
                course.lectures[lectureIndex].lecture.public_id,
                {
                    resource_type: "video"
                }
            );
        }

        // Remove lecture from array
        course.lectures.splice(lectureIndex, 1);
        course.numbersOfLectures = course.lectures.length;

        await course.save();

        res.status(200).json({
            success: true,
            message: "Lecture deleted successfully",
            course
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    removeLectureFromCourse
}