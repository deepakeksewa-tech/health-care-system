import express from "express";
import upload from "../middleware/multer.js";
import UserMiddleware from "../middleware/UserMiddleware.js";
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
import { AddItem, DecreaseQuantity, removeMedicine, searching } from "../controllers/MedUser.controller.js";


const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Patient Auth
 *   - name: Patient Doctor Discovery
 *   - name: Patient Appointments
 *   - name: Patient Prescriptions & Medicine
 */

// ==========================================
// 1. PATIENT AUTHENTICATION
// ==========================================

/**
 * @swagger
 * /api/patient/signup:
 *   post:
 *     summary: Patient / User Registration
 *     tags: [Patient Auth]
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
 *               - contact
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               gmail:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: securePass123
 *               contact:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/patient/login:
 *   post:
 *     summary: Patient / User Login
 *     tags: [Patient Auth]
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
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: securePass123
 *     responses:
 *       200:
 *         description: Login successful (Sets authentication cookie)
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", login);


// ==========================================
// 2. DOCTOR DISCOVERY & DETAILS
// ==========================================

/**
 * @swagger
 * /api/patient/alldetails:
 *   get:
 *     summary: Get all available doctors filtered by date / day schedule
 *     tags: [Patient Doctor Discovery]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: "Filter date in YYYY-MM-DD format (default: today)"
 *         example: "2025-05-20"
 *     responses:
 *       200:
 *         description: Available doctors list fetched successfully
 */
router.get("/alldetails", UserMiddleware, ReadDoctorForPatient);

/**
 * @swagger
 * /api/patient/GetSingleDoctor/{id}:
 *   get:
 *     summary: Get doctor basic details by ID
 *     tags: [Patient Doctor Discovery]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: DoctorBasic ObjectId
 *     responses:
 *       200:
 *         description: Doctor found successfully
 *       400:
 *         description: Doctor not found
 */
router.get("/GetSingleDoctor/:id", UserMiddleware, GetSingleDoctor);

/**
 * @swagger
 * /api/patient/GetScheduleDoctor/{id}:
 *   get:
 *     summary: Get doctor's working schedule and booked slots for a specific date
 *     tags: [Patient Doctor Discovery]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ObjectId
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: "Date in YYYY-MM-DD format"
 *         example: "2025-05-20"
 *     responses:
 *       200:
 *         description: Schedule and booked slots returned
 *       400:
 *         description: Doctor schedule not configured
 */
router.get("/GetScheduleDoctor/:id", UserMiddleware, GetScheduleDoctor);


// ==========================================
// 3. APPOINTMENTS & BOOKINGS
// ==========================================

/**
 * @swagger
 * /api/patient/PatientAppointment/{id}:
 *   post:
 *     summary: Book appointment with Razorpay payment verification & optional medical report upload
 *     tags: [Patient Appointments]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ObjectId
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
 *               patientName:
 *                 type: string
 *                 example: John Doe
 *               contactNumber:
 *                 type: string
 *                 example: "9876543210"
 *               age:
 *                 type: number
 *                 example: 28
 *               gender:
 *                 type: string
 *                 example: Male
 *               bookingDate:
 *                 type: string
 *                 example: "2025-05-20"
 *               slotTime:
 *                 type: string
 *                 example: "10:30 AM"
 *               symptoms:
 *                 type: string
 *                 example: "Fever, cold and headache"
 *               consultation:
 *                 type: string
 *                 example: "Online Video Consultation"
 *               paymentMode:
 *                 type: string
 *                 example: "Online"
 *               amount:
 *                 type: number
 *                 example: 500
 *               fee:
 *                 type: number
 *                 example: 500
 *               razorpayOrderId:
 *                 type: string
 *                 example: order_DBJOWzybf0sJbb
 *               razorpayPaymentId:
 *                 type: string
 *                 example: pay_29QQoUBcxNqdf0
 *               razorpaySignature:
 *                 type: string
 *                 example: 9ef4b4...generatedSignature
 *               report:
 *                 type: string
 *                 format: binary
 *                 description: Medical report document / image
 *     responses:
 *       200:
 *         description: Booking done successfully and payment verified
 *       400:
 *         description: Slot already booked, invalid amount, or payment verification failed
 */
router.post(
  "/PatientAppointment/:id",
  UserMiddleware,
  upload.single("report"),
  PatientAppointment
);

/**
 * @swagger
 * /api/patient/get/bookingDetails:
 *   get:
 *     summary: Get all bookings of the logged-in patient
 *     tags: [Patient Appointments]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of patient bookings
 *       400:
 *         description: No bookings found
 */
router.get("/get/bookingDetails", UserMiddleware, bookingDetails);


// ==========================================
// 4. MEDICINE & PRESCRIPTIONS
// ==========================================

/**
 * @swagger
 * /api/patient/PatientMedicineDetails:
 *   get:
 *     summary: Get patient appointment details along with prescription orders
 *     tags: [Patient Prescriptions & Medicine]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Details fetched successfully
 */
router.get("/PatientMedicineDetails", UserMiddleware, PatientMedicineDetails);

/**
 * @swagger
 * /api/patient/savePatientMedicineDetails:
 *   post:
 *     summary: Upload and save patient medicine / prescription details
 *     tags: [Patient Prescriptions & Medicine]
 *     security:
 *       - bearerAuth: []
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
 *               PatientName:
 *                 type: string
 *                 example: John Doe
 *               contactNumber:
 *                 type: string
 *                 example: "9876543210"
 *               Address:
 *                 type: string
 *                 example: "Flat 402, Green Valley Apartments"
 *               PrescriptionText:
 *                 type: string
 *                 example: "Paracetamol 500mg, twice a day"
 *               ownerId:
 *                 type: string
 *                 example: "64fa8...doctorOrAdminId"
 *               prescriptionImage:
 *                 type: string
 *                 format: binary
 *                 description: Uploaded prescription image
 *     responses:
 *       201:
 *         description: Patient medicine details saved successfully
 *       400:
 *         description: Required fields missing
 */
router.post(
  "/savePatientMedicineDetails",
  UserMiddleware,
  upload.single("prescriptionImage"),
  savePatientMedicineDetails
);

router.get('/get/All/Medicine',UserMiddleware,searching);
router.post('/med/user/cart/:medicineId',UserMiddleware,AddItem);
router.post("/med/user/cart/:medicineId/decrease",UserMiddleware,DecreaseQuantity)
router.delete('/med/user/cart/:medicineId',UserMiddleware,removeMedicine);

export default router;