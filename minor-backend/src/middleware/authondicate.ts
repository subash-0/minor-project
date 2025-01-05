import { Request, Response, NextFunction } from 'express';

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
import jwt from 'jsonwebtoken';

// Define the interface for the decoded token
interface DecodedToken {
  userId: string;
  email: string;
  fullname: string;
  user : string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Extract the token from the cookies
  const token = req.cookies.token;  // Assuming the token is stored as 'token'

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. No token provided.' });
  }

  try {
    // Verify and decode the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as DecodedToken;

    // Set the user data to req.user
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      fullname: decoded.fullname,
    };

    // Call the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};

export default authenticate;
