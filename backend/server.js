import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import doctorRoutes from "./routes/doctor.route.js";
import adminRoutes from './routes/admin.route.js';
import cookieParser from "cookie-parser";
import patientRoutes from './routes/patient.route.js';
import forgetPasswordRoutes from "./routes/forgetPassword.route.js";
import paymentRoutes from "./routes/payment.route.js"; // <-- Added payment route
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import sellerMedicineRoutes from './routes/sellerMed.route.js';
connectDB();


const app = express();
app.use(cookieParser());

app.use(cors({
  origin:["https://health-care-system-zeta.vercel.app","https://health-care-system-wy16-one.vercel.app","http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend Running");
});
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
// Mounted Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/forget", forgetPasswordRoutes);
app.use("/api/payment", paymentRoutes); // <-- Razorpay endpoints live here
app.use("/Med/Seller",sellerMedicineRoutes)





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});