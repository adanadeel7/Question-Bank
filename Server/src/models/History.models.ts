import mongoose from "mongoose";

interface historyInterface{
    user : mongoose.Types.ObjectId;
    question : mongoose.Types.ObjectId;
    marksScored : number;
    timeTaken : number;
}


const HistorySchema = new mongoose.Schema<historyInterface>({
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

HistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 });


export const History = mongoose.model<historyInterface>("History", HistorySchema)
