import mongoose from "mongoose";
import { User } from "../models/User.models.js";
import { Request, Response } from "express";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.schema.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { checkPassword, hashPassword } from "../libs/hash.js";
import { sendEmail } from "../libs/nodeMailer.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../libs/token.js";

const jwt_Secret = process.env.JWT_ACCESS_SECRET;

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
      password: passwordhash,
      isEmailVerified: false,
      twoFactorEnabled: false,
    });

    if (!jwt_Secret) {
      throw Error("Jwt_Secret not defined in environment variables");
    }

    const verifyToken = jwt.sign(
      {
        sub: newlyCreatedUser.id,
        purpose: "email-verify",
      },
      jwt_Secret,
      {
        expiresIn: "1d",
        algorithm: "HS256",
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

async function verifyEmailHandler(req: Request, res: Response) {
  const token = req.query.token as string | undefined;

  if (!token) {
    return res.status(400).json({ message: " Verification token is missing" });
  }

  try {
    if (!jwt_Secret) {
      throw Error("jwt Secret not in envoriment variables");
    }

    const payload = jwt.verify(token, jwt_Secret, { algorithms: ["HS256"] }) as {
      sub: string;
      purpose?: string;
    };

    if (payload.purpose !== "email-verify") {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(400).json({ message: `User not Found` });
    }

    if (user.isEmailVerified) {
      return res.json({ message: "Email is already verified" });
    }

    user.isEmailVerified = true;

    await user.save();

    return res.json({ message: "Email is now verified, Please Login" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}

async function loginHandler(req: Request, res: Response) {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data",
        errors: result.error.flatten(),
      });
    }

    const { email, password } = result.data;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const ok = await checkPassword(password, user.password);

    if (!ok) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please Verify Email",
      });
    }

    const accessToken = createAccessToken(user.id, Number(user.tokenVersion), user.role);

    const refreshToken = createRefreshToken(user.id, Number(user.tokenVersion), user.role);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Success",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}

async function refreshHandler(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken as string | undefined;

    if (!token) {
      return res.status(401).json({ message: `Refresh Token Missing` });
    }

    const payload = verifyRefreshToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: "Refresh token invalidated" });
    }

    const newAccessToken = createAccessToken(
      user.id,
      Number(user.tokenVersion),
      user.role,
    );

    const newRefreshToken = createRefreshToken(
      user.id,
      Number(user.tokenVersion),
      user.role,
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Success",
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}

async function logoutHandler(req: Request, res: Response) {
  const token = req.cookies?.refreshToken as string | undefined;

  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await User.findByIdAndUpdate(payload.sub, { $inc: { tokenVersion: 1 } });
    } catch (error) {
      // token already invalid/expired — nothing to invalidate server-side
    }
  }

  res.clearCookie("refreshToken", { path: "/" });

  return res.status(200).json({
    message: "User logout",
  });
}

async function forgotPasswordhandler(req: Request, res: Response) {
  const result = forgotPasswordSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: result.error.flatten(),
    });
  }

  const { email } = result.data;

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({
        message:
          " iF an account with this email exists, we will send you an email",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPassword = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetUrl = `${getAppURL()}/auth/reset-password?token=${rawToken}`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      `<p>You Requested password reset. Click on the below link to reset the password</p>
            <p> 
                <a href= "${resetUrl}">
                ${resetUrl}
                </a>
            </p>
            `,
    );

    return res.json({
      message:
        "If an account with this email exists we will send you a reset link",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Error",
    });
  }
}

async function resetPasswordHandler(req: Request, res: Response) {
  const result = resetPasswordSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: result.error.flatten(),
    })
  }

  const { token, password } = result.data

     try {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

        const user = await User.findOne({
            resetPassword : tokenHash,
        resetPasswordExpires : {$gt : new Date()}})

        if (!user) { 
            return res.status(400).json({message: 'Invalid or expired Token'})
        }

        const newPasswordhash = await hashPassword(password)
        user.password = newPasswordhash; 
        user.set('resetPassword', undefined);
        user.set('resetPasswordExpires', undefined);

        user.tokenVersion = Number(user.tokenVersion) + 1; 

        await user.save()
        return res.json({
            message : 'Password reset successfully'
        })

    } catch (err) { 
        console.log(err)
         return res.status(500).json({
            message : "Internal Error"
        })
    }
}

async function meHandler(req: Request, res: Response) {
  const user = req.user!;

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      role: user.role,
    },
  });
}

export { verifyEmailHandler,loginHandler,refreshHandler,logoutHandler,registerHandler,forgotPasswordhandler,resetPasswordHandler,meHandler };
