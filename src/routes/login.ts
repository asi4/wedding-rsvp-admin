import express, {Request, Response, Router} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, {IUser} from '../models/User.js';

const router: Router = express.Router();

router.post('/login', async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
        const user: IUser = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User wasn't found!" });
        }

        const isMatch: boolean = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password is wrong' });
        }

        const token: string = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '2h' }
        );

        res.json({ token, message: 'Logged in successfully!' });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error, try again' });
    }
});

export default router;
