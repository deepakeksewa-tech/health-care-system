import mongoose from 'mongoose'

const userSchema = new  mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  gmail:{
    type:String,
    required:true,
    unique:true
  },
  contact:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  status:{
    type:Boolean,
    default:true
  },
  timeCreated: {
    type: Date,
    default: Date.now
  }
})

const PatientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorBasic",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    slotTime: {
      type: String, // e.g., "10:30 AM - 11:00 AM"
      required: true,
    },
    uploadReports: {
      type: String,
      default: "", // Cloudinary or S3 URL
    },
    symptoms: {
      type: String,
      default: "",
    },
    consultation: {
      type: String,
      required: true,
      enum: ["Online", "Offline"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    },

    // Payment Info
    paymentMode: {
      type: String,
      required: true,
      enum: ["Online", "Offline"],
    },
    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Paid", "Failed"],
    },
    amount: {
      type: Number, // Storing consultation fee
      required: true,
    },

    // Razorpay Integration Details
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);


const PatientMedicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  PatientName:{
    type:String,
    required:true
  },
  contactNumber:{
    type:String,  
    required:true
  },
  Address:{
    type:String,
    required:true
  },
  PrescriptionImage:{
    type:String,
    default:""
  },
  PrescriptionText:{
    type:String,
    default:""
  },
  status:{
    type:String,
    default:"Pending",
    enum:["Pending","Processing","Out For Delivery","Delivered","Cancelled"]
  } ,
  ownerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicineSeller",
    required: true,
  }

});
const PatientMedicine = mongoose.model("PatientMedicine", PatientMedicineSchema);
const Patient= mongoose.model("Patient", PatientSchema);
const userModel=mongoose.model("userModel",userSchema)

export {userModel,Patient,PatientMedicine};