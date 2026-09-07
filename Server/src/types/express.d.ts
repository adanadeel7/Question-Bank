import type { HydratedDocument } from "mongoose";
import type { UserInterface } from "../models/User.models.js";

declare global {
    namespace Express {
        interface Request {
            user? : HydratedDocument<UserInterface>;
        }
    }
}

export {};
