import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import { sendCredentialsMail } from "../utils/sendCredentialsMail.js";

// ------------ REGISTER ------------
export const registerAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists)
      return res.status(400).json({
        success: false,
        error: "Admin already exists",
      });

    const adminId = "ADMIN" + Math.floor(100000 + Math.random() * 900000);
    const password = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(password, 10);

    await Admin.create({ email, adminId, passwordHash });

    await sendCredentialsMail(email, adminId, password);

    res.json({
      success: true,
      message: "Admin created & credentials sent",
      adminId,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// ------------ LOGIN ------------
export const loginAdmin = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    const admin = await Admin.findOne({ adminId });
    if (!admin)
      return res.status(400).json({ success: false, error: "Admin ID not found" });

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match)
      return res.status(400).json({ success: false, error: "Incorrect password" });

    res.json({
      success: true,
      admin: {
        adminId: admin.adminId,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};
