import mongoose from "mongoose";
import { User } from "../models/User.models.js";
import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth.schema.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { hashPassword } from "../libs/hash.js";
import { sendEmail } from "../libs/nodeMailer.js";

const jwt_Secret = process.env.jwt_Secret;

function getAppURL() {
  return process.env.APP_URL;
}

async function registerHandler(req: Request, res: Response) {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: result.error.flatten(),
      });
    }

    const { name, email, password } = result.data;

    const normalizedEmail = String(email).toLowerCase().trim();

    const existinguser = await User.findOne({ email: normalizedEmail });

    if (existinguser) {
      return res.status(400).json({
        message: " User Already exists",
      });
    }

    const passwordhash = await hashPassword(password);
    const newlyCreatedUser = await User.create({
      name: name,
      email: normalizedEmail,
      isEmailVerified: false,
      twoFactorEnabled: false,
    });

    if (!jwt_Secret) {
      throw Error("Jwt_Secret not defined in environment variables");
    }

    const verifyToken = jwt.sign(
      {
        sub: newlyCreatedUser.id,
      },
      jwt_Secret,
      {
        expiresIn: "1d",
      },
    );

    const verifyUrl = `${getAppURL()}/auth/verify-email?token=${verifyToken}`;

    await sendEmail(
      newlyCreatedUser.email,
      "Verify your email",
      `
            <p> please verify your email by clicking this link :</p>
            <p> 
                <a href=${verifyUrl}> 
                ${verifyUrl} 
                </a>
            </p>

        
         `,
    );

    return res.status(201).json({
      message: "user Registered",
      user: {
        id: newlyCreatedUser.id,
        email: newlyCreatedUser.email,
        isEmailVerified: newlyCreatedUser.isEmailVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}

async function verifyEmailHandler(req: Request, res:Response) {

}

async function loginHandler(req:Request, res:Response) { 

}

async function refreshHandler(req: Request, res : Response) { 

}

async function logoutHandler(req: Request, res:Response) { 

}

async function forgotPasswordhandler(req:Request, res:Response) { 

}

async function resetPasswordHandler(req : Request, res : Response) {
    
}





export {
    registerHandler,


}