if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"public")));
const ExpressError=require("./public/utils/expresserror.js");
const { error } = require("console");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const dburl=process.env.ATLAS_URL;
// const mongourl='mongodb://127.0.0.1:27017/test';
const listingsRouter =require("./routes/listing.js");
const reviewsRouter =require("./routes/review.js");
const userRouter =require("./routes/user.js");
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=> {
    console.log(err)});
async function main() {
    await mongoose.connect(dburl);
  
  }
app.get("/",(req,res)=>{
    res.render("../views/listings/home.ejs");
});
const store= MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
      },
      touchAfter: 24*3600,
    
  })
  store.on("error",()=>{
    console.log("Error in Mongosession store",error);
  });
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    Cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
        
    },
};


app.use(session(sessionOptions));
app.use(flash());
// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});

// signup demo

// app.get("/demouser",async(req,res)=>{
//     let fakeuser= new User({
//         email:"student@gamil.com",
//         username:"del-student"
//     });
//     let registereduser=await User.register(fakeuser,"helloworld");
//     res.send(registereduser); 
// });



// routes
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
// privacy
app.get("/privacy",(req,res)=>{
    res.render("../views/includes/privacy.ejs");
})
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})
app.use((err,req,res,next)=>{
    let{statuscode=500,message="Something went wrong"}=err;
    res.status(statuscode).render("../views/listings/error.ejs",{message});
    // res.status(statuscode).send(message);
})
// app.use((err,req,res,next)=>{
//     res.send("Something went wrong");
// });
app.listen(8080,()=>{
    console.log("App is listening");
});
