import express from "express";
import {
  getAccount,
  createAccount,
  addMoneyToAccount
} from "../controllers/accountController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAccount);                    // GET /account
router.post("/create", authMiddleware, createAccount);          // POST /account/create
router.put("/addmoney/:id", authMiddleware, addMoneyToAccount); // PUT /account/addmoney/:id

export default router;
