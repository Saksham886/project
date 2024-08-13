const { required } = require("joi");
const mongoose=require("mongoose");
const schema=mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userschema =new schema({
    email:{
        type :String,
        required: true
    },
    // passport local mongoose will auto generate user name and hashed password 
    // therefore we need not to write in schema
});
userschema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userschema);