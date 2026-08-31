import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

// Initialize Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @swagger
 * tags:
 *   - name: Razorpay Payments
 *     description: Endpoints for creating orders and verifying payment signatures
 */

/**
 * @swagger
 * /api/payment/create-order:
 *   post:
 *     summary: Create a Razorpay Order
 *     tags: [Razorpay Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in INR (Rupees)
 *                 example: 500
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "order_DBJOWzybf0sJbb"
 *                     amount:
 *                       type: number
 *                       example: 50000
 *                     currency:
 *                       type: string
 *                       example: "INR"
 *                     receipt:
 *                       type: string
 *                       example: "receipt_1716182049000"
 *       400:
 *         description: Invalid or missing amount
 *       500:
 *         description: Failed to create Razorpay order
 */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
});

/**
 * @swagger
 * /api/payment/verify-payment:
 *   post:
 *     summary: Verify Razorpay Payment Signature
 *     tags: [Razorpay Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_order_id
 *               - razorpay_payment_id
 *               - razorpay_signature
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *                 example: "order_DBJOWzybf0sJbb"
 *               razorpay_payment_id:
 *                 type: string
 *                 example: "pay_29QQoUBcxNqdf0"
 *               razorpay_signature:
 *                 type: string
 *                 example: "9ef4b489d81d45c50c05df1c2d0f0d2c67..."
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Invalid payment signature
 *       500:
 *         description: Payment verification failed
 */
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
});

export default router;