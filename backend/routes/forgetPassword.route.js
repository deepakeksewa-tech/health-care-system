import express from "express";
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
 * tags:
 *   - name: Doctor Forget Password
 *   - name: Patient Forget Password
 *   - name: Admin Forget Password
 */

// ==========================================
// 1. DOCTOR FORGET PASSWORD
// ==========================================

/**
 * @swagger
 * /api/forget/get/otp/toVerify:
 *   post:
 *     summary: Request OTP to reset Doctor password
 *     tags: [Doctor Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gmail
 *             properties:
 *               gmail:
 *                 type: string
 *                 example: doctor@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully or previous valid OTP active
 *       400:
 *         description: Doctor not found
 */
router.post("/get/otp/toVerify", password);

/**
 * @swagger
 * /api/forget/post/Otp:
 *   post:
 *     summary: Verify Doctor OTP
 *     tags: [Doctor Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gmail
 *               - userOTP
 *             properties:
 *               gmail:
 *                 type: string
 *                 example: doctor@example.com
 *               userOTP:
 *                 type: number
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP matched successfully
 *       400:
 *         description: Invalid OTP or email not found
 */
router.post("/post/Otp", checkOtp);

/**
 * @swagger
 * /api/forget/change/password:
 *   post:
 *     summary: Change Doctor Password after OTP verification
 *     tags: [Doctor Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gmail
 *               - password
 *             properties:
 *               gmail:
 *                 type: string
 *                 example: doctor@example.com
 *               password:
 *                 type: string
 *                 example: newDoctorSecretPass123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Doctor not found
 */
router.post("/change/password", createPassword);


// ==========================================
// 2. PATIENT / USER FORGET PASSWORD
// ==========================================

/**
 * @swagger
 * /api/forget/patient/get/otp/toVerify:
 *   post:
 *     summary: Request OTP to reset Patient/User password
 *     tags: [Patient Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gmail
 *             properties:
 *               gmail:
 *                 type: string
 *                 example: patient@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully or previous valid OTP active
 *       400:
 *         description: User not found
 */
router.post("/patient/get/otp/toVerify", Patientpassword);

/**
 * @swagger
 * /api/forget/patient/post/Otp:
 *   post:
 *     summary: Verify Patient/User OTP
 *     tags: [Patient Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gmail
 *               - userOTP
 *             properties:
 *               gmail:
 *                 type: string
 *                 example: patient@example.com
 *               userOTP:
 *                 type: number
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP matched successfully
 *       400:
 *         description: Invalid OTP or user not found
 */
router.post("/patient/post/Otp", PatientcheckOtp);

/**
 * @swagger
 * /api/forget/patient/change/password:
 *   post:
 *     summary: Change Patient/User Password after OTP verification
 *     tags: [Patient Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gmail
 *               - password
 *             properties:
 *               gmail:
 *                 type: string
 *                 example: patient@example.com
 *               password:
 *                 type: string
 *                 example: newPatientSecretPass123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: User not found
 */
router.post("/patient/change/password", PatientcreatePassword);


// ==========================================
// 3. ADMIN FORGET PASSWORD
// ==========================================

/**
 * @swagger
 * /api/forget/admin/get/otp/toVerify:
 *   post:
 *     summary: Request OTP to reset Admin password
 *     tags: [Admin Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gmail
 *             properties:
 *               gmail:
 *                 type: string
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully or previous valid OTP active
 *       400:
 *         description: Admin not found
 */
router.post("/admin/get/otp/toVerify", Adminpassword);

/**
 * @swagger
 * /api/forget/admin/post/Otp:
 *   post:
 *     summary: Verify Admin OTP
 *     tags: [Admin Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gmail
 *               - userOTP
 *             properties:
 *               gmail:
 *                 type: string
 *                 example: admin@example.com
 *               userOTP:
 *                 type: number
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP matched successfully
 *       400:
 *         description: Invalid OTP or admin not found
 */
router.post("/admin/post/Otp", AdmincheckOtp);

/**
 * @swagger
 * /api/forget/admin/change/password:
 *   post:
 *     summary: Change Admin Password after OTP verification
 *     tags: [Admin Forget Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gmail
 *               - password
 *             properties:
 *               gmail:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: newAdminSecretPass123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Admin not found
 */
router.post("/admin/change/password", AdmincreatePassword);

export default router;