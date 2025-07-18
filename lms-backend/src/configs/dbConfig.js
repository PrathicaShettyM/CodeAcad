import mongoose from 'mongoose';

mongoose.set('strictQuery', false); // means mongoose will not throw error evn if u query for a non-existant field

const connectToDB = async () => {
    try {
        // connect to the MongoDB database
        const {connection} = await mongoose.connect(process.env.MONGODB_URI);
        if(connection){
            console.log(`Connected to MongoDB at ${connection.host}:${connection.port}`);
        }
    } catch (error) {
        // catch the connection errors
        console.log("Database connection failed: " + error);
        process.exit(1);
    }
}

export default connectToDB;