import app from './app.js';
import connectToDB  from './src/configs/dbConfig.js';

// starting point of the server
app.listen(process.env.PORT || 5000, async () => {
    await connectToDB();
    console.log(`Server is running on port ${process.env.PORT}`);
});