import jwt from "jsonwebtoken"

export function createAccessToken(
    userId : string,
    tokenVersion : number,
    role : "student" | "admin"
) {

    const payload = {sub: userId, tokenVersion, role}
    const jwt_Secret = process.env.JWT_SECRET
     return jwt.sign(payload, jwt_Secret!, {
        expiresIn : '30m'
    })

}

export function createRefreshToken(userId : string,
    tokenVersion : number,
    role : "student" | "admin"
) {
    const payload = {sub : userId, tokenVersion, role}
    const jwt_Secret = process.env.JWT_SECRET

    return jwt.sign(payload, jwt_Secret!, {
        expiresIn : '7d'
    })
}

export function verifyRefreshToken(token : string) {
    return jwt.verify(token,process.env.JWT_ACCESS_SECRET! ) as {
        sub : string;
        tokenVersion : number;
        role : "student" | "admin";
    }
}