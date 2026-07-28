import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { DoctorRegistration } from '../models/doctor.model.js';
import crypto from "crypto";
import {ForgetPassword} from '../models/forgetPassword.model.js';
import { userModel } from '../models/patient.model.js';
import { AdminModel } from '../models/admin.model.js';

export const password=async(req,res)=>{
  const find=await DoctorRegistration.findOne({gmail:req.body.gmail});
  if(!find){
    return res.status(400).send({
      success:false,
      message:"the doctor is not found"
    })
  }
   const finding=await ForgetPassword.findOne({userId:find._id});
      
  if(finding){
    return res.status(200).send({
      success:true,
      message:"please use the previous otp which we send"
    })
  }
  const otp = crypto.randomInt(100000, 1000000);
  const save=await ForgetPassword.create({
    userId:find._id,otp
  })
 
  
  const sendMail=await fetch(`https://deepak171.app.n8n.cloud/webhook/fa1b2de0-1463-4a4b-8e2c-4caa0c896f3a`,{
    method:"POST",
    credentials:"include",
    headers:{
      "Content-type":"application/json"
    },
    body:JSON.stringify({
      mail: find.gmail,
     subject: "Password Reset OTP – Doctor Account",

message: `
Hello Dr. ${find.name},

We received a request to reset the password for your doctor account.

Your 6-digit verification OTP is:

${otp}

This OTP is valid for 5 minutes. Please do not share this OTP with anyone.

If you did not request a password reset, you can safely ignore this email.

Regards,
Support Team
`
    })
  })
 
  return  res.status(200).send({
  success:true,
  message:"the otp send successfully",
  })
}







export const checkOtp=async(req,res)=>{
  const gmail=req.body.gmail;
  const userOTP=req.body.userOTP;
  const search=await DoctorRegistration.findOne({gmail});
  if(!search){
    return res.status(400).send({
      success:false,
      message:"The gmail not exist"
    })
  }
  const find=await ForgetPassword.findOne({userId:search._id});
  if(!find){
    return res.status(400).send({
      message:"firstly please click on the forget password then it will send you the otp"
    })
  }
  
  if(find.otp==userOTP){
    await find.deleteOne();
    
    return res.status(200).send({
      success:true,
      message:"the otp match now you will able to change the password"
    })
  }
  return res.status(400).send({
    success:false,
    message:"please enter the correct password"
  })
}







export const createPassword=async(req,res)=>{
  const gmail=req.body.gmail;
  const find=await DoctorRegistration.findOne({gmail});
  if(!find){
    return res.status(400).send({
      success:false,
      message:"the doctor not found"
    })
  }
  const password=req.body.password;
  find.password=await bcrypt.hash(password,Number(process.env.HASHROUND));
  find.save();
  return res.status(200).send({
    success:true,
    message:"The password updated successfully"
  })
}



// ------------------- patient -------------------

export const Patientpassword=async(req,res)=>{
  const find=await userModel.findOne({gmail:req.body.gmail});
  if(!find){
    return res.status(400).send({
      success:false,
      message:"the doctor is not found"
    })
  }
   const finding=await ForgetPassword.findOne({userId:find._id});
      
  if(finding){
    return res.status(200).send({
      success:true,
      message:"please use the previous otp which we send"
    })
  }
  const otp = crypto.randomInt(100000, 1000000);
  const save=await ForgetPassword.create({
    userId:find._id,otp
  })
 
  
  const sendMail=await fetch(`https://deepak171.app.n8n.cloud/webhook/fa1b2de0-1463-4a4b-8e2c-4caa0c896f3a`,{
    method:"POST",
    credentials:"include",
    headers:{
      "Content-type":"application/json"
    },
    body:JSON.stringify({
      mail: find.gmail,
     subject: "Password Reset OTP – User Account",

          message: `
Hello ${find.name},

We received a request to reset the password for your account.

Your 6-digit verification OTP is:

${otp}

This OTP is valid for 5 minutes.

Please do not share this OTP with anyone.

If you did not request a password reset, you can safely ignore this email.

Regards,
Support Team
          `,
        }),
      }
    );

  return  res.status(200).send({
  success:true,
  message:"the otp send successfully",
  })
}







export const PatientcheckOtp=async(req,res)=>{
  const gmail=req.body.gmail;
  const userOTP=req.body.userOTP;
  const search=await userModel.findOne({gmail});
  if(!search){
    return res.status(400).send({
      success:false,
      message:"The gmail not exist"
    })
  }
  const find=await ForgetPassword.findOne({userId:search._id});
  if(!find){
    return res.status(400).send({
      message:"firstly please click on the forget password then it will send you the otp"
    })
  }

  if(find.otp==userOTP){
    await find.deleteOne();
    
    return res.status(200).send({
      success:true,
      message:"the otp match now you will able to change the password"
    })
  }
  return res.status(400).send({
    success:false,
    message:"please enter the correct password"
  })
}







export const PatientcreatePassword=async(req,res)=>{
  const gmail=req.body.gmail;
  const find=await userModel.findOne({gmail});
  if(!find){
    return res.status(400).send({
      success:false,
      message:"the doctor not found"
    })
  }
  const password=req.body.password;
  find.password=await bcrypt.hash(password,Number(process.env.HASHROUND));
  find.save();
  return res.status(200).send({
    success:true,
    message:"The password updated successfully"
  })
}






// ---------------- admin ----------------

export const Adminpassword=async(req,res)=>{
  const find=await AdminModel.findOne({gmail:req.body.gmail});
  if(!find){
    return res.status(400).send({
      success:false,
      message:"the doctor is not found"
    })
  }
   const finding=await ForgetPassword.findOne({userId:find._id});
      
  if(finding){
    return res.status(200).send({
      success:true,
      message:"please use the previous otp which we send"
    })
  }
  const otp = crypto.randomInt(100000, 1000000);
  const save=await ForgetPassword.create({
    userId:find._id,otp
  })
 
  
const sendMail = await fetch(
  "https://deepak171.app.n8n.cloud/webhook/fa1b2de0-1463-4a4b-8e2c-4caa0c896f3a",
  {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mail: find.gmail,
      subject: "Your One-Time Password (OTP) for Verification",
      message: `
Hello ${find.name || "User"},

Your One-Time Password (OTP) for verification is:

🔐 OTP: ${otp}

This OTP is valid for the next 10 minutes.

Please do not share this OTP with anyone. Our team will never ask you for your OTP or password.

If you did not request this verification, you can safely ignore this email.

Thank you for choosing MEDSEWA.

Best regards,
MEDSEWA Support Team
      `,
    }),
  }
);


  return  res.status(200).send({
  success:true,
  message:"the otp send successfully",
  })
}



export const AdmincheckOtp=async(req,res)=>{
  const gmail=req.body.gmail;
  const userOTP=req.body.userOTP;
  const search=await AdminModel.findOne({gmail});
  if(!search){
    return res.status(400).send({
      success:false,
      message:"The gmail not exist"
    })
  }
  const find=await ForgetPassword.findOne({userId:search._id});
  if(!find){
    return res.status(400).send({
      message:"firstly please click on the forget password then it will send you the otp"
    })
  }

  if(find.otp==userOTP){
    await find.deleteOne();
    
    return res.status(200).send({
      success:true,
      message:"the otp match now you will able to change the password"
    })
  }
  return res.status(400).send({
    success:false,
    message:"please enter the correct password"
  })
}


export const AdmincreatePassword=async(req,res)=>{
  const gmail=req.body.gmail;
  const find=await AdminModel.findOne({gmail});
  if(!find){
    return res.status(400).send({
      success:false,
      message:"the doctor not found"
    })
  }
  const password=req.body.password;
  find.password=await bcrypt.hash(password,Number(process.env.HASHROUND));
  find.save();
  return res.status(200).send({
    success:true,
    message:"The password updated successfully"
  })
}