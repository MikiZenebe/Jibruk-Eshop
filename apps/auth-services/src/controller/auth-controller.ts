import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestriction,
  sendOtp,
  trackOtpRequest,
  validateRegistrationData,
} from "../utils/auth-helper";

import { ValidationError } from "../../../../packages/error-handler";
import prisma from "../../../../packages/libs/prisma";

// Register new user
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");
    const { name, email } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(ValidationError("User already exists with this email"));
    }

    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(email, name, "user-activation-mail");

    res.status(200).json({
      message: "OTP sent to your email for verfication",
    });
  } catch (error) {
    return next(error);
  }
};
