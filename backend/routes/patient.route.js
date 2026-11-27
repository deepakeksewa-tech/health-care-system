import express from "express";
import upload from "../middleware/multer.js";
import UserMiddleware from "../middleware/UserMiddleware.js";
import {
  bookingDetails,
  ReadDoctorForPatient,
  PatientAppointment,
  login,
  signup,
  GetScheduleDoctor,
  GetSingleDoctor,
  PatientMedicineDetails,
  savePatientMedicineDetails,
  logout,
} from "../controllers/patient.controller.js";
import { AddItem, DecreaseQuantity, removeMedicine, searching } from "../controllers/MedUser.controller.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/alldetails", ReadDoctorForPatient);
router.get("/GetSingleDoctor/:id", UserMiddleware, GetSingleDoctor);
router.get("/GetScheduleDoctor/:id", UserMiddleware, GetScheduleDoctor);
router.post("/PatientAppointment/:id",UserMiddleware,upload.single("report"),PatientAppointment);
router.get("/get/bookingDetails", UserMiddleware, bookingDetails);
router.get("/PatientMedicineDetails", UserMiddleware, PatientMedicineDetails);
router.post("/savePatientMedicineDetails",UserMiddleware,upload.single("prescriptionImage"),savePatientMedicineDetails);
router.get('/get/All/Medicine',UserMiddleware,searching);
router.post('/med/user/cart/:medicineId',UserMiddleware,AddItem);
router.post("/med/user/cart/:medicineId/decrease",UserMiddleware,DecreaseQuantity)
router.delete('/med/user/cart/:medicineId',UserMiddleware,removeMedicine);
router.post('/logout',UserMiddleware,logout);
export default router;
