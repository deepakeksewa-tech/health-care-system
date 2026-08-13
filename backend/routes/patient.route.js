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

/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Patient authentication, doctor discovery, appointment booking, and prescription medicine management endpoints
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new patient account
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gmail
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               gmail:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               contact:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecretPassword123
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
router.post("/signup", signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in an existing patient
 *     tags: [Patient]
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
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecretPassword123
 *     responses:
 *       200:
 *         description: Login successful, sets HTTP-only authentication cookie
 *       400:
 *         description: Incorrect credentials or password
 *       500:
 *         description: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /alldetails:
 *   get:
 *     summary: Fetch all available doctors on duty for today and current time
 *     tags: [Patient]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Doctor list fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get("/alldetails", adminMiddleware, ReadDoctorForPatient);

/**
 * @swagger
 * /GetSingleDoctor/{id}:
 *   get:
 *     summary: Get basic profile details of a single doctor
 *     tags: [Patient]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Doctor ID (DoctorBasic Mongo ID)
 *     responses:
 *       200:
 *         description: Doctor profile fetched successfully
 *       400:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.get("/GetSingleDoctor/:id", adminMiddleware, GetSingleDoctor);

/**
 * @swagger
 * /GetScheduleDoctor/{id}:
 *   get:
 *     summary: Fetch today's schedule for a specific doctor
 *     tags: [Patient]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor schedule fetched successfully
 *       400:
 *         description: Doctor schedule not set
 *       500:
 *         description: Internal server error
 */
router.get("/GetScheduleDoctor/:id", adminMiddleware, GetScheduleDoctor);

/**
 * @swagger
 * /PatientAppointment/{id}:
 *   post:
 *     summary: Book an appointment with Razorpay payment verification
 *     tags: [Patient]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID to book appointment with
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - patientName
 *               - contactNumber
 *               - bookingDate
 *               - slotTime
 *               - consultation
 *               - razorpayOrderId
 *               - razorpayPaymentId
 *               - razorpaySignature
 *             properties:
 *               report:
 *                 type: string
 *                 format: binary
 *                 description: Medical report document or image
 *               patientName:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               bookingDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-10"
 *               slotTime:
 *                 type: string
 *                 example: "10:00 AM - 10:30 AM"
 *               symptoms:
 *                 type: string
 *               consultation:
 *                 type: string
 *                 example: "Online Video"
 *               paymentMode:
 *                 type: string
 *                 default: "Online"
 *               amount:
 *                 type: number
 *                 example: 500
 *               razorpayOrderId:
 *                 type: string
 *               razorpayPaymentId:
 *                 type: string
 *               razorpaySignature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking completed and payment verified successfully
 *       400:
 *         description: Payment verification failed or missing required fields
 *       500:
 *         description: Internal server error
 */
router.post(
  "/PatientAppointment/:id",
  adminMiddleware,
  upload.single("report"),
  PatientAppointment
);

/**
 * @swagger
 * /get/bookingDetails:
 *   get:
 *     summary: Get all appointment bookings for the authenticated patient
 *     tags: [Patient]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 *       400:
 *         description: No bookings found
 *       500:
 *         description: Internal server error
 */
router.get("/get/bookingDetails", adminMiddleware, bookingDetails);

/**
 * @swagger
 * /PatientMedicineDetails:
 *   get:
 *     summary: Get booking history along with prescription medicine details
 *     tags: [Patient]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Patient medicine details and booking history fetched
 *       400:
 *         description: No booking records found
 *       500:
 *         description: Internal server error
 */
router.get("/PatientMedicineDetails", adminMiddleware, PatientMedicineDetails);

/**
 * @swagger
 * /savePatientMedicineDetails:
 *   post:
 *     summary: Save prescription and medicine request details
 *     tags: [Patient]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - PatientName
 *               - contactNumber
 *               - Address
 *               - ownerId
 *             properties:
 *               prescriptionImage:
 *                 type: string
 *                 format: binary
 *                 description: Image of the prescription document
 *               PatientName:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               Address:
 *                 type: string
 *               PrescriptionText:
 *                 type: string
 *               ownerId:
 *                 type: string
 *                 description: Medical store owner / Pharmacy ID
 *     responses:
 *       201:
 *         description: Patient medicine details saved successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post(
  "/savePatientMedicineDetails",
  adminMiddleware,
  upload.single("prescriptionImage"),
  savePatientMedicineDetails
);

export default router;