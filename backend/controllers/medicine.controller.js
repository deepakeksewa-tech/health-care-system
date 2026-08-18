import MedicineSeller from "../models/medicine.model.js";
import PatientMedicine from "../models/patient.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const loginMedicineSeller = async (req, res) => {
  try {
    const { gmail, password } = req.body; 
    const checkMedicineSeller = await MedicineSeller.findOne({ gmail});
    if (!checkMedicineSeller) {
      return res.status(401).json({ success: false, message: "Invalid email " });
    } 
    const compare=await bcrypt.compare(password, checkMedicineSeller.password);
    if (!compare) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    } 
    const token=await jwt.sign({id:finding._id},process.env.JWT_TOKEN)

    res.cookie("token", token, {
        httpOnly: true,
        secure: true, // true in production with HTTPS
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      checkMedicineSeller.online=true
      await checkMedicineSeller.save()
    res.status(200).json({ success: true, message: "Login successful" ,token});
  } catch (error) {
    console.error("Error during medicine seller login:", error);
    res.status(500).json({ success: false, message: "Internal server error" }); 
  }
  }


  export const logoutMedicineSeller = async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // Set to true in production with HTTPS
      sameSite: "none",
    });
    }
    catch (error) {
      console.error("Error during medicine seller logout:", error);
      res.status(500).json({ success: false, message: "Internal server error" }); 
    }}

export const SignupMedicineSeller = async (req, res) => {
  try {
    const { gmail, password, name, shopName, contact } = req.body;
    const existingSeller = await MedicineSeller.findOne({ gmail });
    if (existingSeller) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = new MedicineSeller({
      gmail,
      password: hashedPassword, 
      name,
      shopName,
      contact,
    });
    await newSeller.save();
    res.status(201).json({ success: true, message: "Medicine seller registered successfully" });
  } catch (error) {
    console.error("Error during medicine seller signup:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  }

export const getMedicineSellerDetails = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const medicineSeller = await MedicineSeller.findById(decoded.id).select("-password");
    if (!medicineSeller) {
      return res.status(404).json({ success: false, message: "Medicine seller not found" });
    }

    const patientMedicines = await PatientMedicine.find({ ownerId: medicineSeller._id });

    res.status(200).json({ success: true, medicineSeller, patientMedicines });  
    
  } catch (error) {
    console.error("Error fetching medicine seller details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
