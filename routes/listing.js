const express =require("express");
const router=express.Router();
const Listing=require("../models/listing.js");

const wrapAsync=require("../public/utils/wrapAsync.js");
const{isloggedin , isowner,validatelisting}=require("./middleware.js");
const listingcontrol=require("../controller/listing.js");
const {storage}=require("../cloudConfig.js");
const multer = require("multer");
const upload=multer({storage});
router.route("/")
    // index route
    .get(wrapAsync(listingcontrol.index))
    // create route
    .post(isloggedin,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontrol.create));
   


// new route 
router.get("/new",isloggedin,(req,res)=>{
    
    res.render("../views/listings/new.ejs")
})

router.route("/:id")
    // show route
    .get( wrapAsync(listingcontrol.show))

    // update route
    // ...means deconstruct
    .put(isloggedin , isowner,upload.single("listing[image]"), validatelisting,wrapAsync(listingcontrol.update))
    // delete route
    .delete(isloggedin, isowner,wrapAsync(listingcontrol.delete))


// edit route
router.get("/:id/edit",isloggedin,isowner,wrapAsync(listingcontrol.edit))




module.exports=router;