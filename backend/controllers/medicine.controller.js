//  MedicineSeller, Medicine, MedOrder

import { MedicineSeller,Medicine, MedCategory } from "../models/medicine.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Medicine Seller Medicine
export const MedSellerSignup=async(req,res)=>{
  try{
  const name=req.body.name;
  const gmail=req.body.gmail;
  const password=req.body.password;
  const shopName=req.body.shopName;
  const phone=req.body.phone;
  if(name.trim()===""){
    return res.status(400).send({
      success:false,
      message:"Please Enter the name"
    })
  }
  if(gmail.trim()===""){
    return res.status(400).send({
      success:false,
      message:"Please Enter the Gmail"
    })
  }
  if(password===""){
    return res.status(400).send({
      success:false,
      message:"Please Enter the password"
    })
  }
  if(shopName===""){
    return res.status(400).send({
      success:false,
      message:"Please Enter the shopName"
    })
  }
  const checkGmail=await MedicineSeller.findOne({gmail});
  if(checkGmail){
    return res.status(400).send({
      success:false,
      message:"Gmail already exists"
    })
  }
  const checkPhone=await MedicineSeller.findOne({phone});
  if(checkPhone){
    return res.status(400).send({
      success:false,
      message:"Phone number already exists"
    })
  }
  const hashPassword=await bcrypt.hash(password,Number(process.env.HASHROUND));
  const saveData=await MedicineSeller.create({name,shopName,gmail,phone,password:hashPassword,Status:true});
  return res.status(200).send({
    success:true,
    message:"Medicine Seller Added Successfully"
  })
}
catch(error){
  return res.status(400).send({
    success:false,
    message:error.message
  })
}
}


// Medicine Seller Login (cookie left)
export const MedSellerLogin=async(req,res)=>{
  try{
  const gmail=req.body.gmail;
  const password=req.body.password;
  if(gmail.trim()===""){
    return res.status(400).send({
      success:false,
      message:"Please Enter the Email"
    })
  }
  const check=await MedicineSeller.findOne({gmail,Status:true});
  if(!check){
    return res.status(400).send({
      success:false,
      message:"Email not exists"
    })
  }
  const comparePassword=await bcrypt.compare(password,check.password);
  if(!comparePassword){
    return res.status(400).send({
      success:false,
      message:"Please Enter the Correct Password"
    })
  }
   const token = jwt.sign(
      {
        id: check._id,
        role:"MedSeller"
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
    httpOnly: true,
    secure: true, // true in production with HTTPS
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(200).send({
    success:true,
    message:"Login Successfully"
  })
}
catch(error){
  return res.status(400).send({
    success:false,
    message:error.message
  })
}
}



// Add a single Medicine
export const AddMedicine=async(req,res)=>{
  try{
    const Medicine_name=req.body.Medicine_name;
    const Expiry_Date=req.body.Expiry_Date;
    const Stock=req.body.Stock;
    const MRP=req.body.MRP;
    const Discount=req.body.Discount;
    const Manufacturer_name=req.body.Manufacturer_name;
    const Use_For=req.body.Use_For;
    const category=req.body.category;
    const SellerId=req.id;
    if(Medicine_name.trim()===""){
      return res.status(400).send({
        success:false,
        message:"Please Enter Medicine name"
      })
    }
    if(Expiry_Date===""){
      return res.status(400).send({
        success:false,
        message:"Please Enter the Expiry Date"
      })
    }
    if(Stock===""){
      return res.status(400).send({
        success:false,
        message:"Please Enter Stock"
      })
    }
    if(MRP===""){
      return res.status(400).send({
        success:false,
        message:"Please Enter MRP"
      })
    }
    if(Discount===""){
      return res.status(400).send({
        success:false,
        message:"Please Enter the Discount"
      })
    }
    if(Manufacturer_name===""){
      return res.status(400).send({
        success:false,
        message:"Please enter manufacturer name"
      })
    }
    if(Use_For===""){
      return  res.status(400).send({
        success:false,
        message:"Please  Enter Use For "
      })
    }
    if(SellerId===""){
      return res.status(400).send({
        success:false,
        message:"Seller is not authorized"
      })
    }
    if(category===""){
      return res.status(400).send({
        success:false,
        message:"Please Enter the Id of Category"
      })
    }
    const check=await MedicineSeller.findOne({_id:SellerId,Status:true})
    if(!check){
      return res.status(400).send({
        success:false,
        message:"Seller not found"
      })
    }
    const saveData=await Medicine.create({Medicine_name,SellerId,Manufacturer_name,Use_For,Discount,MRP,Stock,Expiry_Date,category});
    return res.status(201).send({
      success:true,
      messsage:"Medicine Added Successfully"
    })
  }
  catch(error){
    return res.status(400).send({
      success:false,
      message:error.message
    })
  }
}


// Get All Medicine With SellerId
export const getSellerMedicine=async(req,res)=>{
  try{
  const SellerId=req.id;
  const check=await MedicineSeller.findOne({_id:SellerId,Status:true});
  if(!check){
    return res.status(400).send({
      success:false,
      message:"Seller not found"
    })
  }
  const find=await Medicine.find({SellerId});
  if(find.length===0){
    return res.status(400).send({
      success:false,
      message:"Seller have no Added any Medicine yet"
    })
  }
  return res.status(200).send({
    success:true,
    message:"The Medicines are",
    data:find
  })
}
catch(error){
  return res.status(400).send({
    success:false,
    message:error.message
  })
}
}


// Get Specific Medicine of The Seller
export const GetSingleMedicine=async(req,res)=>{
  try{
  const SellerId=req.id;
  const MedicineId=req.params.MedId;
  const check=await MedicineSeller.findOne({_id:SellerId,Status:true});
  if(!check){
    return res.status(400).send({
      success:false,
      message:"Seller not found"
    })
  }
  const find=await Medicine.findOne({_id:MedicineId,SellerId});
  if(!find){
    return res.status(400).send({
      success:false,
      message:"there is not medicine related to SellerId and MedicineId"
    })
  }
  return res.status(200).send({
    success:true,
    messsage:"the Medicine data is",
    data:find
  })
}
catch(error){
  return res.status(400).send({
    success:false,
    message:error.message
  })
}
}

// Update The Single medicine
export const UpdateMedicine=async(req,res)=>{
  try{
  const SellerId=req.id;
  const MedicineId=req.params.MedId;
  const MRP=Number(req.body.MRP);
  const Discount=Number(req.body.Discount);
  const Expiry_Date=req.body.Expiry_Date;
  const Stock=Number(req.body.Stock);
  const Manufacturer_name=req.body.Manufacturer_name;
  const check=await MedicineSeller.findOne({_id:SellerId,Status:true});
  if(!check){
    return res.status(400).send({
      success:false,
      message:"Seller not found"
    })
  }
  if(MRP<=0){
    return res.status(400).send({
      success:false,
      message:"Please Enter the MRP above 0"
    })
  }
  if(Discount<0){
    return res.status(400).send({
      success:false,
      message:"Please Enter the Positive Discount"
    })
  }
  if(Stock<0){
    return res.status(400).send({
      success:false,
      message:"Please Enter the Stock greater than 0"
    })
  }

  if(Expiry_Date.trim()===""){
    return res.status(400).send({
      success:false,
      message:"Please Enter the Expiry Date"
    })
  }
  
  if(Manufacturer_name.trim()===""){
    return res.status(400).send({
      success:false,
      message:"Please Enter the Manufacturer name"
    })
  }

  const find=await Medicine.findOne({_id:MedicineId,SellerId});
  if(!find){
    return res.status(400).send({
      success:false,
      message:"Medicine not found"
    })
  }
  find.MRP=MRP;
  find.Discount=Discount;
  find.Stock=Stock;
  find.Expiry_Date=Expiry_Date;
  find.Manufacturer_name=Manufacturer_name;
  await find.save();
  return res.status(200).send({
    success:true,
    message:"Medicine Update Successfully"
  })
}
catch(error){
  return res.status(400).send({
    success:false,
    message:error.message
  })
}
}


// Delete a single medicine
export const DeleteMedicine=async(req,res)=>{
  try{
  const SellerId=req.id;
  const MedicineId=req.params.MedId;
  const check=await MedicineSeller.findOne({_id:SellerId,Status:true});
  if(!check){
    return res.status(400).send({
      success:false,
      message:"Seller not found"
    })
  }
  const find=await Medicine.findOneAndDelete({SellerId,_id:MedicineId});
  if(!find){
    return res.status(400).send({
      success:false,
      message:"Medicine not found"
    })
  }
  return res.status(200).send({
    success:true,
    message:"Medicine Deleted successfully"
  })
}
catch(error){
  return res.status(400).send({
    success:false,
    message:error.message
  })
}
}


//Get Seller Details where status true
export const GetSellerDetails=async(req,res)=>{
  try{
  const SellerId=req.id;
  const find=await MedicineSeller.findOne({_id:SellerId,Status:true}).select('-password');
  if(!find){
    return res.status(400).send({
      success:false,
      message:"No Seller Found "
    })
    }
  return res.status(200).send({
    success:true,
    message:"Seller found",
    data:find
  })
  }
  catch(error){
    return res.status(400).send({
      success:false,
      message:error.message
    })
  }
}


// update seller details
export const UpdateSellerDetails=async(req,res)=>{
  try{
const SellerId=req.id;
const shopName=req.body.shopName;
const phone=req.body.phone;
const gmail=req.body.gmail;
const check=await MedicineSeller.findOne({_id:SellerId,Status:true});
if(!check){
  return res.status(400).send({
    success:false,
    message:"Seller not found"
  })
}
if(shopName.trim()===""){
  return res.status(400).send({
    success:false,
    message:"Please Enter the Shop Name"
  })
}
if(phone.trim()==="" || phone.length!==10){
  return res.status(400).send({
  success:false,
  message:"Please Enter the correct Phone number"
  })
}
if(gmail.trim()===""){
  return res.status(400).send({
    success:false,
    message:"Please Enter the Gmail"
  })
}
const find=await MedicineSeller.findById(SellerId);
if(!find){
  return res.status(400).send({
    success:false,
    message:"Seller Not found"
  })
}
find.shopName=shopName;
find.gmail=gmail;
find.phone=phone;
await find.save();
return res.status(200).send({
  success:true,
  message:"Seller Details Updated Successfully"
})
  }
  catch(error){
    return res.status(400).send({
      success:false,
      message:error.message
    })
  }
}

export const DeleteSellerAccount=async(req,res)=>{
  try{
  const SellerId=req.id;
  const find=await MedicineSeller.findOne({_id:SellerId,Status:true});
  if(!find){
    return res.status(400).send({
      success:false,
      message:"Seller not found"
    })
  }
  find.Status=false;
  await find.save();
  return res.status(200).send({
    success:true,
    message:"Seller Deactivate Successfully"
  })
  }
  catch(error){
    return res.status(400).send({
    success:false,
    message:error.message
    })
  }
}


export const readCategory=async(req,res)=>{
  const SellerId=req.id;
  const find=await MedCategory.find({SellerId});
  if(find.length===0){
    return res.status(400).send({
      success:false,
      message:"There is no Category"
    })
  }
  return res.status(200).send({
    success:true,
    message:"The Categories are",
    data:find
  })
}
export const AddCategory=async(req,res)=>{
  const category=(req.body.category).toUpperCase();
  const SellerId=req.id;
  if(category.trim()===""){
    return res.status(400).send({
      success:false,
      message:"Please Enter the Category"
    })
  }
  const find=await MedCategory.findOne({category,SellerId});
  if(find){
    return res.status(403).send({
      success:false,
      message:"Already Exists"
    })
  }
  const save=await MedCategory.create({SellerId,category});
  return res.status(201).send({
    success:true,
    message:"Category added successfully",
    data:save._id
  })
}