import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    country: {
        type: String,
        required: [true, "Country is required"]
    },
    currency: {
        type: String,
        default: "USD" // Default currency
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Location = mongoose.model('Location', locationSchema);

export default Location;
