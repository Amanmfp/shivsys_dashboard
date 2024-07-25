import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const companyEmployeeSchema = new Schema({
    employeeId: {
        type: String,
        default: uuidv4,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
});

export const CompanyEmployee = mongoose.model("CompanyEmployee", companyEmployeeSchema);
