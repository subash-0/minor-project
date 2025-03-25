import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the User document
interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
}

// Create the User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

// Create the model with the schema and interface
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
