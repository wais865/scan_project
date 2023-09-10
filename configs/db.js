const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://Mof:123456qwert@development.ei9qgtp.mongodb.net/?retryWrites=true&w=majority',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Mongodb connected :${conn.connection.host}`);
    } catch (err) {
        console.log(`error connecting on MongoDB: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;