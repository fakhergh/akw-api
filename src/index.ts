import 'reflect-metadata';
import 'dotenv/config';
import 'mongoose-paginate-v2';
import 'dotenv/config';

import { app } from '@/app';
import { Config } from '@/config';
import { connectDatabase } from '@/database';

const port = Config.app.port;

app.listen(port, async () => {
    console.log('Server is running at port: http://localhost:%s', port);
    if (process.env.NODE_ENV !== 'test') {
        await connectDatabase();
        console.log('Connected to database');
    }
});

app.on('error', console.error);
