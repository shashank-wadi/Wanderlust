const Listing = require("../models/listing");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index", { allListings });
  };

module.exports.newListing= (req, res) => {
    res.render("new.ejs");
  };

module.exports.showListings=async (req, res) => {
    const listing = await Listing.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author"
        }
      })
      .populate("owner");
  
    if (!listing) {
      req.flash("error", "The listing you requested does not exist!");
      return res.redirect("/listings");
    }
  
    console.log("Listing Data:", listing); 
  
    res.render("show", { listing });
  };
  module.exports.createNewListing = async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
      newListing.owner = req.user._id;
      await newListing.save();
      req.flash("success", "New listing created!");
      res.redirect("/listings");
    };
  

module.exports.editListings=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
  
    if (!listing) {
      req.flash("error", "The listing you requested does not exist!");
      return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200");
  
    res.render("edit", { listing,originalImageUrl});
  };

module.exports.updateListings=async (req, res) => {
  let listing=await Listing.findByIdAndUpdate(req.params.id, { ...req.body.listing });
  if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename}
    await listing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect("/listings");
};

module.exports.deleteListings=async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
  };

