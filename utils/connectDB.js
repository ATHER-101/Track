import mongoose from 'mongoose';

const connectToDB = async ()=>{
    try {
        await mongoose.connect(process.env.MongoURI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("connected to mongoDB!");
    } catch (error) {
        console.log(error);
    }
}

export default connectToDB;