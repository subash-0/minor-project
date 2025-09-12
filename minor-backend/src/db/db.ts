import mongoose from "mongoose";

const connectDb = async () => {
   
       try {
        await mongoose.connect(process.env.MONGO_URI as string);
          console.log('Connected to the database');
       } catch (error) {
              console.error('Error connecting to the database: ', error);
              process.exit(1);
         }
    }


export  {connectDb};