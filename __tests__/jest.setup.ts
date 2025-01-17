import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
    await mongoose?.connect(process.env.DATABASE_URI!, { dbName: process.env.DATABASE_NAME });
});

afterAll(async () => {
    await mongoose?.disconnect();
});
