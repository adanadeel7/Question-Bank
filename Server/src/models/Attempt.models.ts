import mongoose from "mongoose";

interface attemptInterface{
    user : mongoose.Types.ObjectId; 
    question : mongoose.Types.ObjectId;  
    marksScored : number; 
    timeTaken : number; 
}


const AttemptSchema = new mongoose.Schema<attemptInterface>({
    user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
},
question : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Question",
    required : true
}, 

marksScored: { 
    type : Number,
    required : true
}, 
timeTaken : { 
    type : Number, 
    required : true
}

},{timestamps : true})


export const Attempt = mongoose.model<attemptInterface>("Attempt", AttemptSchema)