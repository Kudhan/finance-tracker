import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUser, changePassword, updateUser } from "../controllers/userController.js";

const router = express.Router();

// GET  /api/user         -> getUser
router.get("/", authMiddleware, getUser);

// POST /api/user/change-password  -> changePassword (matches frontend's POST)
router.post("/change-password", authMiddleware, changePassword);

// PUT  /api/user         -> updateUser
router.put("/", authMiddleware, updateUser);

export default router;
