import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    Group_id: mongoose.Schema.Types.ObjectId,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    Group_Name: {
        type: String,
        required: [true, "Group Name is required"]
    },
    Group_Members: {
        type: [String],
        required: [false, "Group Members is required"]
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
