import { Admin } from "../models/admin.model.js";
import { CompanyEmployee } from '../models/companyEmployee.model.js';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const addAdmin = asyncHandler(async (req, res, next) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            throw new ApiError(400, "Username and password are required");
        }

        const existingAdmin = await Admin.findOne({ name });
        if (existingAdmin) {
            throw new ApiError(409, "Admin with this username already exists");
        }

        const newAdmin = new Admin({ name, password });
        await newAdmin.save();

        return res.status(201).json(new ApiResponse(201, newAdmin, "Admin created successfully"));
    } catch (error) {
        next(error);
    }
});

const loginAdmin = asyncHandler(async (req, res, next) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            throw new ApiError(400, "Name and password are required");
        }

        const admin = await Admin.findOne({ name });
        if (!admin || !(await admin.isPasswordCorrect(password))) {
            throw new ApiError(401, "Invalid username or password");
        }

        // Generate JWT tokens
        const accessToken = jwt.sign({ _id: admin._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ _id: admin._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Set tokens as cookies
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Login successful"));

    } catch (error) {
        next(error);
    }
});

const createEmployee = asyncHandler(async (req, res) => {
    try {
        const { fullName, email } = req.body;
        console.log(req.body);
        if (!fullName || !email) {
            return res.status(400).json({ message: "All fields (fullName, email) are required" });
        }

        const newEmployee = new CompanyEmployee({
            employeeId: uuidv4(),
            fullName,
            email,
        });

        await newEmployee.save();

        return res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
    } catch (error) {
        console.error('Error creating employee:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const getAllEmployees = asyncHandler(async (req, res) => {
    try {
        const employees = await CompanyEmployee.find();
        return res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const getEmployeeById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await CompanyEmployee.findOne({ employeeId: id });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        return res.status(200).json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


const deleteEmployee = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEmployee = await CompanyEmployee.findOneAndDelete({ employeeId: id });

        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        return res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

const changeAdmin = asyncHandler(async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new ApiError(400, "Username and password are required");
        }

        await Admin.deleteMany({});

        const newAdmin = new Admin({ username, password });
        await newAdmin.save();

        return res.status(201).json(new ApiResponse(201, newAdmin, "Admin changed successfully"));
    } catch (error) {
        next(error);
    }
});

export {
    addAdmin,
    loginAdmin,
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployee,
    changeAdmin
};
