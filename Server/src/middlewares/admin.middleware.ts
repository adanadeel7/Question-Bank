import { Request, Response, NextFunction } from "express";

async function requireAdmin(req : Request, res: Response, next : NextFunction) {
    const role = req.user?.role 

    if(role !== "admin") { 
        return res.status(403).json({
            message : "User Rejected Not Admin"
        })
    }

    next()
    
}

export {requireAdmin}