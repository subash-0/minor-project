import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include the user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string;
      email: string;
      fullname: string;
    };
  }
}

// Define the interface for the decoded token
interface DecodedToken {
  userId: string;
  email: string;
  fullname: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  // Extract the token from the cookies
  const token = req.cookies.token; // Assuming the token is stored as 'token'

  if (!token) {
    res.status(401).json({ message: 'Authentication failed. No token provided.' });
    return;
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
   
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      fullname: decoded.fullname,
    };

    // Call the next middleware or route handler
    next();
  } catch (error) {
    
    res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};

export { authenticate };
