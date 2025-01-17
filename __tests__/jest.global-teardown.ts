import mongoose from 'mongoose';

export default async () => {
    try {
        await mongoose?.connection.db?.dropDatabase();
        await mongoose?.disconnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
