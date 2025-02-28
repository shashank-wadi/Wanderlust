const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
     url:String,
     filename:String,
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user" 
    }
});

const Listings = mongoose.model("Listings", ListingsSchema);
module.exports = Listings;
