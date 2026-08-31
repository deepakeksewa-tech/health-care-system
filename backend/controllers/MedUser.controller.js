import { Medicine, MedOrder, userAddress } from "../models/medicine.model.js";

// 1. Search / Fetch All Medicines
export const searching = async (req, res) => {
  try {
    const { query } = req.query;
    let filter = {};

    if (query && query.trim() !== "") {
      filter = {
        $or: [
          { Medicine_name: { $regex: query.trim(), $options: "i" } },
          { Manufacturer_name: { $regex: query.trim(), $options: "i" } },
          { Use_For: { $regex: query.trim(), $options: "i" } }
        ]
      };
    }

    const finding = await Medicine.find(filter);

    if (finding.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No medicines found",
        data: []
      });
    }

    return res.status(200).send({
      success: true,
      message: "Medicines found",
      data: finding
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};

// 2. Add / Increment Item in Cart (POST /cart/:medicineId)
export const AddItem = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const userId = req.id;

    if (!medicineId || String(medicineId).trim() === "") {
      return res.status(400).send({
        success: false,
        message: "Medicine ID is required"
      });
    }

    // Database se medicine fetch karein
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).send({
        success: false,
        message: "Medicine not found"
      });
    }

    // Check stock availability
    if (medicine.Stock <= 0) {
      return res.status(400).send({
        success: false,
        message: "Medicine is out of stock"
      });
    }

    // Price backend se calculate karein (Discount logic included)
    const effectivePrice = medicine.Discount > 0
      ? medicine.MRP - (medicine.MRP * medicine.Discount) / 100
      : medicine.MRP;

    let order = await MedOrder.findOne({ userId });

    if (!order) {
      // Cart create karein agar exist nahi karta
      const newOrder = await MedOrder.create({
        userId,
        OrderDetails: [
          {
            medicineId: medicine._id,
            name: medicine.Medicine_name,
            quantity: 1,
            pricePerUnit: effectivePrice,
            totalItemPrice: effectivePrice
          }
        ]
      });

      return res.status(201).send({
        success: true,
        message: "Item added to cart successfully",
        data: newOrder
      });
    } else {
      // Cart exist karta hai, check karein item pehle se hai ya nahi
      const itemIndex = order.OrderDetails.findIndex(
        (item) => item.medicineId.toString() === medicineId.toString()
      );

      if (itemIndex > -1) {
        // Stock limit boundary check
        if (order.OrderDetails[itemIndex].quantity + 1 > medicine.Stock) {
          return res.status(400).send({
            success: false,
            message: `Cannot add more. Only ${medicine.Stock} items available in stock.`
          });
        }

        order.OrderDetails[itemIndex].quantity += 1;
        order.OrderDetails[itemIndex].totalItemPrice =
          order.OrderDetails[itemIndex].quantity * effectivePrice;
      } else {
        // Naya item cart array me push karein
        order.OrderDetails.push({
          medicineId: medicine._id,
          name: medicine.Medicine_name,
          quantity: 1,
          pricePerUnit: effectivePrice,
          totalItemPrice: effectivePrice
        });
      }

      await order.save();

      return res.status(200).send({
        success: true,
        message: "Cart updated successfully",
        data: order
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};

// 3. Decrease Item Quantity (PATCH /cart/:medicineId/decrease)
export const DecreaseQuantity = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const userId = req.id;

    if (!medicineId || String(medicineId).trim() === "") {
      return res.status(400).send({
        success: false,
        message: "Medicine ID is required"
      });
    }

    const order = await MedOrder.findOne({ userId });
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Cart not found"
      });
    }

    const itemIndex = order.OrderDetails.findIndex(
      (item) => item.medicineId.toString() === medicineId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "Medicine not found in your cart"
      });
    }

    if (order.OrderDetails[itemIndex].quantity > 1) {
      order.OrderDetails[itemIndex].quantity -= 1;
      order.OrderDetails[itemIndex].totalItemPrice =
        order.OrderDetails[itemIndex].quantity *
        order.OrderDetails[itemIndex].pricePerUnit;
    } else {
      order.OrderDetails.splice(itemIndex, 1);
    }

    // Cart agar empty ho gaya toh document delete karein
    if (order.OrderDetails.length === 0) {
      await MedOrder.findOneAndDelete({ userId });
      return res.status(200).send({
        success: true,
        message: "Item removed and cart is now empty",
        data: null
      });
    }

    await order.save();

    return res.status(200).send({
      success: true,
      message: "Quantity decreased successfully",
      data: order
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};

// 4. Remove Medicine Completely (DELETE /cart/:medicineId)
export const removeMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const userId = req.id;

    if (!medicineId || String(medicineId).trim() === "") {
      return res.status(400).send({
        success: false,
        message: "Medicine ID is required"
      });
    }

    const order = await MedOrder.findOne({ userId });
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Cart not found"
      });
    }

    const itemExists = order.OrderDetails.some(
      (item) => item.medicineId.toString() === medicineId.toString()
    );

    if (!itemExists) {
      return res.status(404).send({
        success: false,
        message: "Medicine not found in cart"
      });
    }

    order.OrderDetails = order.OrderDetails.filter(
      (item) => item.medicineId.toString() !== medicineId.toString()
    );

    if (order.OrderDetails.length === 0) {
      await MedOrder.findOneAndDelete({ userId });
      return res.status(200).send({
        success: true,
        message: "Medicine removed and cart is now empty",
        data: null
      });
    }

    await order.save();

    return res.status(200).send({
      success: true,
      message: "Medicine removed successfully",
      data: order
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};


export const getAddress=async(req,res)=>{
const userId=req.id;
const check=await userAddress.findOne({userId});
if(!check){
  return res.status(403).send({
    success:false,
    message:"User Address not found"
  })
}
return res.status(200).send({
  success:true,
  data:check.Addresses,
  message:"Address Founded"
})
}


export const addAddress=async(req,res)=>{
const userId=req.id;
const Landmark=req.body.Landmark;
const Address=req.body.Address;
const PinCode=req.body.PinCode;
const State=req.body.State;
const City=req.body.City;
const House_No=req.body.House_No;
if(Landmark.trim()===""){
  return res.status(400).send({
    success:false,
    message:"Please enter the Landmark"
  })
}
if(Address.trim()===""){
  return res.status(400).send({
    success:false,
    message:"Please Enter the Address"
  })
}

if(PinCode.trim()===""){
  return res.status(400).send({
    success:false,
    message:"Please Enter your PinCode"
  })
}

if(State.trim()===""){
  return res.status(400).send({
    success:false,
    messsage:"Please Enter the State"
  })
}

if(City.trim()===""){
  return res.status()
}
const check=await userAddress.findOne({userId});
if(!check){
  
}
}

export const placeOrder=async(req,res)=>{

}
