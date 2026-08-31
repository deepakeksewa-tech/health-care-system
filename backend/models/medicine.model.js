import mongoose from "mongoose";

// 1. Med Seller Schema
const MedicineSellerSchema = new mongoose.Schema({
  gmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  shopName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  Status:{
    type:Boolean,
    required:true
  },
  role:{
    type:String,
    default:"MedSeller"
  }
}, { timestamps: true });

// 2. Medicine  Schema
const MedicineSchema = new mongoose.Schema({
  Medicine_name: {
    type: String,
    required: true,
    trim: true
  },
  Expiry_Date: {
    type: String,
    required: true
  },
  Stock: {
    type: Number, 
    required: true
  },
  MRP: {
    type: Number, 
    required: true
  },
  Discount: {
    type: Number,
    required: true,
    default: 0
  },
  Manufacturer_name: {
    type: String,
    required: true,
    trim: true
  },
  Use_For: {
    type: String,
  },
  SellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicineSeller",
    required: true
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"",
    required:true
  }
}, { timestamps: true });

const MedCategorySchema=new mongoose.Schema({
  category:{
    type:String,
    required:true,
    unique:true
  },
  SellerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"MedicineSeller",
    required:true
  }
})

const MedUserSchema=new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userModel",
    required:true
  },
   OrderDetails: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        pricePerUnit: {
          type: Number,
          required: true,
        },
        totalItemPrice: {
          type: Number,
          required: true,
        },
      },
    ]
})


const UserAddressSchema=new mongoose.Schema({
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userModel",
    required:true
  },
  Addresses:[
    {
      Address:{
        type:String,
        required:true
      },
      Landmark:{
        type:String,
        required:true,
      },
      PinCode:{
        type:String,
        required:true
      },
      State:{
        type:String,
        required:true
      },
      City:{
        type:String,
        required:true
      },
      House_No:{
        type:String,
        required:true
      }
    }
  ]
})

// Compile and export models safely
const MedicineSeller = mongoose.models.MedicineSeller || mongoose.model("MedicineSeller", MedicineSellerSchema);
const Medicine = mongoose.models.Medicine || mongoose.model("Medicine", MedicineSchema);
const MedOrder = mongoose.models.MedOrder || mongoose.model("MedOrder", MedUserSchema);
const userAddress=mongoose.model("UserAddress",UserAddressSchema);
const MedCategory=mongoose.model("MedCategory",MedCategorySchema);
export { MedicineSeller, Medicine, MedOrder,userAddress,MedCategory};
