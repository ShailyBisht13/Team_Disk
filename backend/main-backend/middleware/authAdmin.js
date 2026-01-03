import jwt from "jsonwebtoken"; 
import Admin from "../models/Admin.js"; 
const JWT_SECRET = process.env.JWT_SECRET || "change_this"; 
export default async function (req, res, next) { 
const auth = req.headers.authorization; 
if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ 
success: false, error: "No token" }); 
const token = auth.split(" ")[1]; 
try { 
const payload = jwt.verify(token, JWT_SECRET); 
const admin = await Admin.findById(payload.id); 
if (!admin) return res.status(401).json({ success: false, error: "Invalid token" }); 
req.admin = admin; 
next(); } catch (err) { 
res.status(401).json({ success: false, error: "Token invalid" }); } 
}
