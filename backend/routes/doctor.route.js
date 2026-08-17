import express from "express";

import upload from "../middleware/multer.js";
import authMiddleware from "../middleware/registraionMiddleware.js";
import adminMiddleware from "../middleware/AdminMiddleware.js";
import { 
    getDoctorSettings, 
    updateDoctorSettings, 
    updateWeeklyOff,
    updateAppointmentStatus
} from '../controllers/doctor.controller.js';
import {
  verifyPassword,
  creditedMoney,
  getAppointment,
  getName,
  LocationSetup,
  specialization,
  category,
  ReadSpecialization,
  ReadCategory,
  createBasicDoctor,
  weeklySchedule,
  createRegistrationDoctor,
  DoctorLogin,
} from "../controllers/doctor.controller.js";

const router = express.Router();
router.post(
  "/createRegistration",
  upload.single("certificate"),
  createRegistrationDoctor
);
router.post(
  "/createBasic/:token",
  upload.single("image"),
  authMiddleware,
  createBasicDoctor
);
router.post("/Doctorlocation", adminMiddleware, LocationSetup);
router.post("/DoctorSchedule", adminMiddleware, weeklySchedule);
router.get("/get/name/image", adminMiddleware, getName);
router.post("/specialization", adminMiddleware, specialization);
router.get("/ReadSpecialization", adminMiddleware, ReadSpecialization);
router.post("/category", adminMiddleware, category);
router.get("/ReadCategory", adminMiddleware, ReadCategory);
router.post("/verify/password", adminMiddleware, verifyPassword);
router.get("/get/all/appointments", adminMiddleware, getAppointment);
router.patch("/update/status", adminMiddleware, updateAppointmentStatus);
router.get("/widthraw/money", adminMiddleware, creditedMoney);
router.post("/DoctorLogin", DoctorLogin);
router.get('/settings', adminMiddleware, getDoctorSettings);
router.put('/settings', adminMiddleware, updateDoctorSettings);
router.put('/weekly-off', adminMiddleware, updateWeeklyOff);

export default router;