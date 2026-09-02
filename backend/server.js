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
  origin:["https://health-care-system-sooty.vercel.app","http://localhost:5173"],
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


app.get("/api/logout", (req, res) => {
  // Clear cookie ki jagah directly expire set karo
  res.cookie("token", "", {
    expires: new Date(0), // Past date set kar rahe hain jisse browser isey delete kar de
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: false, // Development localhost ke liye false rakho
    sameSite: "lax", 
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});