import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: any;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader: string = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'Missing Token (JWT)' });
    }

    const token: string = authHeader.split(" ")[1];

    try {
        const secret: string = process.env.JWT_SECRET as string;
        req.user = jwt.verify(token, secret); // attach decoded user to request
        next();
    } catch (err) {
        console.error("JWT Verification Failed:", err);
        return res.status(403).json({ message: 'JWT is wrong or expired' });
    }
}
