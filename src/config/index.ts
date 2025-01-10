export const Config = {
    app: {
        port: process.env.PORT || 9000,
    },
    database: {
        name: process.env.DATABASE_NAME!,
        uri: process.env.DATABASE_URI!,
    },
};
