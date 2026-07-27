import express from "express";

import upload from "../middleware/multer.js";
import authMiddleware  from '../middleware/registraionMiddleware.js'
import adminMiddleware from '../middleware/AdminMiddleware.js'
import { verifyPassword,getAppointment,getName,LocationSetup,specialization,category,ReadSpecialization,ReadCategory,createBasicDoctor ,weeklySchedule,createRegistrationDoctor,DoctorLogin} from "../controllers/doctor.controller.js";

const router = express.Router();

router.post("/createRegistration",upload.single("certificate"),  createRegistrationDoctor);
router.post("/createBasic/:token",upload.single("image"),authMiddleware,createBasicDoctor);
router.post("/Doctorlocation",adminMiddleware,LocationSetup);
router.post("/DoctorSchedule",adminMiddleware,weeklySchedule);
router.get("/get/name/image",adminMiddleware,getName);
router.post("/specialization",adminMiddleware,specialization);
router.get("/ReadSpecialization",adminMiddleware,ReadSpecialization)
router.post("/category",adminMiddleware,category)
router.get("/ReadCategory",adminMiddleware,ReadCategory)
router.post("/verify/password",adminMiddleware,verifyPassword);
router.get("/get/all/appointments",adminMiddleware,getAppointment);
router.post("/DoctorLogin",DoctorLogin)
export default router;