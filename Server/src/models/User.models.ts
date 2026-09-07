import mongoose from "mongoose";
import { required } from "zod/mini";

interface UserInterface { 
    name : string; 
    email: string; 
    password : string; 
    isEmailVerified : Boolean; 
    twoFactorEnabled : Boolean; 
    twoFactorSecret : string; 
    tokenVersion : Number; 
    resetPassword : String;
    resetPasswordExpires : Date; 

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
        required : true, 
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



}, {timestamps : true})


export const User = mongoose.model<UserInterface>("User", Userschema)