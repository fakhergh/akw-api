import { connect } from 'mongoose';

import { Config } from '@/config';

export function connectDatabase() {
    return connect(Config.database.uri, { dbName: Config.database.name });
}
