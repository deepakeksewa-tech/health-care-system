import express from "express";
import upload from "../middleware/multer.js";
import authMiddleware from "../middleware/registraionMiddleware.js";
import DoctorMiddleware from "../middleware/DoctorMiddleware.js";
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

/**
 * @swagger
 * tags:
 *   - name: Doctor Registration & Auth
 *   - name: Doctor Profile & Setup
 *   - name: Doctor Appointments & Wallet
 *   - name: Specialization & Category
 */

/**
 * @swagger
 * /api/doctors/createRegistration:
 *   post:
 *     summary: Register a new doctor (Step 1 with Certificate)
 *     tags: [Doctor Registration & Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - registrationNo
 *               - registrationDate
 *               - password
 *               - stateMedicalCouncil
 *               - gmail
 *               - certificate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr. John Doe
 *               registrationNo:
 *                 type: string
 *                 example: REG-12345
 *               registrationDate:
 *                 type: string
 *                 example: "2023-01-15"
 *               password:
 *                 type: string
 *                 example: securePass123
 *               stateMedicalCouncil:
 *                 type: string
 *                 example: Delhi Medical Council
 *               gmail:
 *                 type: string
 *                 example: drjohn@example.com
 *               certificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Doctor registered successfully (Verification pending)
 *       400:
 *         description: Doctor or Gmail already exists / Missing certificate
 */
router.post(
  "/createRegistration",
  upload.single("certificate"),
  createRegistrationDoctor
);

/**
 * @swagger
 * /api/doctors/createBasic/{token}:
 *   post:
 *     summary: Add basic details of doctor (Step 2 post-verification)
 *     tags: [Doctor Registration & Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token received via email
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - experience
 *               - specification
 *               - language
 *               - contactNo
 *               - category
 *               - fee
 *               - image
 *             properties:
 *               experience:
 *                 type: string
 *                 example: "5 years"
 *               specification:
 *                 type: string
 *                 example: Cardiologist
 *               language:
 *                 type: string
 *                 example: English, Hindi
 *               contactNo:
 *                 type: string
 *                 example: "9876543210"
 *               category:
 *                 type: string
 *                 example: Heart Specialist
 *               fee:
 *                 type: number
 *                 example: 500
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Doctor basic details saved successfully
 *       400:
 *         description: Details already exist / Missing image
 */
router.post(
  "/createBasic/:token",
  upload.single("image"),
  authMiddleware,
  createBasicDoctor
);

/**
 * @swagger
 * /api/doctors/DoctorLogin:
 *   post:
 *     summary: Doctor Login
 *     tags: [Doctor Registration & Auth]
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
 *                 example: drjohn@example.com
 *               password:
 *                 type: string
 *                 example: securePass123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials or account not verified
 */
router.post("/DoctorLogin", DoctorLogin);

/**
 * @swagger
 * /api/doctors/Doctorlocation:
 *   post:
 *     summary: Setup Doctor Clinic / Hospital Location
 *     tags: [Doctor Profile & Setup]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longitude:
 *                 type: number
 *                 example: 77.2090
 *               latitude:
 *                 type: number
 *                 example: 28.6139
 *               streetAddress:
 *                 type: string
 *                 example: 123 Health Ave
 *               landmark:
 *                 type: string
 *                 example: Near City Hospital
 *               city:
 *                 type: string
 *                 example: New Delhi
 *               state:
 *                 type: string
 *                 example: Delhi
 *               zip:
 *                 type: string
 *                 example: "110001"
 *     responses:
 *       200:
 *         description: Location added successfully
 *       400:
 *         description: Doctor not found or location already set
 */
router.post("/Doctorlocation", DoctorMiddleware, LocationSetup);

/**
 * @swagger
 * /api/doctors/DoctorSchedule:
 *   post:
 *     summary: Set initial weekly availability schedule
 *     tags: [Doctor Profile & Setup]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weekly:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
 *     responses:
 *       200:
 *         description: Schedule saved successfully
 *       400:
 *         description: Doctor not found or schedule already exists
 */
router.post("/DoctorSchedule", DoctorMiddleware, weeklySchedule);

/**
 * @swagger
 * /api/doctors/get/name/image:
 *   get:
 *     summary: Get Doctor Name and Profile Image
 *     tags: [Doctor Profile & Setup]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Doctor name and image retrieved
 *       400:
 *         description: Doctor record not found
 */
router.get("/get/name/image", DoctorMiddleware, getName);

/**
 * @swagger
 * /api/doctors/profile:
 *   get:
 *     summary: Get doctor profile settings and schedule
 *     tags: [Doctor Profile & Setup]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Doctor settings retrieved successfully
 *       404:
 *         description: Doctor not found
 *   put:
 *     summary: Update doctor profile settings
 *     tags: [Doctor Profile & Setup]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               experience:
 *                 type: string
 *               fee:
 *                 type: number
 *               contactNo:
 *                 type: string
 *               specification:
 *                 type: string
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       404:
 *         description: Doctor not found
 */
router.get('/profile', DoctorMiddleware, getDoctorSettings);
router.put('/profile', DoctorMiddleware, updateDoctorSettings);
router.get('/settings', DoctorMiddleware, getDoctorSettings);
router.put('/settings', DoctorMiddleware, updateDoctorSettings);
/**
 * @swagger
 * /api/doctors/weekly-off:
 *   put:
 *     summary: Update weekly working schedule / off days
 *     tags: [Doctor Profile & Setup]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weekly:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Monday", "Wednesday", "Friday"]
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       404:
 *         description: Doctor not found
 */
router.put('/weekly-off', DoctorMiddleware, updateWeeklyOff);

/**
 * @swagger
 * /api/doctors/get/all/appointments:
 *   get:
 *     summary: Get all appointments for the logged-in doctor
 *     tags: [Doctor Appointments & Wallet]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Appointment list retrieved
 *       400:
 *         description: No appointments found
 */
router.get("/get/all/appointments", DoctorMiddleware, getAppointment);

/**
 * @swagger
 * /api/doctors/update/status:
 *   patch:
 *     summary: Update status of an appointment
 *     tags: [Doctor Appointments & Wallet]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: string
 *                 description: Appointment ObjectId
 *               status:
 *                 type: string
 *                 enum: [Pending, Ongoing, Completed, Cancelled]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status value
 *       403:
 *         description: Cannot modify Completed or Cancelled appointments
 *       404:
 *         description: Appointment not found
 */
router.patch("/update/status", DoctorMiddleware, updateAppointmentStatus);

/**
 * @swagger
 * /api/doctors/verify/password:
 *   post:
 *     summary: Verify doctor password to view wallet balance
 *     tags: [Doctor Appointments & Wallet]
 *     security:
 *       - bearerAuth: []
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
 *                 example: securePass123
 *     responses:
 *       200:
 *         description: Returns wallet/debit balance
 *       400:
 *         description: Password mismatch / payment record not found
 */
router.post("/verify/password", DoctorMiddleware, verifyPassword);

/**
 * @swagger
 * /api/doctors/widthraw/money:
 *   get:
 *     summary: Withdraw / Credit doctor wallet balance
 *     tags: [Doctor Appointments & Wallet]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Money credited successfully
 *       400:
 *         description: No money available or doctor/payment record not found
 */
router.get("/widthraw/money", DoctorMiddleware, creditedMoney);

/**
 * @swagger
 * /api/doctors/specialization:
 *   post:
 *     summary: Add new specialization
 *     tags: [Specialization & Category]
 *     security:
 *       - bearerAuth: []
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
 *                 example: Dermatology
 *     responses:
 *       200:
 *         description: Specialization added successfully
 *       400:
 *         description: Specialization already exists
 */
router.post("/specialization", DoctorMiddleware, specialization);

/**
 * @swagger
 * /api/doctors/ReadSpecialization:
 *   get:
 *     summary: Get all specializations
 *     tags: [Specialization & Category]
 *     responses:
 *       200:
 *         description: List of specializations
 */
router.get("/ReadSpecialization", ReadSpecialization);

/**
 * @swagger
 * /api/doctors/category:
 *   post:
 *     summary: Add new category
 *     tags: [Specialization & Category]
 *     security:
 *       - bearerAuth: []
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
 *                 example: Skin Care
 *     responses:
 *       200:
 *         description: Category added successfully
 *       400:
 *         description: Category already exists
 */
router.post("/category", DoctorMiddleware, category);

/**
 * @swagger
 * /api/doctors/ReadCategory:
 *   get:
 *     summary: Get all categories
 *     tags: [Specialization & Category]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/ReadCategory", ReadCategory);

export default router;