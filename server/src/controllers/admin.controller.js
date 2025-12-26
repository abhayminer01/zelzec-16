const Admin = require("../models/admin.model");
const bcrypt = require('bcrypt');

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if(!admin) {
            return res.status(400).json({ success : false, message : "Admin Not found" });
        }

        const compare = await bcrypt.compare(password, admin.password);
        if(!compare) {
            return res.status(400).json({ success : false, message : "Password Missmatch" });
        }

        req.session.admin = { id : admin._id };
        res.status(200).json({ success : true, message : "Successfully Authenticated" });
    } catch (error) {
        res.status(500).json({ success : false, err : error });
    }
}

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let admin = await Admin.findOne({ email });
        if(admin) {
            return res.status(400).json({ success : false, message : "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        admin = await Admin.create({
            email, 
            password : hashedPassword,
            name
        });

        res.status(200).json({ success : true, message : "Admin Created Successfully" });
    } catch (error) {
        res.status(500).json({ success : false, err : error });
    }
}

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updateData = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const admin = await Admin.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    res.status(200).json({ success: true, message: "Admin updated successfully", data: admin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json({ success : true, data : admins });
    } catch (error) {
        res.status(500).json({ success : false, err : error });
    }
}

module.exports = {
    loginAdmin,
    getAllAdmins,
    registerAdmin,
    updateAdmin,
    deleteAdmin
}