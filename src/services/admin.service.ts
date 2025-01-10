import { FilterQuery } from 'mongoose';
import { Service } from 'typedi';

import AdminModel, { Admin } from '@/models/admin.model';

@Service()
export class AdminService {
    getAdminById(id: string) {
        return AdminModel.findById(id);
    }

    getAdminByEmail(email: string) {
        const filter: FilterQuery<Admin> = { email };
        return AdminModel.findOne(filter);
    }
}
