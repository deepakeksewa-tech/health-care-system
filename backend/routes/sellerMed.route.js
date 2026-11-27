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
router.post('/Signup', MedSellerSignup);
router.post('/Login', MedSellerLogin);
router.post('/Add/Medicine', MedSellerMiddleware, AddMedicine);
router.get('/Get/All/Medicine', MedSellerMiddleware, getSellerMedicine);
router.get('/Get/Single/Medicine/:MedId', MedSellerMiddleware, GetSingleMedicine);
router.patch('/Update/Medicine/:MedId', MedSellerMiddleware, UpdateMedicine);
router.delete('/Delete/Medicine/:MedId', MedSellerMiddleware, DeleteMedicine);
router.get('/Get/Details', MedSellerMiddleware, GetSellerDetails);
router.patch('/Update/Details', MedSellerMiddleware, UpdateSellerDetails);
router.patch('/Deactivate/Account', MedSellerMiddleware, DeleteSellerAccount);
router.post('/Add/Med/Category',MedSellerMiddleware,AddCategory);
router.get('/Get/Med/Category',MedSellerMiddleware,readCategory);
export default router;
