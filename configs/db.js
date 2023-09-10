const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://Mof:123456qwert@development.ei9qgtp.mongodb.net/?retryWrites=true&w=majority',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log(`Mongodb connected :${conn.host}`);
    } catch (err) {
        console.log(`error connecting on MongoDB: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;