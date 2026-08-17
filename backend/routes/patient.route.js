import express from "express";
import upload from "../middleware/multer.js";
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
} from "../controllers/patient.controller.js";
import adminMiddleware from "../middleware/AdminMiddleware.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/alldetails", adminMiddleware, ReadDoctorForPatient);
router.get("/GetSingleDoctor/:id", adminMiddleware, GetSingleDoctor);
router.get("/GetScheduleDoctor/:id", adminMiddleware, GetScheduleDoctor);
router.post(
  "/PatientAppointment/:id",
  adminMiddleware,
  upload.single("report"),
  PatientAppointment
);
router.get("/get/bookingDetails", adminMiddleware, bookingDetails);
router.get("/PatientMedicineDetails", adminMiddleware, PatientMedicineDetails);
router.post(
  "/savePatientMedicineDetails",
  adminMiddleware,
  upload.single("prescriptionImage"),
  savePatientMedicineDetails
);

export default router;