const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
const ExpressError=require("../public/utils/expresserror.js");
const {listingschema}=require("../schema.js");
const {reviewschema}=require("../schema.js");


module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please log in");
        return res.redirect("/login");
    }next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirecturl=req.session.redirectUrl;
    }next();
}

module.exports.isowner=async(req,res,next)=>{
    const id=req.params.id;
    const list=await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }next();
}


module.exports.isreviewAuthor=async(req,res,next)=>{
    let{id, reviewid}=req.params;
    const review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }next();
}
// validate schema function for listing
module.exports.validatelisting=(req,res,next)=>{
    let{error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};


// validate schema function for review
module.exports.validatereview=(req,res,next)=>{
    let{error}=reviewschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};