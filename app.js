
const express=require("express")
const app=express()
const mongoose=require("mongoose")
const Listing=require("./models/listing.js")
const mongo_url="mongodb://127.0.0.1:27017/airbnb"
const path=require("path")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema}=require("./schema.js")

main()
.then(()=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(mongo_url) 
}


app.listen(8080,()=>{
    console.log("server is listning on port 8080")
})

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"/public")))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.get("/",(req,res)=>{
    res.send("hey there")
})

app.get("/listing",wrapAsync(async(req,res)=>{
   
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}))
app.get("/listings/new",(req,res)=>{
    
    res.render("listings/new.ejs")
})
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    const {id} =req.params
    const listing=await Listing.findById(id)
    res.render("listings/show.ejs",{listing})
}))
app.post("/listings",wrapAsync(async(req,res,next)=>{
        let result=listingSchema.validate(req.body)
        console.log(result)
        if(result.error){
        throw new ExpressError(400,result.error)
        }
        let newListing= new Listing(req.body.listing) 
        await newListing.save()
        res.redirect("/listing")
     }))
app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
    const {id} =req.params
    const listing=await Listing.findById(id)
    res.render("listings/edit.ejs",{listing})
}))
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
}))
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params
    let deletedListing=await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    res.redirect("/listing")
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

//error middleware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err
    // res.status(statusCode).send(message)
    res.render("listings/error.ejs",{statusCode,message})
})