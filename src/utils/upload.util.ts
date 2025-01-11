import * as fs from 'fs/promises';
import { diskStorage, Options } from 'multer';
import path from 'path';
import { BadRequestError, UploadedFile } from 'routing-controllers';

import { Config } from '@/config';

const uploadDirectory = Config.upload.documents.directory;

const storage = diskStorage({
    destination: async (_, __, cb) => {
        try {
            await fs.mkdir(uploadDirectory, { recursive: true });
            cb(null, uploadDirectory);
        } catch (error: any) {
            cb(error, uploadDirectory);
        }
    },
    filename: (_, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const multerOptions: Options = {
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Max file size of 10MB
    },
    fileFilter: (_, file, cb) => {
        // Only allow images (optional)
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            return cb(new BadRequestError('Only image files are allowed.'));
        }
    },
};

export function FileUpload(name: string) {
    return UploadedFile(name, { options: multerOptions });
}
