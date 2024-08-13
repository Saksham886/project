const mongoose=require("mongoose");
const schema=mongoose.Schema;
const Review=require("./reviews.js")
const listingschema=new schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String
        //     type:String,
        // default:"https://www.google.com/search?q=image&sca_esv=11e934b338f11fdd&rlz=1C1RXQR_enIN1076IN1076&udm=2&source=iu&ictx=1&vet=1&fir=tYmxDgFq4MrkJM%252C-t22bY2ix3gHaM%252C%252Fm%252F0jg24%253BvA13mRpcCjva8M%252CUsTmzJXQWCl48M%252C_%253BsKMM4eBjWSQEBM%252CB51x0PBR9KNzvM%252C_%253BibCPY_knL63RWM%252CDS3iFWzdKHOqlM%252C_%253BivTDs79HInLVcM%252CU9G_8UXPMlqatM%252C_%253BASMDFNsL7Vw1YM%252CbKJ3gdlWTtaNoM%252C_&usg=AI4_-kQ9MoP96KQrg0W_FJoYnwJpjV0OLQ&sa=X&ved=2ahUKEwjzzsOXst-GAxWqTWwGHUi1CZgQ_B16BAgoEAE#vhid=tYmxDgFq4MrkJM&vssid=mosaic",
        // set:(v)=>v==""?"https://www.google.com/search?q=image&sca_esv=11e934b338f11fdd&rlz=1C1RXQR_enIN1076IN1076&udm=2&source=iu&ictx=1&vet=1&fir=tYmxDgFq4MrkJM%252C-t22bY2ix3gHaM%252C%252Fm%252F0jg24%253BvA13mRpcCjva8M%252CUsTmzJXQWCl48M%252C_%253BsKMM4eBjWSQEBM%252CB51x0PBR9KNzvM%252C_%253BibCPY_knL63RWM%252CDS3iFWzdKHOqlM%252C_%253BivTDs79HInLVcM%252CU9G_8UXPMlqatM%252C_%253BASMDFNsL7Vw1YM%252CbKJ3gdlWTtaNoM%252C_&usg=AI4_-kQ9MoP96KQrg0W_FJoYnwJpjV0OLQ&sa=X&ved=2ahUKEwjzzsOXst-GAxWqTWwGHUi1CZgQ_B16BAgoEAE#vhid=tYmxDgFq4MrkJM&vssid=mosaic"
        // :v,
        
        
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type: schema.Types.ObjectId,
        ref:"Review",
    },],
    owner:{
        type: schema.Types.ObjectId,
        ref:"User",
    },
    
});
listingschema.post("findOneAndDelete",async(Listing)=>{
        if(Listing){
            await Review.deleteMany({ _id: { $in: Listing.reviews } });
        };
        
    });

const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;