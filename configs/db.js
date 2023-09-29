const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.URI}`,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`Mongodb connected :${conn.connection.host}`);

        return conn;
    } catch (err) {
        console.log(`error connecting on MongoDB: ${err.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;