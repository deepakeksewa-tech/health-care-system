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


router.post("/create/Admin", AdminCreate);
router.get("/get/Admins", adminMiddleware, ListOfAdmins);
router.get('/delete/admin/:id', adminMiddleware, deletingAdmin);
router.post('/check/credentials', checkPassword);
router.get("/get/PendingDoctor", adminMiddleware, ReadRegistration);
router.get("/verification/reject/:id", adminMiddleware, RejectRegistration);
router.get("/verification/accept/:id", adminMiddleware, AcceptRegistration);
router.get("/delete/doctor/:id", adminMiddleware, deletingDoctor);
router.get("/get/AllDoctor/BasicDetails", adminMiddleware, ReadBasicDetails);
router.get("/get/AllUsers", adminMiddleware, getAllUsers);
router.get("/get/AllPatients/:id", adminMiddleware, getAllPatients);
router.get("/get/AllDoctor/:id", adminMiddleware, doctorHistory);

export default router;