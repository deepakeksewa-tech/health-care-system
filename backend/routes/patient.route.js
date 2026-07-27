import express from "express";

import upload from "../middleware/multer.js";
import {bookingDetails,ReadDoctorForPatient,PatientAppointment,login,signup,GetScheduleDoctor,GetSingleDoctor} from "../controllers/patient.controller.js";

import adminMiddleware from "../middleware/AdminMiddleware.js";
const router = express.Router();

router.post('/PatientAppointment/:id',adminMiddleware, upload.single('report'), PatientAppointment);
// router.post('/verify-payment',adminMiddleware, verifyPayment);
router.get('/get/bookingDetails',adminMiddleware,bookingDetails);
router.get("/alldetails",adminMiddleware,ReadDoctorForPatient)
router.get("/GetScheduleDoctor/:id",adminMiddleware,GetScheduleDoctor);
router.get("/GetSingleDoctor/:id",adminMiddleware,GetSingleDoctor);
// router.get("/get/BookingDetails",adminMiddleware,bookingDetails)
router.post("/signup",signup);
router.post("/login",login);
export default router;