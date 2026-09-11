import "dotenv/config";
import nodemailer from "nodemailer";

// 1. Create the transporter globally so other files can import it
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure:true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 2. Function to verify connection (call this in server.js)
const connectSMTP = async () => {
  try {
    await transporter.verify();
    console.log("SMTP Connected successfully");
  } catch (error) {
    console.error("SMTP Connection Failed:", error.message);
  }
};

export default connectSMTP;