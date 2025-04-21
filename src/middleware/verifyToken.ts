import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

// Custom Request with `user`
interface AuthRequest extends Request {
    user?: string | JwtPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader: string = req.headers.authorization;
    const BEARER_PREFIX: string = "Bearer ";

    if (!authHeader.startsWith(BEARER_PREFIX)) {
        res.status(401).json({ message: "Missing Token (JWT)" });
        return;
    }

    const token: string = authHeader.split(" ")[1];

    try {
        const secret: string = process.env.JWT_SECRET as string;
        req.user = jwt.verify(token, secret); // ⬅️ Contains _id and role if token is built correctly
        next();
    } catch (err: any) {
        console.error("JWT Verification Failed:", err);
        res.status(403).json({ message: "JWT is wrong or expired" });
    }
};