
const Listing=require("../models/listing.js");
module.exports.index=async(req,res)=>{
    const alllisting=await Listing.find();
    res.render("../views/listings/index.ejs", { alllisting } );

}

module.exports.show=async(req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!list){
        req.flash("error","Listing Does Not Exist");
        res.redirect("/listings");
    }
    
    res.render("../views/listings/show.ejs", { list } );

}

module.exports.create=async (req,res)=>{
    // const result=listingschema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Enter valid data for listing");
    // }
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting= new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

module.exports.edit=async(req,res)=>{
    let {id} =req.params;
    const list= await Listing.findById(id);
    
    if(!list){
        req.flash("error","Listing Does Not Exist");
        res.redirect("/listings");
    }
    let originalurl=list.image.url;
    
    originalurl=originalurl.replace("/upload","/upload/w_250");
    
    res.render("../views/listings/edit.ejs",{list,originalurl});

}

module.exports.update=async(req,res)=>{
    let {id}=req.params;
    let updatelisting=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        updatelisting.image={url,filename};
        await updatelisting.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);

}

module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    const deletedlist=await Listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");

}