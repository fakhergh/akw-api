import { exec } from 'child_process';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import { promisify } from 'util';

dotenv.config({ path: '.env.test' });

export default async () => {
    try {
        await connect(process.env.DATABASE_URI!, { dbName: process.env.DATABASE_NAME });
        await promisify(exec)('npm run db:up');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
