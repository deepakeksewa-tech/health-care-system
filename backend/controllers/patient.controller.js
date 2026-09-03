import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import fs from 'fs';

// Models
import { payment } from '../models/payment.model.js';
import { DoctorRegistration, DoctorBasic, DoctorWeekly, DoctorLocation } from '../models/doctor.model.js';
import { Patient, userModel, PatientMedicine } from '../models/patient.model.js';
import cloudinary from '../config/cloudinary.js';

// Helper: Secure Timing-Safe String Comparison
const safeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

// ==========================================
// 1. SIGNUP CONTROLLER
// ==========================================
export const signup = async (req, res) => {
  try {
    const { name, contact, password } = req.body;
    const gmail = req.body.gmail ? req.body.gmail.toLowerCase().trim() : "";

    const check = await userModel.findOne({ gmail });
    if (check) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.HASHROUND || 10));
    const save = await userModel.create({
      name,
      gmail,
      contact,
      password: hashedPassword
    });

    // Webhook (non-blocking)
    if (process.env.N8N_WEBHOOK) {
      fetch(process.env.N8N_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mail: save.gmail,
          subject: "Thank You for Logging In - MEDSEWA",
          message: `Dear ${save.name || "User"},\n\nThank you for signing up on MEDSEWA!\n\nBest regards,\nThe MEDSEWA Team`
        }),
      }).catch(err => console.error("Webhook mail error:", err));
    }

    return res.status(200).json({ success: true, message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. LOGIN CONTROLLER
// ==========================================
export const login = async (req, res) => {
  try {
    const gmail = (req.body.gmail || "").toLowerCase().trim();
    const { password } = req.body;

    const check = await userModel.findOne({ gmail });
    if (!check) {
      return res.status(400).json({ success: false, message: "Please enter correct credentials" });
    }

    const checkPassword = await bcrypt.compare(password, check.password);
    if (!checkPassword) {
      return res.status(400).json({ success: false, message: "Please enter correct credentials" });
    }

    const token = jwt.sign({ id: check._id ,role:check.role}, process.env.JWT_TOKEN, { expiresIn: '24h' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. READ DOCTORS FOR PATIENT (BY DATE)
// ==========================================
export const ReadDoctorForPatient = async (req, res) => {
  try {
    const { date } = req.query;

    let formattedDateStr;

    if (date) {
      // YYYY-MM-DD only
      formattedDateStr = date.split("T")[0];
    } else {
      // Current date in India
      formattedDateStr = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
    }

    // IMPORTANT:
    // YYYY-MM-DD ko UTC date ke roop mein parse karo
    const targetDate = new Date(`${formattedDateStr}T00:00:00.000Z`);

    // Weekday UTC se nikalo
    const targetDay = targetDate.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });

    console.log("=================================");
    console.log("Received date:", date);
    console.log("Formatted date:", formattedDateStr);
    console.log("Target day:", targetDay);
    console.log("=================================");

    const weeklySchedule = await DoctorWeekly
      .find()
      .populate("doctorId");

    const data = [];

    weeklySchedule.forEach((doctor) => {
      if (!doctor.doctorId) return;

      doctor.weekly.forEach((schedule) => {
        if (
          schedule.day &&
          schedule.day.toLowerCase() === targetDay.toLowerCase() &&
          schedule.status === true
        ) {
          data.push({
            doctor: doctor.doctorId,
            schedule,
            date: formattedDateStr,
          });
        }
      });
    });

    return res.status(200).json({
      success: true,
      data,
      message: data.length
        ? `Doctors available for ${targetDay} fetched successfully`
        : `No doctors available on ${targetDay}`,
    });

  } catch (error) {
    console.error("ReadDoctorForPatient Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// 4. GET SINGLE DOCTOR
// ==========================================
export const GetSingleDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const find = await DoctorBasic.findById(id);
    if (!find) {
      return res.status(400).json({ success: false, message: "Doctor not found" });
    }

    return res.status(200).json({ success: true, message: "Doctor found successfully", data: find });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. GET SCHEDULE DOCTOR (BY DATE & BOOKED SLOTS)
// ==========================================
export const GetScheduleDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    let targetDate;
    let formattedDateStr = "";

    if (date) {
      formattedDateStr = date.split('T')[0];
      const [year, month, day] = formattedDateStr.split('-').map(Number);
      targetDate = new Date(year, month - 1, day);
    } else {
      targetDate = new Date();
      formattedDateStr = targetDate.toISOString().split('T')[0];
    }

    const targetDay = targetDate.toLocaleDateString("en-US", { weekday: "long" });

    // 1. Doctor ka Weekly Schedule dhoondhein
    const doctorSchedule = await DoctorWeekly.findOne({ doctorId: id });
    if (!doctorSchedule) {
      return res.status(400).json({ success: false, message: "Doctor schedule is not set", data: [] });
    }

    // 2. Us day ka active schedule filter karein
    const daySchedule = doctorSchedule.weekly.find(
      s => s.day.toLowerCase() === targetDay.toLowerCase() && s.status === true
    );

    if (!daySchedule) {
      return res.status(200).json({
        success: true,
        message: `Doctor is not available on ${targetDay}`,
        schedule: null,
        bookedSlots: []
      });
    }

    // 3. Selected Date par pehle se book hue slots fetch karein
    const existingBookings = await Patient.find({
      doctorId: id,
      bookingDate: formattedDateStr,
      status: { $ne: "Cancelled" }
    }).select("slotTime");

    const bookedSlots = existingBookings.map(b => b.slotTime);

    return res.status(200).json({
      success: true,
      message: `Doctor schedule for ${targetDay} fetched successfully`,
      schedule: {
        start: daySchedule.start,
        end: daySchedule.end
      },
      bookedSlots
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. CREATE PATIENT APPOINTMENT
// ==========================================
export const PatientAppointment = async (req, res) => {
  let localFilePath = req.file?.path;

  try {
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

    const age = Number(req.body.age) || 0;
    const bookingAmount = Number(amount || fee) || 0;

    if (isNaN(bookingAmount) || bookingAmount <= 0) {
      if (localFilePath && fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      return res.status(400).json({ success: false, message: "Invalid booking amount" });
    }
   const meet = await fetch(
  "https://n8n-szld.onrender.com/webhook/37afe49c-f094-4729-8b74-eceeabb6ae61",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      
    })
  }
);

const result = await meet.json();

console.log(result.meetingLink);

    // 1. Double Booking Check
    const existingBooking = await Patient.findOne({
      doctorId,
      bookingDate,
      slotTime,
      status: { $ne: "Cancelled" }
    });

    if (existingBooking) {
      if (localFilePath && fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      return res.status(400).json({
        success: false,
        message: "This slot is already booked for the selected date. Please select another slot."
      });
    }

    // 2. Verify Payment Signature BEFORE external side effects
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      if (localFilePath && fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      return res.status(400).json({
        success: false,
        message: "Payment details missing."
      });
    }

    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (!safeCompare(expectedSignature, razorpaySignature)) {
      if (localFilePath && fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      return res.status(400).json({
        success: false,
        message: "Payment verification failed! Invalid signature."
      });
    }

    // 3. Upload file to Cloudinary after verification passes
    let reportUrl = "";
    if (localFilePath) {
      const uploadedReport = await cloudinary.uploader.upload(localFilePath, { folder: "Patients" });
      reportUrl = uploadedReport.secure_url;
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    }

    // 4. Save Appointment
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
      razorpaySignature,
      meetingLink:result.meetingLink
    });

    // 5. Update Doctor Payment Earnings
    let pay = await payment.findOne({ userId: doctorId });
    if (!pay) {
      await payment.create({ userId: doctorId, money: bookingAmount });
    } else {
      pay.money += bookingAmount;
      await pay.save();
    }

    // 6. Fetch Metadata & Trigger Webhook
    const location = await DoctorLocation.findOne({ doctorId }).populate('doctorId');
    const user = await userModel.findById(userId);

    const mapLink = location?.latitude && location?.longitude
      ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : "Location not available";

    const clinicAddress = location
      ? `${location.streetAddress || ''}, Landmark: ${location.landmark || ''}, ${location.city || ''}, ${location.state || ''} - ${location.zip || ''}`
      : "Address not provided";

    let doctorEmail = "";
    if (location?.doctorId?.doctorId) {
      const doctorReg = await DoctorRegistration.findById(location.doctorId.doctorId);
      doctorEmail = doctorReg?.gmail || "";
    }

    const isOnline = consultation?.toLowerCase().includes("online") || consultation?.toLowerCase().includes("video");

   if (process.env.N8N_WEBHOOK) {
  // 1. Patient Email Webhook
  const patientWebhook = fetch(process.env.N8N_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mail: user?.gmail,
      subject: `Appointment Confirmed with Dr. ${location?.doctorId?.name || "Doctor"} - MEDSEWA`,
      message: `Dear ${patientName},\n\nYour appointment has been successfully booked on MEDSEWA!\n\n📌 APPOINTMENT DETAILS:\n• Doctor: Dr. ${location?.doctorId?.name || "Doctor"}\n• Date: ${bookingDate}\n• Time Slot: ${slotTime}\n• Mode: ${consultation}\n\n📍 VENUE / LOCATION:\n${isOnline ? "Online Video Consultation" : `Clinic Address: ${clinicAddress}\nGoogle Maps: ${mapLink}`}\n\n💳 PAYMENT DETAILS:\n• Amount Paid: ₹${bookingAmount}\n• Payment ID: ${razorpayPaymentId}\n\nBest regards,\nMEDSEWA Team`,
      doctorEmail,
      patientName,
      bookingDate,
      slotTime,
      amount: bookingAmount,
      razorpayPaymentId
    })
  });

  // 2. Doctor Email Webhook
  const doctorWebhook = fetch(process.env.N8N_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mail: doctorEmail,
      subject: `New Appointment Booked: ${patientName} - MEDSEWA`,
      message: `Dear Dr. ${location?.doctorId?.name || "Doctor"},\n\nA new appointment has been successfully booked by a patient on MEDSEWA!\n\n📌 APPOINTMENT DETAILS:\n• Patient Name: ${patientName}\n• Date: ${bookingDate}\n• Time Slot: ${slotTime}\n• Mode: ${consultation}\n\n📍 VENUE / LOCATION:\n${isOnline ? "Online Video Consultation" : `Clinic Address: ${clinicAddress}\nGoogle Maps: ${mapLink}`}\n\n💳 PAYMENT DETAILS:\n• Amount: ₹${bookingAmount}\n• Payment ID: ${razorpayPaymentId}\n\nBest regards,\nMEDSEWA Team`,
      doctorEmail,
      patientName,
      bookingDate,
      slotTime,
      amount: bookingAmount,
      razorpayPaymentId
    })
  });

  // Dono requests ko parallelly fire kar do aur errors catch kar lo
  Promise.all([patientWebhook, doctorWebhook])
    .catch(err => console.error("n8n Webhook Error:", err));
}

    return res.status(200).json({
      success: true,
      message: "Booking done successfully and payment verified!",
      data: save._id
    });

  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    console.error("Error in PatientAppointment:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// ==========================================
// 7. BOOKING DETAILS CONTROLLER
// ==========================================
export const bookingDetails = async (req, res) => {
  try {
    const id = req.id;
    const find = await Patient.find({ userId: id });
    if (!find.length) {
      return res.status(400).json({ success: false, message: "There is no booking", data: [] });
    }
    return res.status(200).json({ success: true, message: "The bookings are:", data: find });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

// ==========================================
// 8. PATIENT MEDICINE DETAILS CONTROLLERS
// ==========================================
export const PatientMedicineDetails = async (req, res) => {
  try {
    const id = req.id;
    const find = await Patient.find({ userId: id });
    const patientMedicineDetails = await PatientMedicine.find({ userId: id });

    return res.status(200).json({
      success: true,
      message: "Details fetched successfully",
      data: find,
      patientMedicineDetails
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

export const savePatientMedicineDetails = async (req, res) => {
  const localFilePath = req.file?.path;
  try {
    const userId = req.id;
    const { PatientName, contactNumber, Address, PrescriptionText, ownerId } = req.body;

    if (!PatientName || !contactNumber || !Address || !ownerId) {
      if (localFilePath && fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      return res.status(400).json({
        success: false,
        message: "PatientName, contactNumber, Address and ownerId are required"
      });
    }

    let prescriptionImageUrl = "";
    if (localFilePath) {
      const result = await cloudinary.uploader.upload(localFilePath, { folder: "Prescriptions" });
      prescriptionImageUrl = result.secure_url;
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    }

    const newPatientMedicine = await PatientMedicine.create({
      userId,
      PatientName,
      contactNumber,
      Address,
      PrescriptionImage: prescriptionImageUrl,
      PrescriptionText: PrescriptionText || "",
      ownerId
    });

    return res.status(201).json({
      success: true,
      message: "Patient medicine details saved successfully",
      data: newPatientMedicine
    });

  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};