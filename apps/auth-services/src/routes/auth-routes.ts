import express, { Router } from "express";
import {
  createShop,
  getUser,
  loginUser,
  refreshToken,
  registerSeller,
  resetUserPassword,
  userForgotPassword,
  userRegistration,
  verifySeller,
  verifyUser,
} from "../controller/auth-controller";
import { verifyForgotPasswordOtp } from "../utils/auth-helper";
import isAuthenticated from "@packages/middleware/isAuthenticated";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshToken);
router.get("/logged-in-user", isAuthenticated, getUser);
router.post("/forgot-password-user", userForgotPassword);
router.post("/reset-password-user", resetUserPassword);
router.post("/verify-password-user", verifyForgotPasswordOtp);

router.post("/seller-registration", registerSeller);
router.post("/verify-seller", verifySeller);
router.post("/create-shop", createShop);

export default router;
