import mongoose from "mongoose";

export const TOPICS = [
    "quadratics",
    "functions",
    "coordinate-geometry",
    "circular-measure",
    "trigonometry",
    "series",
    "differentiation",
    "integration",
] as const;

export type Topic = typeof TOPICS[number];

const STATES = ["cropped", "tagged", "reviewed"] as const;

type State = typeof STATES[number];

interface questionInterface{
    subject : string;
    code : number;
    year : number;
    session : string;
    variant : number;
    question_number : number;
    content : {
        url: string;
        publicId : string
    };
    text : string;

    marking_scheme : {
        url : string;
        publicId : string
 
    };
    topic : Topic;
    state : State;
    marks : number; 

}


const questionModel = new mongoose.Schema<questionInterface>({
    subject : { 
        type : String,
        required : true
    },

    code : { 
        type : Number,
        required : true
    },

    year : { 
        type : Number,
        required : true
    },

    session : { 
        type : String,
        required : true
    },

    variant : { 
        type : Number,
        required : true
    },

    question_number : { 
        type : Number,
        required : true
    },

    content : {
        url : { type : String, required : true },
        publicId : { type : String, required : true }
    },

    text : {
        type : String,
        required : true
    },

    marking_scheme : {
        url : { type : String, required : true },
        publicId : { type : String, required : true }
    },

    topic : {
        type : String,
        enum : TOPICS,
        required : true
    },

    state : {
        type : String,
        enum : STATES,
        required : true
    },

    marks : { 
        type : Number,
        required : true
    },

}, {
    timestamps : true
})


export const Question = mongoose.model<questionInterface>("Question", questionModel)