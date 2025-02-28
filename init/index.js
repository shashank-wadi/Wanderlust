const mongoose = require('mongoose');
const initData = require('./data.js'); 
const Listings = require('../models/listing');
const user = require('../models/user');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlast'; 

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('✅ Connected to DB');
    } catch (err) {
        console.error(' Error connecting to DB:', err);
    }
}

const initDB = async () => {
    try {
        await Listings.deleteMany(); 
        console.log('🗑️ Deleted existing listings');

        const owner = await user.findOne();
        if (!owner) {
            console.error("Error: No owner found in database! Please create a user first.");
            return;
        }

        console.log(`🧑 Using owner ID: ${owner._id}`);

        const formattedData = initData.data.map(item => ({
            ...item,
            image: item.image.url,
            owner: owner._id 
        }));

        await Listings.insertMany(formattedData);
        console.log('✅ Data initialized');

        await mongoose.disconnect();
        console.log('🔌 Disconnected from DB');
    } catch (err) {
        console.error(' Error initializing DB:', err);
    }
};

// Run the script
main().then(() => initDB()).catch(err => console.log(err));
