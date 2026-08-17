import mongoose from "mongoose";


// doctor registration data - >
//  name,registrationNo.,registrationDate,certificate,password,stateMedicalCouncil,city,state,zip,verifcation_status,timestamp
const doctorRegistrationDetailsSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true,
        trim:true
    },
    registrationNo:{
        type:String,
        required:true,
        trim:true,
    },
    registrationDate:{
        type:Date,
        required: false,
    },
    certificate:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    stateMedicalCouncil:{
        type:String,
        required:true
    },
    gmail:{
        type:String,
        required:true,
        unique:true
    },
   verificationStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
      required: true,
    },
    timeCreated: {
    type: Date,
    default: Date.now
}
  },
);


// doctor basic details
// name,gmail,experience,image,specification,language,contactNo,category,fee,timestamp
const doctorBasicDetails=new mongoose.Schema({
  doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorRegistration",
        required: true
    },
    name:{
        type:String,
        required:true
    },
    experience:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    specification:{
        type:String,
        required:true
    },
    language:{
        type:["String"],
        required:true
    },
    contactNo:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    fee:{
        type:Number,
        required:true
    },
    timeCreated: {
    type: Date,
    default: Date.now
}
})



 // doctor location
// location,streetAddress,landmark,city,state,zip
export const DoctorLocationSchema=new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorBasic",
        required: true
    },
    longitude:{
    type:Number,
    required:true
    },
    latitude:{
    type:Number,
    required:true
    },
    streetAddress:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    zip:{
        type:Number,
        required:true
    }
})

// DoctorWeeklySchedule
export const WeeklySchedule = new mongoose.Schema({
   doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorBasic",
        required: true
    },
    weekly:[{
    day:{
        type:String,
        required:true
    },
   

    start:{
        type:String,
        required:function(){
            return this.status === "open";
        }
    },

    end:{
        type:String,
        required:function(){
            return this.status === "open";
        }
    },
    status:{
        type:Boolean,
        default:true
    }}
]
})


export const SpecilizatioSchema=new mongoose.Schema({
    specilization:{
        type:String,
        required:true
    }
})

export const CategorySchema=new mongoose.Schema({
    category:{
        type:String,
        required:true
    }
})
const DoctorRegistration = mongoose.model("DoctorRegistration", doctorRegistrationDetailsSchema);
const DoctorBasic = mongoose.model("DoctorBasic",doctorBasicDetails);
const DoctorLocation = mongoose.model("DoctorLocation",DoctorLocationSchema);
const DoctorWeekly = mongoose.model("DoctorWeekly",WeeklySchedule);
const Specialization=mongoose.model("Specialization",SpecilizatioSchema);
const Category = mongoose.model("Category",CategorySchema);
export  {DoctorRegistration,DoctorBasic,DoctorLocation,DoctorWeekly,Specialization,Category};