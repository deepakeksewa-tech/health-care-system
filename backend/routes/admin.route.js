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
  ReadBasicDetails
} from "../controllers/admin.controller.js";

import adminMiddleware from "../middleware/AdminMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     CookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 *     AdminCreateRequest:
 *       type: object
 *       required:
 *         - gmail
 *       properties:
 *         gmail:
 *           type: string
 *           format: email
 *           example: admin@medsewa.com
 * 
 *     AdminLoginRequest:
 *       type: object
 *       required:
 *         - gmail
 *         - password
 *       properties:
 *         gmail:
 *           type: string
 *           format: email
 *           example: admin@medsewa.com
 *         password:
 *           type: string
 *           format: password
 *           example: "12345"
 * 
 *     AdminResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 */

// =========================================================================
// ADMIN MANAGEMENT & AUTH ROUTES
// =========================================================================

/**
 * @swagger
 * /api/admin/create/Admin:
 *   post:
 *     summary: Create a new Admin account
 *     tags: [Admin Management]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminCreateRequest'
 *     responses:
 *       200:
 *         description: Admin created successfully & credentials emailed.
 *       400:
 *         description: Admin already exists.
 *       401:
 *         description: Unauthorized / Missing Admin Token.
 */
router.post("/create/Admin", adminMiddleware, AdminCreate);

/**
 * @swagger
 * /api/admin/get/Admins:
 *   get:
 *     summary: Get list of all Admins
 *     tags: [Admin Management]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: List of admins retrieved successfully.
 *       400:
 *         description: No admins found.
 *       401:
 *         description: Unauthorized.
 */
router.get("/get/Admins", adminMiddleware, ListOfAdmins);

/**
 * @swagger
 * /api/admin/delete/admin/{id}:
 *   get:
 *     summary: Delete an Admin by ID
 *     tags: [Admin Management]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the Admin to delete
 *     responses:
 *       200:
 *         description: Admin deleted successfully.
 *       400:
 *         description: Admin not found with given ID.
 *       401:
 *         description: Unauthorized.
 */
router.get('/delete/admin/:id', adminMiddleware, deletingAdmin);

/**
 * @swagger
 * /api/admin/check/credentials:
 *   post:
 *     summary: Admin Login
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful. Sets JWT cookie and returns token.
 *       400:
 *         description: Invalid credentials or incorrect password.
 */
router.post('/check/credentials', checkPassword);


// =========================================================================
// DOCTOR REGISTRATION & VERIFICATION ROUTES
// =========================================================================

/**
 * @swagger
 * /api/admin/get/PendingDoctor:
 *   get:
 *     summary: Get list of doctors with pending verification
 *     tags: [Admin - Doctor Verification]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: List of pending doctors fetched successfully.
 *       400:
 *         description: No pending registrations found.
 */
router.get("/get/PendingDoctor", adminMiddleware, ReadRegistration);

/**
 * @swagger
 * /api/admin/verification/reject/{id}:
 *   get:
 *     summary: Reject doctor verification application
 *     tags: [Admin - Doctor Verification]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor Registration Mongo ID
 *     responses:
 *       200:
 *         description: Registration rejected and rejection email sent.
 *       400:
 *         description: Doctor verification record not found.
 */
router.get("/verification/reject/:id", adminMiddleware, RejectRegistration);

/**
 * @swagger
 * /api/admin/verification/accept/{id}:
 *   get:
 *     summary: Accept doctor verification application
 *     tags: [Admin - Doctor Verification]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor Registration Mongo ID
 *     responses:
 *       200:
 *         description: Registration verified and onboarding link emailed.
 *       400:
 *         description: Doctor registration record not found.
 */
router.get("/verification/accept/:id", adminMiddleware, AcceptRegistration);

/**
 * @swagger
 * /api/admin/delete/doctor/{id}:
 *   get:
 *     summary: Delete doctor basic details by ID
 *     tags: [Admin - Doctor Verification]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor Basic Mongo ID
 *     responses:
 *       200:
 *         description: Doctor deleted successfully.
 *       400:
 *         description: Doctor not found.
 */
router.get("/delete/doctor/:id", adminMiddleware, deletingDoctor);


// =========================================================================
// DOCTOR BASIC DETAILS & SYSTEM DATA
// =========================================================================

/**
 * @swagger
 * /api/admin/get/AllDoctor/BasicDetails:
 *   get:
 *     summary: Get basic details of all verified doctors
 *     tags: [Admin - System Data]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Basic details fetched successfully.
 *       400:
 *         description: No doctors found.
 */
router.get("/get/AllDoctor/BasicDetails", adminMiddleware, ReadBasicDetails);

/**
 * @swagger
 * /api/admin/get/AllUsers:
 *   get:
 *     summary: Get list of all registered users/patients
 *     tags: [Admin - System Data]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Users list fetched successfully.
 *       400:
 *         description: No users found.
 */
router.get("/get/AllUsers", adminMiddleware, getAllUsers);

/**
 * @swagger
 * /api/admin/get/AllPatients/{id}:
 *   get:
 *     summary: Get all patient bookings/appointments created by a specific User ID
 *     tags: [Admin - System Data]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User Mongo ID
 *     responses:
 *       200:
 *         description: Patient appointments retrieved successfully.
 *       400:
 *         description: No bookings found for this user.
 */
router.get("/get/AllPatients/:id", adminMiddleware, getAllPatients);

/**
 * @swagger
 * /api/admin/get/AllDoctor/{id}:
 *   get:
 *     summary: Get booking history for a specific Doctor ID
 *     tags: [Admin - System Data]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor Mongo ID
 *     responses:
 *       200:
 *         description: Doctor booking history retrieved successfully.
 */
router.get("/get/AllDoctor/:id", adminMiddleware, doctorHistory);

export default router;