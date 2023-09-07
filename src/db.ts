import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.DATABASE_URI as string
    );
    console.log('Connected to database');
  } catch (error: any) {
    console.error(error.message);
  }
};

export default connectToDB;
