import mongoose from 'mongoose'

const AdminSchema=new mongoose.Schema({
  gmail:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    default:"Admin"
  }
})

const AdminModel = mongoose.model("Admin",AdminSchema)
export {AdminModel}