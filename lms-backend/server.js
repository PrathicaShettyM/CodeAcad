import { v2 } from 'cloudinary';
import app from './app.js';
import connectToDB  from './src/configs/dbConfig.js';

// cloudinary configuration
v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// starting point of the server
app.listen(process.env.PORT || 5000, async () => {
    await connectToDB();
    console.log(`Server is running on port ${process.env.PORT}`);
});