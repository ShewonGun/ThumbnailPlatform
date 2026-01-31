import { Request, Response } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

//Controller for user registratrion
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        //Find user by email
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        //Setting user data in session
        req.session.isLoggedIn = true;
        req.session.userId = newUser._id.toString();

        return res.status(201).json({ 
            message: 'User registered successfully',
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
         });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message }); 
    }

}


//Controller for user login
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        //Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //Setting user data in session
        req.session.isLoggedIn = true;
        req.session.userId = user._id.toString();

        return res.status(200).json({ 
            message: 'User logged in successfully',
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message }); 
    }
}

//Controller for user logout
export const logoutUser = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Logout failed' });
        }
    });
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'User logged out successfully' });
}

//Controller for user verify
export const verifyUser = async (req: Request, res: Response) => {
    try {
        const userId = req.session;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({user});

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message }); 
    }
}


