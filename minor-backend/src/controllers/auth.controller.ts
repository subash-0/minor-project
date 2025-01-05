
import { Request, Response } from 'express';
import {compare, hashPassword} from '../utils/bcrypt'
import User  from '../models/User';
import jwt from 'jsonwebtoken';

const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, fullname } = req.body;
  if (!email || !password || !fullname) {
    console.log(email,password,fullname)
    res.status(400).json({ message: 'All fields are required' });
    return;
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id, email : newUser.email, fullname: newUser.fullname }, process.env.JWT_SECRET as string, {
      expiresIn: '3d',
    });

    // Set the token in a cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3*24*3600*1000, // 3 days
      sameSite: 'none',
    });

    // Respond with success
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  
  const {email,password}  = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }
  try {
    const existingUser = await User.findOne({email});
    if(!existingUser){
      res.status(400).json({message: 'Invalid credentials'});
      return;
    }
    const passwordMatch = await compare(password, existingUser.password);
    if(!passwordMatch){
      res.status(400).json({message: 'Invalid credentials'});
      return;
    }
    const token = jwt.sign({userId: existingUser._id, email: existingUser.email, fullname : existingUser.fullname}, process.env.JWT_SECRET as string, {
      expiresIn: '3d',
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3*24*3600*1000, // 3 days
      sameSite: 'none',
    });
    res.status(200).json({message: 'Login successful'});

  } catch (error) {
    console.error(error);
    res.status(500).json({message: error.message});
  }
}

export  {signup, login};
