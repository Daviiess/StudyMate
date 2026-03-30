import mongoose, {connect} from "mongoose";

const connectDB = async() => {
try{    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb connected: ${conn.connection.host}`);
}catch(error){
    console.error( `Error connecting to MongoDb: ${error.message}`);
    process.exit(1);
}
}
export default connectDB;