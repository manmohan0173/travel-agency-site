const mongoose=require("mongoose")
const Schema=mongoose.Schema


const listingschema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/a-building-that-has-a-lot-of-columns-in-it-rfhXFokcpug",
        set:(v)=>v==="" ? "https://unsplash.com/photos/a-building-that-has-a-lot-of-columns-in-it-rfhXFokcpug":v,
    },
    price:Number,
    location:String,
    country:String,
 });

 const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;