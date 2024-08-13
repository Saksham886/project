const express =require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/reviews.js");
const{validatereview,isloggedin,isreviewAuthor}=require("./middleware.js");

const Listing=require("../models/listing.js");
const wrapAsync=require("../public/utils/wrapAsync.js");
const ExpressError=require("../public/utils/expresserror.js");
const reviewcontrol = require("../controller/review.js");



// reviews
router.post("/",isloggedin,validatereview,wrapAsync(reviewcontrol.review));
// delete review
router.delete("/:reviewid",isloggedin,isreviewAuthor,wrapAsync(reviewcontrol.deletereview));

module.exports=router;