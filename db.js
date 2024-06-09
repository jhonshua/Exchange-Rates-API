import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async () => {
    const mongooseDB = process.env.MONGOOSE;
    console.log(mongooseDB)

    try {
        await mongoose.connect(mongooseDB);
        console.log('>>> DB is connecte <<<');
    } catch (error) {
        console.log(error);
    }
};
