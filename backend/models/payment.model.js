import mongoose, { model } from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorBasic",
    required: true,
  },
  money: {
    type: Number,
    default: 0,
    required: true,
  },
});

const payment = model("payment", paymentSchema);

export { payment };
