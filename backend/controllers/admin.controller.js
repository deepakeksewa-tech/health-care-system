import {DoctorRegistration,DoctorBasic} from "../models/doctor.model.js";
import {AdminModel} from "../models/admin.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { Patient, userModel } from '../models/patient.model.js';

// --------------------------- Doctor Data -------------------------------------------------
// list of pending verification doctor list 

export const ReadRegistration=async(req,res)=>{
  const  data=await DoctorRegistration.find({verificationStatus:"Pending"}).select("-password");
  if(data.length==0){
    return res.status(400).send({
      data:[],
      message:"there is no Registration Pending"})
  }

  return res.status(200).send({
    success:true,
    count:data.length,
    data
  })
}
// -------------------------- rejected  --------------------------------------------------
export const RejectRegistration=async(req,res)=>{
  const DoctorId=req.params.id;
  const check=await DoctorRegistration.findById(DoctorId);
  if(!check){
    return res.status(400).send({
      success:false,
      message:"the doctor verification is not in db "
    })
  }
  check.verificationStatus='Rejected'
  check.save();
  const sendingMail = await fetch(
  `${process.env.N8N_WEBHOOK}`,
  {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      mail: check.gmail,
      subject: "Registration Update – Application Rejected",
      message: `Dear Doctor,

Thank you for your interest in joining our platform.

After reviewing the information and documents you submitted, we regret to inform you that your registration application has not been approved at this time.

This decision may be due to one or more of the following reasons:
• Incomplete or incorrect information.
• Invalid or unverifiable medical registration details.
• Unclear or missing supporting documents.
• Failure to meet our verification requirements.

If you believe this decision was made in error, or if you wish to apply again with updated and accurate information, you are welcome to submit a new registration.

Thank you for your understanding.

Best regards,

Verification Team
Doctor Consultancy Platform`,
    }),
  }
);

const data = await sendingMail.json();

  return res.status(200).send({
    success:true,
    message:"doctor verification rejected successfully"
  })

}
// --------------------- Accept ------------------------------------
export const AcceptRegistration=async(req,res)=>{
  const doctorId=req.params.id;
  const check = await DoctorRegistration.findById(doctorId);
  if(!check){
    return res.status(400).send({
      success:false,
      message:"the doctor verification data is not in db "
    })
  }
  check.verificationStatus='Verified'
  check.save();
   const token = jwt.sign(
    {
      id: check._id,
    },
    process.env.JWT_TOKEN,
    {
      expiresIn: "1d",
    }
  )
 const sendingMail = await fetch(
  `${process.env.N8N_WEBHOOK}`,
  {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mail: check.gmail,
      subject: "Your Account Has Been Verified",
      message: `Dear Doctor,

Congratulations!

Your account has been successfully verified.

To complete your registration, please click the link below and fill in the remaining details:

${process.env.FRONTEND_URL}/BasicDetails/${token}

Please complete this process as soon as possible. If the link does not work, copy and paste it into your browser.

If you experience any issues, please contact our support team.

Best regards,

Verification Team
Doctor Consultancy Platform`,
    }),
  }
);

  return res.status(200).send({
    success:true,
    message:"the doctor verification accepted successfully"
  })
}
// list of basic details of the doctor
export const ReadBasicDetails=async(req,res)=>{
  const data=await DoctorBasic.find();
  if(data.length==0){
    return res.status(400).send({
      success:false,
      message:"There is no doctor added here",
      data:[]
    })

  }
  return res.status(200).send({
    success:true,
    message:"the doctor basics details are",
    data
  })
}


export const deletingDoctor=async(req,res)=>{
  const id=req.params.id;
  const check=await DoctorBasic.findById(id);
  if(!check){
    return res.status(400).send({
      success:false,
      message:"No doctor is found"
    })
  }
  await DoctorBasic.findByIdAndDelete(id);
  return res.status(200).send({
    success:true,
    message:"Doctor Deleted successfully"
  })
}


// ---------------------------------------- Admin phase -----------------------
// admin create,login password and gmail checking ,All admin List
export const AdminCreate=async(req,res)=>{
  const gmail=req.body.gmail.toLowerCase();
  const check =await AdminModel.findOne({gmail});
  if(check){
    return res.status(400).send({
      success:false,
      message:"the admin already created"
    })
  }
  const bcryptpassword=await bcrypt.hash("12345",Number(process.env.HASHROUND))
  const save=await AdminModel.create({gmail,password:bcryptpassword});
  const n8n=await fetch(`${process.env.N8N_WEBHOOK}`,
    {
      method:"POST",
        headers: {
      "Content-Type": "application/json",
    },
body: JSON.stringify({
  mail: gmail,
  subject: `Admin Access Granted - Welcome to the Team`,
  message: `Dear Team Member,

Congratulations!

You have been granted Admin access to our platform. You can now log in using your registered email address and access the administrative features assigned to your role.

Your default login credentials are:

Email: ${gmail}
Password: 12345

For security reasons, this is a temporary default password. Please log in as soon as possible and change your password to a strong, unique password. Do not share your login credentials with anyone.

If you experience any issues accessing your account, please contact the system administrator.

Welcome to the team, and thank you for being a part of our organization.

Best regards,
Admin Team`
})
    }
  )
  return res.status(200).send({
    success:true,
    message:"admin created successfully"
  })
}


export const deletingAdmin=async(req,res)=>{
  const id=req.params.id;
  const check=await AdminModel.findById(id);
  if(!check){
    return res.status(400).send({
      success:false,
      message:"there is no admin with this id "
    })
  }
  await AdminModel.findByIdAndDelete(id);
  return res.status(200).send({
    success:true,
    message:"Admin Deleted successfully"
  })
}

export const checkPassword=async(req,res)=>{
  const password=req.body.password;
  const gmail=req.body.gmail.toLowerCase();
  const checking=await AdminModel.findOne({gmail});
  if(!checking){
    return res.status(400).send({
      success:false,
      message:"Please Enter the valid credentials"
    })
  }
  const compare=await bcrypt.compare(password,checking.password);
  if(!compare){
    return res.status(400).send({
      success:false,
      message:"please enter the correct password"
    })
  }
    const token = jwt.sign(
    {
      id: checking._id,
    },
    process.env.JWT_TOKEN,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // true in production with HTTPS
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(200).send({
    succes:true,
    token,
    message:"login successfully"
  })
}

export const ListOfAdmins=async(req,res)=>{
  const data=await AdminModel.find().select("-password");
  if(data.length==0){
    return res.status(400).send({
      success:false,
      message:"there is no admin"
    })
  }
  return res.status(200).send({
    success:true,
    count:data.length,
    data
  })
}







export const getAllUsers=async(req,res)=>{
    const find=await userModel.find();
    if(find.length==0){
        return res.status(400).send({
            success:false,
            message:"there is no doctor yet",
            data:[]
        })
    }
    return res.status(200).send({
        success:true,
        message:"the users are",
        data:find
    })
}

export const getAllPatients=async(req,res)=>{
  const id=req.params.id;
  const find=await Patient.find({userId:id}).populate("doctorId");
  if(find.length==0){
    return res.status(400).send({
      success:false,
      message:"there is no any booking",
      data:[]
    })
  }
  return res.status(200).send({
    success:true,
    message:"the patients are",
    data:find
  })
}




export const doctorHistory=async(req,res)=>{
    const id=req.params.id;
    const find=await Patient.find({doctorId:id}).populate("userId");
    if(find.length==0){
        return res.status(400).send({
            success:true,
            message:"there is no booking",
            data:[]
        })
    }
    return res.status(200).send({
        success:true,
        message:"the bookings are",
        data:find
    })
}