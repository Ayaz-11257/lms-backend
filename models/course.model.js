import { model, Schema } from 'mongoose';

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength: [8, 'Title must be atleast 8 characters'],
        maxLength: [60, 'Title must be less than 60 characters'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Discription is required'],
        minLength: [8, 'Discription must be atleast 8 characters'],
        maxLength: [200, 'Discription must be less than 200 characters'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    thumbnail: {
                        public_id: {
                    type: String,
                    required: true,
                },
                secure_url: {
                    type: String,
                    required: true,
                }
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                                public_id: {
                    type: String,
                    required: true,
                },
                secure_url: {
                    type: String,
                    required: true,
                }
            }
        }
    ],
    numbersOfLectures: {
        type: Number,
        default: 0,
        required: true,
    },
    createdBy: {
        type: String,
    }
}, {
    timestamps: true
});    

const Course = model('Course', courseSchema);

export default Course;