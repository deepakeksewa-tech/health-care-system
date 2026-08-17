import express from "express";
import adminMiddleware from "../middleware/AdminMiddleware.js";
import {
  password,
  Patientpassword,
  PatientcheckOtp,
  Adminpassword,
  AdmincheckOtp,
  AdmincreatePassword,
  PatientcreatePassword,
  checkOtp,
  createPassword
} from "../controllers/forgetPassword.controller.js";

const router = express.Router();
router.post("/get/otp/toVerify", password);
router.post("/post/Otp", checkOtp);
router.post("/change/password", createPassword);
router.post("/patient/get/otp/toVerify", Patientpassword);
router.post("/patient/post/Otp", PatientcheckOtp);
router.post("/patient/change/password", PatientcreatePassword);
router.post("/admin/get/otp/toVerify", Adminpassword);
router.post("/admin/post/Otp", AdmincheckOtp);
router.post("/admin/change/password", AdmincreatePassword);

export default router;