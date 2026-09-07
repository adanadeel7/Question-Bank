import mongoose from "mongoose";
import { TOPICS, Topic } from "./Questions.models.js";

interface TopicStats {
    attempted : number;
    marksScored : number;
    marksPossible : number;
}

interface userStatsInterface {
    user : mongoose.Types.ObjectId;
    topics : Map<Topic, TopicStats>;
    totalAttempted : number;
    totalMarksScored : number;
    totalMarksPossible : number;
}


const userStatsSchema = new mongoose.Schema<userStatsInterface>({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    },

    topics : {
        type : Map,
        of : {
            attempted : { type : Number, default : 0 },
            marksScored : { type : Number, default : 0 },
            marksPossible : { type : Number, default : 0 }
        },
        default : {}
    },

    totalAttempted : {
        type : Number,
        default : 0
    },

    totalMarksScored : {
        type : Number,
        default : 0
    },

    totalMarksPossible : {
        type : Number,
        default : 0
    },

}, { timestamps : true })


export const UserStats = mongoose.model<userStatsInterface>("UserStats", userStatsSchema)
