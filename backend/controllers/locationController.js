import Location from "../models/locationModel.js";

// Controller to create a new location
export const createLocation = async (req, res) => {
    try {
        const { country, currency } = req.body;
        // Validate request body
        if (!country) {
            return res.status(400).json({ success: false, message: "Country is required" });
        }
        // Create new location
        const newLocation = await Location.create({ country, currency });
        return res.status(201).json({ success: true, message: "Location created successfully", location: newLocation });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to get all locations
export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        return res.status(200).json({ success: true, locations });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Other controllers such as updateLocation, deleteLocation, etc. can be added as needed.
