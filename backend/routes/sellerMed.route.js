import express from 'express';
import MedSellerMiddleware from '../middleware/MedSellerMiddleware.js';
import {
  AddCategory,
  AddMedicine,
  DeleteMedicine,
  DeleteSellerAccount,
  GetSellerDetails,
  getSellerMedicine,
  GetSingleMedicine,
  MedSellerLogin,
  MedSellerSignup,
  readCategory,
  UpdateMedicine,
  UpdateSellerDetails
} from '../controllers/medicine.controller.js';

const router = express.Router();

/**
 * @swagger
 * /med/seller/Signup:
 *   post:
 *     summary: Register a new medicine seller
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - shopName
 *               - gmail
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               shopName:
 *                 type: string
 *                 example: HealthCare Pharmacy
 *               gmail:
 *                 type: string
 *                 example: seller@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       201:
 *         description: Medicine Seller Added Successfully
 *       400:
 *         description: Validation error or duplicate account
 */
router.post('/Signup', MedSellerSignup);

/**
 * @swagger
 * /med/seller/Login:
 *   post:
 *     summary: Seller Login
 *     tags: [Auth]
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
 *                 example: seller@example.com
 *               password:
 *                 type: string
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/Login', MedSellerLogin);

/**
 * @swagger
 * /med/seller/Add/Medicine:
 *   post:
 *     summary: Add a new medicine
 *     tags: [Medicines]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Medicine_name
 *               - Expiry_Date
 *               - Stock
 *               - MRP
 *               - Discount
 *               - Manufacturer_name
 *               - Use_For
 *             properties:
 *               Medicine_name:
 *                 type: string
 *                 example: Paracetamol 500mg
 *               Expiry_Date:
 *                 type: string
 *                 example: "2027-12-31"
 *               Stock:
 *                 type: integer
 *                 example: 100
 *               MRP:
 *                 type: number
 *                 example: 50.0
 *               Discount:
 *                 type: number
 *                 example: 5.0
 *               Manufacturer_name:
 *                 type: string
 *                 example: Cipla Ltd.
 *               Use_For:
 *                 type: string
 *                 example: Fever and mild pain relief
 *     responses:
 *       201:
 *         description: Medicine Added Successfully
 */
router.post('/Add/Medicine', MedSellerMiddleware, AddMedicine);

/**
 * @swagger
 * /med/seller/Get/All/Medicine:
 *   get:
 *     summary: Get all medicines of logged-in seller
 *     tags: [Medicines]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of medicines
 */
router.get('/Get/All/Medicine', MedSellerMiddleware, getSellerMedicine);

/**
 * @swagger
 * /med/seller/Get/Single/Medicine/{MedId}:
 *   get:
 *     summary: Get single medicine by ID
 *     tags: [Medicines]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: MedId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicine details
 */
router.get('/Get/Single/Medicine/:MedId', MedSellerMiddleware, GetSingleMedicine);

/**
 * @swagger
 * /med/seller/Update/Medicine/{MedId}:
 *   patch:
 *     summary: Update single medicine
 *     tags: [Medicines]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: MedId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Medicine_name:
 *                 type: string
 *               MRP:
 *                 type: number
 *               Discount:
 *                 type: number
 *               Stock:
 *                 type: integer
 *               Expiry_Date:
 *                 type: string
 *               Manufacturer_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medicine updated successfully
 */
router.patch('/Update/Medicine/:MedId', MedSellerMiddleware, UpdateMedicine);

/**
 * @swagger
 * /med/seller/Delete/Medicine/{MedId}:
 *   delete:
 *     summary: Delete a medicine
 *     tags: [Medicines]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: MedId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Medicine deleted successfully
 */
router.delete('/Delete/Medicine/:MedId', MedSellerMiddleware, DeleteMedicine);

/**
 * @swagger
 * /med/seller/Get/Details:
 *   get:
 *     summary: Get seller profile details
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller profile data
 */
router.get('/Get/Details', MedSellerMiddleware, GetSellerDetails);

/**
 * @swagger
 * /med/seller/Update/Details:
 *   patch:
 *     summary: Update seller profile
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shopName:
 *                 type: string
 *               phone:
 *                 type: string
 *               gmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seller updated successfully
 */
router.patch('/Update/Details', MedSellerMiddleware, UpdateSellerDetails);

/**
 * @swagger
 * /med/seller/Deactivate/Account:
 *   patch:
 *     summary: Deactivate seller account
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deactivated successfully
 */
router.patch('/Deactivate/Account', MedSellerMiddleware, DeleteSellerAccount);
router.post('/Add/Med/Category',MedSellerMiddleware,AddCategory);
router.get('/Get/Med/Category',MedSellerMiddleware,readCategory);
export default router;