const User = require('../models/user.model');
const { successResponse, errorResponse } = require('../utils/response.utils');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(errorResponse('Email already registered'));
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate token
        const token = user.generateToken();

        res.status(201).json(successResponse({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        }, 'User registered successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error registering user', error.message));
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        // Generate token
        const token = user.generateToken();

        res.json(successResponse({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        }, 'Login successful'));
    } catch (error) {
        res.status(500).json(errorResponse('Error logging in', error.message));
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        res.json(successResponse({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }));
    } catch (error) {
        res.status(500).json(errorResponse('Error fetching profile', error.message));
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json(errorResponse('User not found'));
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json(errorResponse('Email already in use'));
            }
            user.email = email;
        }

        if (name) {
            user.name = name;
        }

        await user.save();

        res.json(successResponse({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }, 'Profile updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error updating profile', error.message));
    }
};
