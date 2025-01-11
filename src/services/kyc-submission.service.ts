import { FilterQuery, PaginateOptions, Types } from 'mongoose';
import { Service } from 'typedi';

import KycSubmissionModel, { KycSubmission } from '@/models/kyc-submission.model';
import { KycSubmissionStatus } from '@/types/kyc-submission.type';

export interface CreateKycSubmissionData {
    userId: Types.ObjectId | string;
    documents: Array<{ path: string; mimetype: string; size: number }>;
}

@Service()
export class KycSubmissionService {
    getPaginatedKycSubmissions(page = 1, limit = 10) {
        const filter = {};
        const paginateOptions: PaginateOptions = {
            page,
            limit,
            sort: { createdAt: -1 },
            populate: 'user',
        };

        return KycSubmissionModel.paginate(filter, paginateOptions);
    }

    getTotalKycSubmissionsCountByStatus(status?: KycSubmissionStatus) {
        const filter: FilterQuery<KycSubmission> = {};

        if (status) filter.status = status;

        return KycSubmissionModel.countDocuments(filter);
    }

    getSubmissionsByUserId(id: number) {
        const filter = { _id: id };
        const sortOptions = { createdAt: -1 };

        return KycSubmissionModel.find(filter, sortOptions);
    }

    async getLastSubmissionByUserId(id: Types.ObjectId | string) {
        const filter = { _id: id };
        const sortOptions = { createdAt: -1 };

        const submission = await KycSubmissionModel.findOne(filter, sortOptions);

        if (submission) submission.populate('user');

        return submission;
    }

    async updateSubmissionStatus(
        id: Types.ObjectId | string,
        status: KycSubmissionStatus.APPROVED | KycSubmissionStatus.REJECTED,
    ) {
        const filter = { _id: id };
        const update = { $set: { status } };
        const options = { new: true };

        const submission = await KycSubmissionModel.findOneAndUpdate(filter, update, options);

        if (submission) submission.populate('user');

        return submission;
    }

    async createSubmission(data: CreateKycSubmissionData) {
        const submission = await KycSubmissionModel.create(data);

        await submission.populate('user');

        return submission;
    }
}
