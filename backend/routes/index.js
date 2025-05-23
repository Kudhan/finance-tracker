import express from "express";
import authRoutes from "./authRoutes.js"; // ✅ Fixed extension
import userRoutes from "./userRoutes.js"; // ✅ Fixed extension
// Uncomment these when ready to use:
// import userRoutes from "./userRoutes.js";
// import transactionRoutes from "./transactionRoutes.js";
// import accountRoutes from "./accountRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
// router.use("/account", accountRoutes);
// router.use("/transaction", transactionRoutes);

export default router;
