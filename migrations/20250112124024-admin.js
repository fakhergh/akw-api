const { Types } = require('mongoose');

const admin = {
    _id: new Types.ObjectId('677d8272651bd7cf8f5c387e'),
    username: 'admin',
    email: 'admin@gmail.com',
    password: '$2a$10$Yk.UNIYHZG.8FqLi4LJUcugLM2dA5h8CA3Xyv2F0p15SuecR/SvaS',
    createdAt: new Date(),
    updatedAt: new Date(),
};

module.exports = {
    async up(db) {
        return db.collection('admins').insertOne(admin);
    },

    async down(db) {
        const filter = { _id: admin._id };
        return db.collection('admins').deleteOne(filter);
    },
};
