import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema({
    rollNo: String,
    courses: [String]
});

export default mongoose.models.Student || mongoose.model("Student", studentSchema);
