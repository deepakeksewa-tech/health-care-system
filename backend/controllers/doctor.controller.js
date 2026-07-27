import {DoctorRegistration,DoctorBasic,DoctorLocation,DoctorWeekly, Specialization,Category} from "../models/doctor.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from 'fs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Patient, userModel } from "../models/patient.model.js";
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
         const exist=await DoctorRegistration.findOne({registration:req.body.registrationNo});
        if(exist){
            return res.status(400).json({
                success:false,
                message:"Doctor already added in the database"
            })
        }
        const checkGmail=await DoctorRegistration.findOne({gmail:req.body.gmail.toLowerCase()});
        if(checkGmail){
            return res.status(400).send({
                message:"Gmail already exist",
                success:false
            })
        }
        const doctor = await DoctorRegistration.create({
            name: req.body.name,
            registrationNo:req.body.registrationNo,
            registrationDate:req.body.registrationDate,
            certificate:result.secure_url,
            password:await bcrypt.hash(req.body.password,Number(process.env.HASHROUND)),
            stateMedicalCouncil:req.body.stateMedicalCouncil,
            gmail:req.body.gmail.toLowerCase()
        });
        const sendingMail=await fetch('https://deepak171.app.n8n.cloud/webhook/fa1b2de0-1463-4a4b-8e2c-4caa0c896f3a',{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-type":"application/json"
            },
          body: JSON.stringify({
  mail: req.body.gmail,
  subject: "Thank You for Your Registration – Verification in Progress",
  message: `Dear Doctor,

Thank you for registering with our platform.

We have successfully received your registration request. Our team will carefully review and verify the information and documents you have submitted.

The verification process may take up to 24 hours. Once your account has been verified, you will receive another email with further instructions to complete the onboarding process.

If we require any additional information or documents during the verification process, we will contact you using your registered email address.

Thank you for your patience and for choosing our platform. We look forward to welcoming you to our community.

Best regards,

Verification Team
Doctor Consultancy Platform`
})
        })
        const data=await sendingMail.json()
        return res.status(201).json({
            success: true,
            doctor
        });
    }
    catch (error) {
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
        fs.unlinkSync(req.file.path); // Delete local fil
        const exist=await DoctorBasic.findOne({doctorId:req.id});
        if(exist){
            return res.status(400).json({
                success:false,
                message:"the doctor details already exists"
            })
        }
        const doctor = await DoctorBasic.create({
            doctorId:req.id,
            name: req.body.name,
            experience:req.body.experience,
            image:result.secure_url,
            specification:req.body.specification,
            language:req.body.language,
            contactNo:req.body.contactNo,
            category:req.body.category,
            fee:req.body.fee
        });
        
            const token = jwt.sign(
            {
              id: doctor._id,
            },
            process.env.JWT_TOKEN,
            {
              expiresIn: "1d",
            }
          );
        
          res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production with HTTPS
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
          });

        return res.status(201).json({
            success: true,
            doctor
        });
    }
    catch (error) {
            return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Doctor Hospital Location
export const LocationSetup=async(req,res)=>{

    
    const doctorId=req.id;
    const longitude=req.body.longitude;
    const latitude=req.body.latitude;
    const streetAddress=req.body.streetAddress;
    const landmark=req.body.landmark;
    const city=req.body.city;
    const state=req.body.state;
    const zip=req.body.zip;
    const exist=await DoctorBasic.findById(doctorId);
    if(!exist){
        return res.status(400).send({
            message:"the doctor is not created yet"
        })
    }
    const check=await DoctorLocation.findOne({doctorId:doctorId});
    if(check){
        return res.status(400).send({
            success:false,
            message:"location is already set"
        })
    }
    const saving= await DoctorLocation.create({
       doctorId,longitude,latitude,streetAddress,landmark,city,state,zip 
    })
    return res.status(200).send({
        success:true,
        message:"doctor location added succesfully",
        saving
    })
}


// Doctor Weekly Schedule
export const weeklySchedule=async(req,res)=>{
    const doctorId=req.id;
    const exist=await DoctorBasic.findById(doctorId);
    if(!exist){
        return res.status(400).send({
            success:false,
            message:"doctor is not created yet"
        })
    }
    const check=await DoctorWeekly.findOne({doctorId:doctorId});
    if(check){
        return res.status(400).send({
            success:false,
            message:"the doctor already save the weekly schedule"
        })
    }
    const weekly=req.body.weekly;
    const saving=await DoctorWeekly.create({
        doctorId,weekly
    })
    return res.status(200).send({
        success:true,
        message:"Doctor added the weekly schedule successfully",
        saving
    })
}


// Doctor Login
export const DoctorLogin=async(req,res)=>{
    const gmail=req.body.gmail;
    const password=req.body.password;
    const finding=await DoctorRegistration.findOne({gmail});
    if(!finding){
        return res.status(400).send({
            success:false,
            message:"Please enter the correct credentials"
        })
    }
    if(finding.verificationStatus=='Pending'){
        return res.status(400).send({
            success:false,
            message:"Please complete the  verification process after that you will login"
        })
    }
    if(finding.verificationStatus=='Rejected'){
        return res.status(400).send({
            success:false,
            message:"Your Registration is Rejected by Admin"
        })
    }
    const matching = await bcrypt.compare(password,finding.password);
    if(!matching){
        return res.status(400).send({
            success:false,
            message:"please enter the correct password"
        })
    }

    const token=await jwt.sign({id:finding._id},process.env.JWT_TOKEN)
    res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
    return res.status(200).send({
        success:true,
        message:"login successfully",
        token
    })
}



// ------ get doctor name ---------------
export const getName=async(req,res)=>{
    const id=req.id;
    const exist=await DoctorBasic.findById(id);
    if(!exist){
        return res.status(400).send({
            success:false,
            message:"Doctor is not created  yet"
        })
    }
    return res.status(200).send({
        name:exist.name,
        image:exist.image,
        success:true
    })
}

// ----- add specialixaiton
export const specialization=async(req,res)=>{
    const special=req.body.Specialization.toLowerCase();
    const check=await Specialization.findOne({specilization:special})
    if(check){
        return res.status(400).send({
            success:false,
            message:"the specialixation already exist"
        })
    }
    const save=await Specialization.create({specilization:special});
    return res.status(200).send({
        success:true,
        message:"Added successFully"
    })
}

// ------------- category -------------------
export const category=async(req,res)=>{
    const cat=req.body.Category.toLowerCase();
    const check=await  Category.findOne({category:cat});
    if(check){
        return res.status(400).send({
            success:false,
            message:"the category is already added"
        })
    }
    const save=await Category.create({category:cat})
    return res.status(200).send({
        success:true,
        message:"Added successfully"
    })
}

// ----------------- Read Specialization ---------------
export const ReadSpecialization=async(req,res)=>{
    const read=await Specialization.find();
    if(read.length===0){
        return res.status(200).send({
            success:true,
            data:[]
        })
    }
    return res.status(200).send({
        success:true,
        data:read
    })
}

// ----------------- Read Category ----------------------
export const ReadCategory=async(req,res)=>{
    const read=await Category.find();
    if(read.length==0){
        return res.status(200).send({
            success:true,
            length:0,
            data:[]
        })
    }
    return res.status(200).send({
        success:true,
        length:read.length,
        data:read
    })
}


// ---- get appointment -----
export const getAppointment=async(req,res)=>{
    const id=req.id;
    const check=await DoctorBasic.findOne({doctorId:id});
    if(!check){
        return res.status(400).send({
            success:false,
            message:"Doctor not found"
        })
    }
    console.log(check.id);
    
    const find=await Patient.find({doctorId:check._id});
    if(find.length==0){
        return res.status(400).send({
            success:false,
            message:"there is no appointment ",
            data:[]
        })
    }
    return res.status(200).send({
        success:true,
        data:find,
        message:"the appointment list is "
    })
}


// ------ verify password ------
export const verifyPassword=async(req,res)=>{
    const id=req.id;
    const password=req.body.password;
    const find=await DoctorRegistration.findById(id);
    const compare=await bcrypt.compare(password,find.password);
    if(!compare){
        return res.status(400).send({
            success:false,
            message:"Password not matched"
        })
    }
    return res.status(200).send({
        success:true,
        message:"Password matched successfully"
    })

}