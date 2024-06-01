import mongoose from "mongoose";
const { Schema } = mongoose;

const courseSchema = new Schema({
    courseName: String,
    schedule: {
        Monday: { active: String, time: String },
        Tuesday: { active: String, time: String },
        Wednesday: { active: String, time: String },
        Thursday: { active: String, time: String },
        Friday: { active: String, time: String },
        Saturday: { active: String, time: String },
        Sunday: { active: String, time: String },
    },
    students: [String],
    professor: String,
    attendance: [{
        date: String,
        present: [String]
    }]
})

export default mongoose.models.Course || mongoose.model("Course", courseSchema);