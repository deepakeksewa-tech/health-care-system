import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import fs from 'fs';
import { payment } from '../models/payment.model.js';
import cloudinary from '../config/cloudinary.js';
import {DoctorRegistration, DoctorBasic, DoctorWeekly,DoctorLocation } from '../models/doctor.model.js';
import {Patient,userModel} from '../models/patient.model.js';


// ==========================================
// 1. SIGNUP CONTROLLER
// ==========================================
export const signup = async (req, res) => {
  try {
    const name = req.body.name;
    const gmail = req.body.gmail ? req.body.gmail.toLowerCase() : "";
    const contact = req.body.contact;
    const password = await bcrypt.hash(req.body.password, Number(process.env.HASHROUND || 10));

    const check = await userModel.findOne({ gmail });
    if (check) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const save = await userModel.create({
      name, gmail, contact, password
    });

    // Send Mail Webhook (Non-blocking)
    fetch("https://deepak171.app.n8n.cloud/webhook/fa1b2de0-1463-4a4b-8e2c-4caa0c896f3a", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mail: save.gmail,
        subject: "Thank You for Logging In - MEDSEWA",
        message: `Dear ${save.name || "User"},\n\nThank you for signing up on MEDSEWA!\n\nBest regards,\nThe MEDSEWA Team`
      }),
    }).catch(err => console.error("Webhook mail error:", err));

    return res.status(200).json({
      success: true,
      message: "User created successfully"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. LOGIN CONTROLLER
// ==========================================
export const login = async (req, res) => {
  try {
    const g = req.body.gmail || "";
    const gmail = g.toLowerCase().trim();
    const password = req.body.password;

    const check = await userModel.findOne({ gmail });
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "Please enter correct credentials"
      });
    }

    const checkPassword = await bcrypt.compare(password, check.password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Please enter correct password"
      });
    }

    const token = jwt.sign({ id: check._id }, process.env.JWT_TOKEN, { expiresIn: '24h' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production mein HTTPS apply hone par true karein
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. READ DOCTORS FOR PATIENT
// ==========================================
export const ReadDoctorForPatient = async (req, res) => {
  try {
    const weeklySchedule = await DoctorWeekly.find().populate("doctorId");
    const now = new Date();
    const today = now.toLocaleDateString("en-IN", { weekday: "long" });
    const currentTime = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const data = [];
    weeklySchedule.forEach((doctor) => {
      doctor.weekly.forEach((schedule) => {
        if (
          schedule.day === today &&
          schedule.status === true &&
          schedule.start <= currentTime &&
          schedule.end >= currentTime
        ) {
          data.push({
            doctor: doctor.doctorId,
            schedule: schedule
          });
        }
      });
    });

    if (data.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No doctors available right now",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      data,
      message: "Doctor list fetched successfully"
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. GET SINGLE DOCTOR
// ==========================================
export const GetSingleDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const find = await DoctorBasic.findById(id);
    if (!find) {
      return res.status(400).json({
        message: "Doctor not found",
        success: false
      });
    }

    return res.status(200).json({
      message: "Doctor found successfully",
      success: true,
      data: find
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. GET SCHEDULE DOCTOR
// ==========================================
export const GetScheduleDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const find = await DoctorWeekly.findOne({ doctorId: id });
    if (!find) {
      return res.status(400).json({
        success: false,
        message: "Doctor schedule is not set",
        data: {}
      });
    }

    const now = new Date();
    const today = now.toLocaleDateString("en-IN", { weekday: "long" });
    const currentTime = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const data = [];
    find.weekly.forEach((schedule) => {
      if (
        schedule.day === today &&
        schedule.status === true &&
        schedule.start <= currentTime &&
        schedule.end >= currentTime
      ) {
        data.push({ schedule: schedule });
      }
    });

    return res.status(200).json({
      success: true,
      message: "Doctor schedule for today fetched successfully",
      data
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. CREATE PATIENT APPOINTMENT
// ==========================================
export const PatientAppointment = async (req, res) => {
  try {
    let reportUrl = "";

    // 1. Cloudinary File Upload
    if (req.file) {
      const uploadedReport = await cloudinary.uploader.upload(req.file.path, {
        folder: "Patients"
      });
      reportUrl = uploadedReport.secure_url;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    // 2. Extract Data
    const userId = req.id;
    const doctorId = req.params.id;
    const {
      patientName,
      contactNumber,
      gender,
      bookingDate,
      slotTime,
      symptoms = "",
      consultation,
      paymentMode = "Online",
      amount,
      fee,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body;

    // Fixed NaN Issue with default fallbacks
    const age = Number(req.body.age) || 0;
    const bookingAmount = Number(amount || fee) || 0;

    // 3. Razorpay Signature Verification
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature) {
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).send({
          success: false,
          message: "Payment verification failed! Invalid signature."
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "Payment details (Razorpay Order ID / Payment ID / Signature) are missing."
      });
    }

    // 4. Save Appointment to DB
    const save = await Patient.create({
      userId,
      doctorId,
      patientName,
      contactNumber,
      age,
      gender,
      bookingDate,
      slotTime,
      uploadReports: reportUrl,
      symptoms,
      consultation,
      status: "Pending",
      paymentMode,
      paymentStatus: "Paid",
      amount: bookingAmount,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });
 const amo=Number(bookingAmount)
    if (isNaN(amo) || amo <= 0) {
  return res.status(400).json({
    success: false,
    message: "Invalid booking amount",
  });
}
    const pay=await payment.findOne({userId:doctorId});
    if(!pay){
      await payment.create({userId:doctorId,money:amo})
      return res.status(200).send({
        success:true,
        message:"money updated",
      })
    }
   
    pay.money=pay.money+amo;
    await pay.save();


    // 5. Fetch Doctor Location & User Info
    const location = await DoctorLocation.findOne({ doctorId }).populate('doctorId');
    const user = await userModel.findById(userId);

    const mapLink = location?.latitude && location?.longitude
      ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : "Location not available";

    const clinicAddress = location
      ? `${location.streetAddress || ''}, Landmark: ${location.landmark || ''}, ${location.city || ''}, ${location.state || ''} - ${location.zip || ''}`
      : "Address not provided";

    // 6. Fetch Doctor's Email
    let doctorEmail = "";
    if (location?.doctorId?.doctorId) {
      const doctorReg = await DoctorRegistration.findById(location.doctorId.doctorId);
      doctorEmail = doctorReg?.gmail || "";
    }

    // 7. Format ISO String for Slot Time
    let appointmentDateTime = "";
    try {
      if (slotTime.includes('AM') || slotTime.includes('PM')) {
        const startTimeStr = slotTime.includes('-') ? slotTime.split('-')[0].trim() : slotTime.trim();
        const [time, modifier] = startTimeStr.split(' ');
        let [hours, minutes] = time.split(':');

        if (modifier === 'PM' && hours !== '12') {
          hours = parseInt(hours, 10) + 12;
        }
        if (modifier === 'AM' && hours === '12') {
          hours = '00';
        }

        appointmentDateTime = new Date(`${bookingDate}T${String(hours).padStart(2, '0')}:${minutes}:00`).toISOString();
      } else {
        const cleanSlotTime = slotTime.includes('-') ? slotTime.split('-')[0].trim() : slotTime.trim();
        appointmentDateTime = new Date(`${bookingDate}T${cleanSlotTime}:00`).toISOString();
      }
    } catch (err) {
      console.error("ISO Conversion Error:", err);
      appointmentDateTime = `${bookingDate}T00:00:00.000Z`;
    }

    const isOnline = consultation?.toLowerCase().includes("online") || consultation?.toLowerCase().includes("video");

    // 8. Trigger n8n Webhook
    try {
      const sendEmail = await fetch("https://deepak171.app.n8n.cloud/webhook/ee785f76-44be-47c5-a66c-fbafdd66214d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patientEmail: user?.gmail,
          doctorEmail: doctorEmail,
          patientName,
          doctorName: location?.doctorId?.name || "Doctor",
          contactNumber,
          age,
          gender,
          bookingDate,
          slotTime,
          appointmentDateTime,
          isOnline,
          consultation,
          paymentMode,
          amount: bookingAmount,
          symptoms,
          reportUrl,
          clinicAddress,
          mapLink,
          razorpayPaymentId
        })
      });
      console.log("n8n Response Status:", sendEmail.status);
    } catch (webhookErr) {
      console.error("n8n Webhook Trigger Error:", webhookErr);
    }

    return res.status(200).send({
      success: true,
      message: "Booking done successfully and payment verified!",
      data: save._id
    });

  } catch (error) {
    console.error("Error in PatientAppointment:", error);
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};

// ==========================================
// 7. BOOKING DETAILS CONTROLLER
// ==========================================
export const bookingDetails = async (req, res) => {
  try {
    const id = req.id;
    const find = await Patient.find({ userId: id });
    if (find.length === 0) {
      return res.status(400).send({
        success: false,
        message: "There is no booking",
        data: []
      });
    }
    return res.status(200).send({
      success: true,
      message: "The bookings are:",
      data: find
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};