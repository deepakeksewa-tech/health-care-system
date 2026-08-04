//  gmail
//   password
//     name
//     shopName
//     contact

import mongoose from "mongoose";
const MedicineSchema=new mongoose.Schema({
  gmail:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  },
  shopName:{
    type:String,
    required:true
  },
  contact:{
    type:String,
    required:true
  },
  online:{
    type:Boolean,
    default:false
  }
})

const MedicineSeller=mongoose.model("MedicineSeller",MedicineSchema)
export default MedicineSeller