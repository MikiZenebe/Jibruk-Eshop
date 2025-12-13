import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  checkOtpRestriction,
  sendOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyOtp,
} from "../utils/auth-helper";
import prisma from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler";
import { setCookie } from "../utils/cookies/setCookies";

// Register new user
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");
    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(ValidationError("User already exists with this email"));
    }

    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, "user-activation-mail");

    res.status(200).json({
      message: "OTP sent to your email for verfication",
    });
  } catch (error) {
    return next(error);
  }
};

// Verify user with otp
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name } = req.body;
    if (!name || !otp || !password || !name) {
      return next(ValidationError("All fields are required!"));
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(ValidationError("User already exists with this email!"));
    }

    await verifyOtp(email, otp, next);
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
      succes: true,
      message: "User registerd successfully!",
    });
  } catch (error) {}
};

// Login to user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(ValidationError("Email and Password are required"));
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) return next(AuthError("User dosen't exists!"));

    // verify password
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return next(ValidationError("Invalid email or passowrd"));
    }

    // Generate access and refersh token
    const accessToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );
    const refershToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // store the refresh and access token in an httpOnly secure token
    setCookie(res, "refershToken", refershToken);
    setCookie(res, "accessToken", accessToken);

    res.status(200).json({
      message: "Login successfull",
      user: { i: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    return next(error);
  }
};
