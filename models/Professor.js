import mongoose from "mongoose";
const { Schema } = mongoose;

const professorSchema = new Schema({
    emailId: String,
    courses: [String]
});

export default mongoose.models.Professor || mongoose.model("Professor", professorSchema);
