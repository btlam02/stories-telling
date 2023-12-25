import mongoose, { mongo } from "mongoose";


const generated_stories = new mongoose.Schema ({
    stories:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story",
    }}
    )



module.exports =  mongoose.model(generated_stories)