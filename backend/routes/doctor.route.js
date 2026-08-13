import express from "express";

import upload from "../middleware/multer.js";
import authMiddleware from "../middleware/registraionMiddleware.js";
import adminMiddleware from "../middleware/AdminMiddleware.js";
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

/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: Doctor onboarding, schedule, location, and management API endpoints
 */

/**
 * @swagger
 * /createRegistration:
 *   post:
 *     summary: Register a new doctor
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - certificate
 *               - name
 *               - registrationNo
 *               - registrationDate
 *               - password
 *               - stateMedicalCouncil
 *               - gmail
 *             properties:
 *               certificate:
 *                 type: string
 *                 format: binary
 *                 description: Medical registration certificate file
 *               name:
 *                 type: string
 *               registrationNo:
 *                 type: string
 *               registrationDate:
 *                 type: string
 *                 format: date
 *               password:
 *                 type: string
 *               stateMedicalCouncil:
 *                 type: string
 *               gmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Doctor registered successfully
 *       400:
 *         description: Bad request (Image required, Gmail or Registration No. already exists)
 *       500:
 *         description: Internal server error
 */
router.post(
  "/createRegistration",
  upload.single("certificate"),
  createRegistrationDoctor
);

/**
 * @swagger
 * /createBasic/{token}:
 *   post:
 *     summary: Create basic doctor profile details
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration token
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - name
 *               - experience
 *               - specification
 *               - language
 *               - contactNo
 *               - category
 *               - fee
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image
 *               name:
 *                 type: string
 *               experience:
 *                 type: string
 *               specification:
 *                 type: string
 *               language:
 *                 type: string
 *               contactNo:
 *                 type: string
 *               category:
 *                 type: string
 *               fee:
 *                 type: number
 *     responses:
 *       201:
 *         description: Basic details saved successfully
 *       400:
 *         description: Image required or doctor profile already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  "/createBasic/:token",
  upload.single("image"),
  authMiddleware,
  createBasicDoctor
);

/**
 * @swagger
 * /Doctorlocation:
 *   post:
 *     summary: Set up hospital or clinic location for doctor
 *     tags: [Doctor]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longitude
 *               - latitude
 *               - streetAddress
 *               - city
 *               - state
 *               - zip
 *             properties:
 *               longitude:
 *                 type: number
 *               latitude:
 *                 type: number
 *               streetAddress:
 *                 type: string
 *               landmark:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zip:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor location added successfully
 *       400:
 *         description: Doctor profile not created or location already set
 */
router.post("/Doctorlocation", adminMiddleware, LocationSetup);

/**
 * @swagger
 * /DoctorSchedule:
 *   post:
 *     summary: Set weekly consultation schedule
 *     tags: [Doctor]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weekly
 *             properties:
 *               weekly:
 *                 type: object
 *                 description: Schedule details object
 *     responses:
 *       200:
 *         description: Weekly schedule saved successfully
 *       400:
 *         description: Doctor profile not created or schedule already exists
 */
router.post("/DoctorSchedule", adminMiddleware, weeklySchedule);

/**
 * @swagger
 * /get/name/image:
 *   get:
 *     summary: Fetch doctor's name and profile image
 *     tags: [Doctor]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Success response containing name and image URL
 *       400:
 *         description: Doctor profile not found
 */
router.get("/get/name/image", adminMiddleware, getName);

/**
 * @swagger
 * /specialization:
 *   post:
 *     summary: Add a new doctor specialization
 *     tags: [Doctor]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Specialization
 *             properties:
 *               Specialization:
 *                 type: string
 *     responses:
 *       200:
 *         description: Specialization added successfully
 *       400:
 *         description: Specialization already exists
 */
router.post("/specialization", adminMiddleware, specialization);

/**
 * @swagger
 * /ReadSpecialization:
 *   get:
 *     summary: Fetch all specializations
 *     tags: [Doctor]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of specializations
 */
router.get("/ReadSpecialization", adminMiddleware, ReadSpecialization);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Add a new medical category
 *     tags: [Doctor]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Category
 *             properties:
 *               Category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category added successfully
 *       400:
 *         description: Category already exists
 */
router.post("/category", adminMiddleware, category);

/**
 * @swagger
 * /ReadCategory:
 *   get:
 *     summary: Fetch all categories
 *     tags: [Doctor]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of medical categories
 */
router.get("/ReadCategory", adminMiddleware, ReadCategory);

/**
 * @swagger
 * /verify/password:
 *   post:
 *     summary: Verify password and retrieve doctor's balance/earnings
 *     tags: [Doctor]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password verified and wallet balance returned
 *       400:
 *         description: Incorrect password or payment record not found
 */
router.post("/verify/password", adminMiddleware, verifyPassword);

/**
 * @swagger
 * /get/all/appointments:
 *   get:
 *     summary: Get all booked appointments for the authenticated doctor
 *     tags: [Doctor]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       400:
 *         description: Doctor not found or no appointments present
 */
router.get("/get/all/appointments", adminMiddleware, getAppointment);

/**
 * @swagger
 * /widthraw/money:
 *   get:
 *     summary: Withdraw remaining wallet balance
 *     tags: [Doctor]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Money successfully withdrawn/credited
 *       400:
 *         description: Doctor not found or no money available in wallet
 */
router.get("/widthraw/money", adminMiddleware, creditedMoney);

/**
 * @swagger
 * /DoctorLogin:
 *   post:
 *     summary: Authenticate and log in a doctor
 *     tags: [Doctor]
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
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token and sets cookie
 *       400:
 *         description: Invalid credentials, pending verification, or rejected account
 */
router.post("/DoctorLogin", DoctorLogin);

export default router;