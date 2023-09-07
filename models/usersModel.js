const mongoose = require('mongoose');

const{Schema} = mongoose;

const usersSchema = new Schema({
    name:String,
    lastName:String,
    fatherName:String,
    occupation:String,
    accessLevel:Number,
    
})
