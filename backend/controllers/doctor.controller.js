import {DoctorRegistration,DoctorBasic,DoctorLocation,DoctorWeekly, Specialization,Category} from "../models/doctor.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from 'fs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Patient, userModel } from "../models/patient.model.js";
import { payment } from "../models/payment.model.js";

// create the row for the registration details for the doctor 
export const createRegistrationDoctor = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success:false,
                message: "Image Required"
            });
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Doctors"
        });        
        fs.unlinkSync(req.file.path);
        
        const exist = await DoctorRegistration.findOne({registration:req.body.registrationNo});
        if(exist){
            return res.status(400).json({
                success:false,
                message:"Doctor already added in the database"
            })
        }
        const checkGmail = await DoctorRegistration.findOne({gmail:req.body.gmail.toLowerCase()});
        if(checkGmail){
            return res.status(400).send({
                message:"Gmail already exist",
                success:false
            })
        }
     
        const doctor = await DoctorRegistration.create({
            name: req.body.name,
            registrationNo: req.body.registrationNo,
            registrationDate: req.body.registrationDate,
            certificate: result.secure_url,
            password: await bcrypt.hash(req.body.password, Number(process.env.HASHROUND)),
            stateMedicalCouncil: req.body.stateMedicalCouncil,
            gmail: req.body.gmail.toLowerCase()
        });

        const mail = process.env.N8N_WEBHOOK;
        if (mail) {
            await fetch(`${mail}`,{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-type":"application/json"
                },
                body: JSON.stringify({
                    mail: req.body.gmail,
                    subject: "Thank You for Your Registration – Verification in Progress",
                    message: `Dear Doctor,\n\nThank you for registering with our platform.\n\nWe have successfully received your registration request. Our team will carefully review and verify the information and documents you have submitted.\n\nThank you for your patience.`
                })
            });
        }
        
        return res.status(201).json({
            success: true,
            doctor
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// create the row of the basic details of the doctor
export const createBasicDoctor = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success:false,
                message: "Image Required"
            });
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Doctors"
        });
        fs.unlinkSync(req.file.path);

        const exist = await DoctorBasic.findOne({doctorId:req.id});
        if(exist){
            return res.status(400).json({
                success:false,
                message:"the doctor details already exists"
            })
        }
        const getname=await DoctorRegistration.findById(req.id);
        const doctor = await DoctorBasic.create({
            doctorId: req.id,
            name: getname.name,
            experience: req.body.experience,
            image: result.secure_url,
            specification: req.body.specification,
            language: req.body.language,
            contactNo: req.body.contactNo,
            category: req.body.category,
            fee: req.body.fee
        });
        
        const token = jwt.sign(
            { id: doctor._id },
            process.env.JWT_TOKEN,
            { expiresIn: "1d" }
        );
     
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            doctor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Doctor Hospital Location
export const LocationSetup = async(req,res)=>{
    const doctorId = req.id;
    const { longitude, latitude, streetAddress, landmark, city, state, zip } = req.body;
    console.log(req.id);
    
    const exist = await DoctorBasic.findById(doctorId);
    console.log(exist);
    
    if(!exist){
        return res.status(400).send({
            success: false,
            message: "the doctor is not created yet"
        })
    }
    const check = await DoctorLocation.findOne({doctorId});
    if(check){
        return res.status(400).send({
            success:false,
            message:"location is already set"
        })
    }
    const saving = await DoctorLocation.create({
       doctorId, longitude, latitude, streetAddress, landmark, city, state, zip 
    })
    return res.status(200).send({
        success:true,
        message:"doctor location added succesfully",
        saving
    })
}

// Doctor Weekly Schedule
export const weeklySchedule = async(req,res)=>{
    const doctorId = req.id;
    const exist = await DoctorBasic.findById(doctorId);
    if(!exist){
        return res.status(400).send({
            success:false,
            message:"doctor is not created yet"
        })
    }
    const check = await DoctorWeekly.findOne({doctorId});
    if(check){
        return res.status(400).send({
            success:false,
            message:"the doctor already save the weekly schedule"
        })
    }
    const weekly = req.body.weekly;
    const saving = await DoctorWeekly.create({
        doctorId, weekly
    })
    return res.status(200).send({
        success:true,
        message:"Doctor added the weekly schedule successfully",
        saving
    })
}

// Doctor Login
export const DoctorLogin = async(req,res)=>{
    const { gmail, password } = req.body;
    const finding = await DoctorRegistration.findOne({gmail});
    if(!finding){
        return res.status(400).send({
            success:false,
            message:"Please enter the correct credentials"
        })
    }
    if(finding.verificationStatus == 'Pending'){
        return res.status(400).send({
            success:false,
            message:"Please complete the verification process after that you will login"
        })
    }
    if(finding.verificationStatus == 'Rejected'){
        return res.status(400).send({
            success:false,
            message:"Your Registration is Rejected by Admin"
        })
    }
    const matching = await bcrypt.compare(password, finding.password);
    if(!matching){
        return res.status(400).send({
            success:false,
            message:"please enter the correct password"
        })
    }

    const token = jwt.sign({id: finding._id}, process.env.JWT_TOKEN);
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).send({
        success: true,
        message: "login successfully",
        token
    })
}

// ------ get doctor name ---------------
export const getName = async(req,res)=>{
    const id = req.id;
    const exist = await DoctorBasic.findById(id);
    if(!exist){
        return res.status(400).send({
            success:false,
            message:"Doctor is not created yet"
        })
    }
    console.log(exist);
    return res.status(200).send({
        name: exist.name,
        image: exist.image,
        success: true
    })
}

// ----- add specialization
export const specialization = async(req,res)=>{
    const special = req.body.Specialization.toLowerCase();
    const check = await Specialization.findOne({specilization: special});
    if(check){
        return res.status(400).send({
            success:false,
            message:"the specialization already exist"
        })
    }
    await Specialization.create({specilization: special});
    return res.status(200).send({
        success:true,
        message:"Added successFully"
    })
}

// ------------- category -------------------
export const category = async(req,res)=>{
    const cat = req.body.Category.toLowerCase();
    const check = await Category.findOne({category: cat});
    if(check){
        return res.status(400).send({
            success:false,
            message:"the category is already added"
        })
    }
    await Category.create({category: cat});
    return res.status(200).send({
        success:true,
        message:"Added successfully"
    })
}

// ----------------- Read Specialization ---------------
export const ReadSpecialization = async(req,res)=>{
    const read = await Specialization.find();
    return res.status(200).send({
        success:true,
        data: read
    })
}

// ----------------- Read Category ----------------------
export const ReadCategory = async(req,res)=>{
    const read = await Category.find();
    return res.status(200).send({
        success:true,
        length: read.length,
        data: read
    })
}

// ---- get appointment -----
export const getAppointment = async(req,res)=>{
    const id = req.id;
    const check = await DoctorBasic.findOne({doctorId: id});
    if(!check){
        return res.status(400).send({
            success:false,
            message:"Doctor not found"
        })
    }
    
    const find = await Patient.find({doctorId: check._id});
    if(find.length === 0){
        return res.status(400).send({
            success:false,
            message:"there is no appointment",
            data:[]
        })
    }
    return res.status(200).send({
        success:true,
        data: find,
        message:"the appointment list is"
    })
}

// ---- update appointment status (With Completed/Cancelled guard) -----
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!id || !status) {
            return res.status(400).json({ 
                success: false, 
                message: "Appointment ID and status are required." 
            });
        }

        const validStatuses = ["Pending", "Ongoing", "Completed", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid status value." 
            });
        }

        const appointment = await Patient.findById(id);
        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: "Appointment not found." 
            });
        }

        // GUARD: Block changes if already Completed or Cancelled
        if (appointment.status === "Completed" || appointment.status === "Cancelled") {
            return res.status(403).json({
                success: false,
                message: `Cannot modify status. This appointment is already ${appointment.status}.`
            });
        }

        appointment.status = status;
        appointment.updatedAt = Date.now();
        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment status updated successfully.",
            data: appointment
        });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ------ verify password ------
export const verifyPassword = async(req,res)=>{
    const id = req.id;
    const password = req.body.password;
    const find = await DoctorRegistration.findById(id);
    const compare = await bcrypt.compare(password, find.password);
    if(!compare){
        return res.status(400).send({
            success:false,
            message:"Password not matched"
        })
    }
    
    const check = await DoctorBasic.findOne({doctorId: id});
    if(!check){
        return res.status(400).send({
            success:false,
            message:"doctor not found"
        })
    }
    const finding = await payment.findOne({userId: check._id});
    if(!finding){
        return res.status(400).send({
            success:false,
            message:"no payment record found",
            data:0
        })
    }
    return res.status(200).send({
        success:true,
        message:"THE DOCTOR DEBIT MONEY IS",
        data: finding.money
    })
}

export const creditedMoney = async(req,res)=>{
    const id = req.id;
    const check = await DoctorBasic.findOne({doctorId: id});
    if(!check){
        return res.status(400).send({
            success:false,
            message:"Doctor not found"
        })
    }
    const finding = await payment.findOne({userId: check._id});
    if(!finding){
        return res.status(400).send({
            success:false,
            message:"Payment record not found"
        })
    }
    if (finding.money <= 0) {
      return res.status(400).json({
        success: false,
        message: "No money available in wallet",
      });
    }

    finding.money = 0;
    await finding.save();
    return res.status(200).send({
        success: true,
        message: "The doctor credited the money in our account"
    })
}

// 📥 Get Doctor Settings (Fixed find -> findOne)
export const getDoctorSettings = async (req, res) => {
    try {
        const doctorBasicId = req.id; 

        const doctorBasic = await DoctorBasic.findOne({ doctorId: doctorBasicId });
        if (!doctorBasic) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const doctorWeekly = await DoctorWeekly.findOne({ doctorId: doctorBasic._id });

        return res.status(200).json({
            success: true,
            data: {
                name: doctorBasic.name,
                gmail: doctorBasic.gmail,
                contactNo: doctorBasic.contactNo,
                specification: doctorBasic.specification,
                experience: doctorBasic.experience,
                fee: doctorBasic.fee,
                image: doctorBasic.image,
                weekly: doctorWeekly ? doctorWeekly.weekly : []
            }
        });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 💾 Update General Settings
export const updateDoctorSettings = async (req, res) => {
    try {
        const doctorBasicId = req.id;
        const { name, experience, fee, contactNo, specification } = req.body;

        const updatedDoctor = await DoctorBasic.findOneAndUpdate(
            { doctorId: doctorBasicId },
            {
                name,
                experience,
                fee,
                contactNo,
                specification
            },
            { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        return res.status(200).json({ success: true, message: "Settings updated successfully", data: updatedDoctor });
    } catch (err) {
        console.error("Update settings error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// 🔄 Update Weekly Schedule (Fixed model reference bug)
export const updateWeeklyOff = async (req, res) => {
    try {
        const doctorBasicId = req.id;
        const { weekly } = req.body; 

        const doctorBasic = await DoctorBasic.findOne({ doctorId: doctorBasicId });
        if (!doctorBasic) {
            return res.status(404).json({ success: false, message: "Doctor basic details not found" });
        }

        let doctorWeekly = await DoctorWeekly.findOne({ doctorId: doctorBasic._id });

        if (!doctorWeekly) {
            doctorWeekly = await DoctorWeekly.create({
                doctorId: doctorBasic._id,
                weekly
            });
        } else {
            doctorWeekly.weekly = weekly;
            await doctorWeekly.save();
        }

        return res.status(200).json({ 
            success: true, 
            message: "Weekly schedule updated successfully", 
            weekly: doctorWeekly.weekly 
        });
    } catch (err) {
        console.error("Weekly schedule update error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};