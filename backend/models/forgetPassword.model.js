import mongoose from 'mongoose'

const forgetPasswordSchema=new mongoose.Schema({
  userId:{
      type: mongoose.Schema.Types.ObjectId,
         ref: "DoctorRegistration",
         required: true,
       },
  otp:{
    type:String,
    required:true
  }
})

const ForgetPassword = mongoose.model(
  "ForgetPassword",
  forgetPasswordSchema
);
export  {ForgetPassword};