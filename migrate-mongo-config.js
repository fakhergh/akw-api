const dotenv = require('dotenv');

dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

const config = {
    mongodb: {
        url: process.env.DATABASE_URI,
        databaseName: process.env.DATABASE_NAME,
        options: {},
    },

    // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
    migrationsDir: 'migrations',

    // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
    changelogCollectionName: 'migrations',

    // The file extension to create migrations and search for in migration dir
    migrationFileExtension: '.js',

    // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determine
    // if the file should be run.  Requires that scripts are coded to be run multiple times.
    useFileHash: false,

    // Don't change this, unless you know what you're doing
    moduleSystem: 'commonjs',
};

module.exports = config;
