import { Request,Response } from "express";
import { UserStats } from "../models/userStats.models";

async function getMyStatsHandler(req:Request, res:Response) {
    try {
        const findUser = await UserStats.findOne({user : req.user!.id })

        if (!findUser) {
            return res.status(200).json({
                message : 'No attempts yet',
                stats : {
                    topics : {},
                    totalAttempted : 0,
                    totalMarksScored : 0,
                    totalMarksPossible : 0,
                },
            })
        }

        return res.status(200).json({
            message : 'Stats found',
            stats : findUser,
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({message : "Internal Error"})
    }
}


export {getMyStatsHandler}
