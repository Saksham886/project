const express =require("express");
const router=express.Router();
const user =require("../models/user.js");
const wrapAsync = require("../public/utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("./middleware.js");

router.get("/signup",(req,res)=>{
    res.render("./users/signup.ejs");
})
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let { username,email,password}=req.body;
    const newuser=new user({email,username});
    const registereduser=await user.register(newuser,password);
    console.log(registereduser);
    req.login(registereduser,(err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","Welcome to WonderLust! You have successfully signed up");
        res.redirect("/listings");
    });
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}));


router.get("/login",(req,res)=>{
    res.render("./users/login.ejs");
})

router.post("/login",saveRedirectUrl,passport.authenticate('local',
     { failureRedirect: '/login' ,failureFlash:true }),async(req,res)=>{
    req.flash("success","You have successfully logged in. Welcome back!");
    let url= res.locals.redirecturl||"/listings";
    res.redirect(url);

})

router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","You have successfully logged out.");
        res.redirect("/listings");
    });
})
module.exports=router;
