import mongoose from "mongoose";

export interface UserInterface {
    name : string;
    email: string;
    password? : string;
    isEmailVerified : boolean;
    twoFactorEnabled : boolean;
    twoFactorSecret? : string;
    tokenVersion : number;
    resetPassword? : string;
    resetPasswordExpires? : Date;
    role : "student" | "admin";
    googleId? : string;

}


const Userschema = new mongoose.Schema<UserInterface>({
    name : {
        type : String, 
        required : true
    }, 

    email : { 
        type : String, 
        required : true, 
        unique : true
    },

    password : { 
        type : String,  
    },

    isEmailVerified : { 
        type : Boolean, 
        default : false
    },

    twoFactorEnabled : { 
        type : Boolean, 
        default : false
    },

    twoFactorSecret  : { 
        type : String, 
        default : undefined
    },

    tokenVersion  : { 
        type : Number, 
        default : 0
    },

    resetPassword  : { 
        type : String, 
        default : undefined
    },

    resetPasswordExpires  : {
        type : Date,
        default : undefined
    },

    role : {
        type : String,
        enum : ["student", "admin"],
        default : "student"
    },

    googleId : {
        type : String,
        unique : true,
        sparse : true
    },



}, {timestamps : true})


export const User = mongoose.model<UserInterface>("User", Userschema)