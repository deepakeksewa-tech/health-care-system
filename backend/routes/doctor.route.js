import express from "express";
import upload from "../middleware/multer.js";
import authMiddleware from "../middleware/registraionMiddleware.js";
import DoctorMiddleware from "../middleware/DoctorMiddleware.js";
import { logout } from "../controllers/doctor.controller.js"; 
import  {detuctMoney} from "../controllers/doctor.controller.js";
import { 
    getDoctorSettings, 
    updateDoctorSettings, 
    updateWeeklyOff,
    updateAppointmentStatus,
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

router.post("/createRegistration",upload.single("certificate"),createRegistrationDoctor);
router.post("/createBasic/:token",upload.single("image"),authMiddleware,createBasicDoctor);
router.post("/DoctorLogin", DoctorLogin);
router.post("/Doctorlocation", DoctorMiddleware, LocationSetup);
router.post("/DoctorSchedule", DoctorMiddleware, weeklySchedule);
router.get("/get/name/image", DoctorMiddleware, getName);
router.get('/profile', DoctorMiddleware, getDoctorSettings);
router.put('/profile', DoctorMiddleware, updateDoctorSettings);
router.get('/settings', DoctorMiddleware, getDoctorSettings);
router.put('/settings', DoctorMiddleware, updateDoctorSettings);
router.put('/weekly-off', DoctorMiddleware, updateWeeklyOff);
router.get("/get/all/appointments", DoctorMiddleware, getAppointment);
router.patch("/update/status", DoctorMiddleware, updateAppointmentStatus);
router.post("/verify/password", DoctorMiddleware, verifyPassword);
router.get("/widthraw/money", DoctorMiddleware, creditedMoney);
router.post("/", specialization);
router.get("/ReadSpecialization", ReadSpecialization);
router.post("/category", category);
router.get("/ReadCategory", ReadCategory);
router.post("/deduct/money",DoctorMiddleware,detuctMoney)
router.post("/logout",DoctorMiddleware,logout);

export default router;
