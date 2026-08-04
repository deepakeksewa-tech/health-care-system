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

/**
 * @swagger
 * components:
 *   schemas:
 *     GetOtpRequest:
 *       type: object
 *       required:
 *         - gmail
 *       properties:
 *         gmail:
 *           type: string
 *           format: email
 *           example: doctor@example.com
 *     VerifyOtpRequest:
 *       type: object
 *       required:
 *         - gmail
 *         - userOTP
 *       properties:
 *         gmail:
 *           type: string
 *           format: email
 *           example: doctor@example.com
 *         userOTP:
 *           type: integer
 *           example: 482910
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - gmail
 *         - password
 *       properties:
 *         gmail:
 *           type: string
 *           format: email
 *           example: doctor@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: NewSecurePassword123!
 *     StandardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 */

// ==================== DOCTOR ROUTES ====================

/**
 * @swagger
 * /api/forget/get/otp/toVerify:
 *   post:
 *     summary: Request OTP for Doctor Password Reset
 *     tags: [Doctor - Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetOtpRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully or existing OTP notification.
 *       400:
 *         description: Doctor not found.
 */
router.post("/get/otp/toVerify", password);

/**
 * @swagger
 * /api/forget/post/Otp:
 *   post:
 *     summary: Verify Doctor OTP
 *     tags: [Doctor - Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       200:
 *         description: OTP matched successfully.
 *       400:
 *         description: Invalid email or incorrect OTP.
 */
router.post("/post/Otp", checkOtp);

/**
 * @swagger
 * /api/forget/change/password:
 *   post:
 *     summary: Update Doctor Password
 *     tags: [Doctor - Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Doctor not found.
 */
router.post("/change/password", createPassword);


// ==================== PATIENT ROUTES ====================

/**
 * @swagger
 * /api/forget/patient/get/otp/toVerify:
 *   post:
 *     summary: Request OTP for Patient Password Reset
 *     tags: [Patient - Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetOtpRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *       400:
 *         description: Patient not found.
 */
router.post("/patient/get/otp/toVerify", Patientpassword);

/**
 * @swagger
 * /api/forget/patient/post/Otp:
 *   post:
 *     summary: Verify Patient OTP
 *     tags: [Patient - Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       200:
 *         description: OTP matched successfully.
 *       400:
 *         description: Invalid email or incorrect OTP.
 */
router.post("/patient/post/Otp", PatientcheckOtp);

/**
 * @swagger
 * /api/forget/patient/change/password:
 *   post:
 *     summary: Update Patient Password
 *     tags: [Patient - Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Patient not found.
 */
router.post("/patient/change/password", PatientcreatePassword);


// ==================== ADMIN ROUTES ====================

/**
 * @swagger
 * /api/forget/admin/get/otp/toVerify:
 *   post:
 *     summary: Request OTP for Admin Password Reset
 *     tags: [Admin - Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetOtpRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *       400:
 *         description: Admin not found.
 */
router.post("/admin/get/otp/toVerify", Adminpassword);

/**
 * @swagger
 * /api/forget/admin/post/Otp:
 *   post:
 *     summary: Verify Admin OTP
 *     tags: [Admin - Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpRequest'
 *     responses:
 *       200:
 *         description: OTP matched successfully.
 *       400:
 *         description: Invalid email or incorrect OTP.
 */
router.post("/admin/post/Otp", AdmincheckOtp);

/**
 * @swagger
 * /api/forget/admin/change/password:
 *   post:
 *     summary: Update Admin Password
 *     tags: [Admin - Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Admin not found.
 */
router.post("/admin/change/password", AdmincreatePassword);

export default router;