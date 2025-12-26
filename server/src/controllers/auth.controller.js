const User = require("../models/user.model");
const bcrypt = require('bcrypt');

const checkAuth = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(400).json({ success: false, message: "Not Authenticated" });
        }

        res.status(200).json({ success: true, message: "User is Authenticated", user: req.session.user._id });
    } catch (error) {
        res.status(500).json({ success: false, err: error });
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, err: error })
    }
}

const registerUser = async (req, res) => {
    try {
        const { email, password, mobile, full_name, address, location } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All Fields are required!" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            email: email,
            password: hashedPassword,
            mobile: mobile,
            full_name: full_name,
            address: address,
            location: location
        });

        req.session.user = { id: user._id };
        res.status(200).json({ success: true, user: user._id });

    } catch (error) {
        res.status(500).json({ success: false, err: error });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All Fields are required!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
            return res.status(400).json({ success: false, message: "password missmatch" });
        }

        req.session.user = { id: user._id };
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, err: error });
    }
}

const updateUser = async (req, res) => {
    try {
        const { full_name, mobile, address, location } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                full_name,
                mobile,
                address,
                location
            },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, err: error });
    }
}

const logoutUser = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Could not log out" });
            }
            res.clearCookie('connect.sid'); // Assuming default session cookie name
            res.status(200).json({ success: true, message: "Logged out successfully" });
        });
    } catch (error) {
        res.status(500).json({ success: false, err: error });
    }
}

module.exports = {
    checkAuth,
    registerUser,
    loginUser,
    getUser,
    updateUser,
    logoutUser
}