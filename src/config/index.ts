export const Config = {
    app: {
        port: process.env.PORT || 9000,
    },
    database: {
        name: process.env.DATABASE_NAME!,
        uri: process.env.DATABASE_URI!,
    },
    jwt: {
        access: {
            secret: process.env.ACCESS_TOKEN_SECRET ?? 'secure-access',
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
        },
        refresh: {
            secret: process.env.REFRESH_TOKEN_SECRET ?? 'secure-refresh',
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '1d',
        },
    },
};
