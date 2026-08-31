import express from "express";
import {
  doctorHistory,
  AcceptRegistration,
  getAllUsers,
  deletingDoctor,
  getAllPatients,
  deletingAdmin,
  RejectRegistration,
  ListOfAdmins,
  checkPassword,
  AdminCreate,
  ReadRegistration,
  ReadBasicDetails,
  GetAllMedSeller
} from "../controllers/admin.controller.js";
import adminMiddleware from "../middleware/AdminMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin Auth & Management
 *   - name: Doctor Verification
 *   - name: Doctors & Users
 *   - name: Bookings & History
 */

/**
 * @swagger
 * /api/admin/create/Admin:
 *   post:
 *     summary: Create a new Admin
 *     tags: [Admin Auth & Management]
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
 *               - gmail
 *             properties:
 *               gmail:
 *                 type: string
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: Admin created successfully
 *       400:
 *         description: Admin already exists
 */
router.post("/create/Admin", adminMiddleware, AdminCreate);

/**
 * @swagger
 * /api/admin/get/Admins:
 *   get:
 *     summary: List all Admins
 *     tags: [Admin Auth & Management]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *       400:
 *         description: No admins found
 */
router.get("/get/Admins", adminMiddleware, ListOfAdmins);

/**
 * @swagger
 * /api/admin/delete/admin/{id}:
 *   get:
 *     summary: Delete an Admin by ID
 *     tags: [Admin Auth & Management]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       400:
 *         description: Admin not found
 */
router.get('/delete/admin/:id', adminMiddleware, deletingAdmin);

/**
 * @swagger
 * /api/admin/check/credentials:
 *   post:
 *     summary: Admin Login / Check credentials
 *     tags: [Admin Auth & Management]
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
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/check/credentials', checkPassword);

/**
 * @swagger
 * /api/admin/get/PendingDoctor:
 *   get:
 *     summary: Get pending doctor registrations
 *     tags: [Doctor Verification]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of pending registrations
 *       400:
 *         description: No pending registrations
 */
router.get("/get/PendingDoctor", adminMiddleware, ReadRegistration);

/**
 * @swagger
 * /api/admin/verification/reject/{id}:
 *   get:
 *     summary: Reject doctor registration
 *     tags: [Doctor Verification]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor verification rejected
 *       400:
 *         description: Doctor not found
 */
router.get("/verification/reject/:id", adminMiddleware, RejectRegistration);

/**
 * @swagger
 * /api/admin/verification/accept/{id}:
 *   get:
 *     summary: Accept doctor registration
 *     tags: [Doctor Verification]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor verification accepted
 *       400:
 *         description: Doctor not found
 */
router.get("/verification/accept/:id", adminMiddleware, AcceptRegistration);

/**
 * @swagger
 * /api/admin/delete/doctor/{id}:
 *   get:
 *     summary: Delete Doctor basic details by ID
 *     tags: [Doctors & Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       400:
 *         description: No doctor found
 */
router.get("/delete/doctor/:id", adminMiddleware, deletingDoctor);

/**
 * @swagger
 * /api/admin/get/AllDoctor/BasicDetails:
 *   get:
 *     summary: Get basic details of all doctors
 *     tags: [Doctors & Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of doctor details
 *       400:
 *         description: No doctors found
 */
router.get("/get/AllDoctor/BasicDetails", adminMiddleware, ReadBasicDetails);

/**
 * @swagger
 * /api/admin/get/AllUsers:
 *   get:
 *     summary: Get all users
 *     tags: [Doctors & Users]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       400:
 *         description: No users found
 */
router.get("/get/AllUsers", adminMiddleware, getAllUsers);

/**
 * @swagger
 * /api/admin/get/AllPatients/{id}:
 *   get:
 *     summary: Get all patient bookings of a specific user
 *     tags: [Bookings & History]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient bookings retrieved
 *       400:
 *         description: No bookings found
 */
router.get("/get/AllPatients/:id", adminMiddleware, getAllPatients);

/**
 * @swagger
 * /api/admin/get/AllDoctor/{id}:
 *   get:
 *     summary: Get doctor's booking history
 *     tags: [Bookings & History]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookings retrieved
 *       400:
 *         description: No bookings found
 */
router.get("/get/AllDoctor/:id", adminMiddleware, doctorHistory);


router.get("/get/All/Medicine/Seller",adminMiddleware,GetAllMedSeller);
export default router;