import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import {
  checkOtpRestriction,
  handleForgotPassword,
  sendOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyForgotPasswordOtp,
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
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    return next(error);
  }
};

// Refresh token user
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refershToken = req.cookies.refershToken;

    if (!refreshToken) {
      return ValidationError("Unauthorized! No refresh token.");
    }

    const decoded = jwt.verify(
      refershToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; role: string };

    if (!decoded || !decoded.id || !decoded.role) {
      throw new JsonWebTokenError("Forbidden! Invalid refresh token.");
    }

    const user = await prisma.users.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return AuthError("Forbidden! User/Seller not found");
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    setCookie(res, "accessToken", newAccessToken);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token." });
  }
};

// Get logged in user
export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// user forgot password
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await handleForgotPassword(req, res, next, "user");
};

// Verify forhot password OTP
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await verifyForgotPasswordOtp(req, res, next);
};

// Reset user password
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword)
      return next(ValidationError("Email and new passowrd are required!"));

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return next(ValidationError("User not found!"));

    // compare new passowrd with the existing one
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);

    if (isSamePassword) {
      return next(
        ValidationError("New Passwor can't be the same as the old password")
      );
    }

    // hash the new passowrd
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

//------- Seller -------//

//Register new seller
export const registerSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "seller");

    const { name, email } = req.body;

    const existingUser = prisma.sellers.findUnique({
      where: { email },
    });

    if (await existingUser) {
      throw ValidationError("Seller already existing with this email");
    }

    await checkOtpRestriction(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(name, email, "seller-activation");

    res
      .status(200)
      .json({ message: "OTP sent to email. Please verify your account" });
  } catch (error) {}
};

// Verify seller with otp
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name, phone_number, country } = req.body;
    if (!name || !otp || !password || !name || !phone_number || !country) {
      return next(ValidationError("All fields are required!"));
    }

    const existingUser = await prisma.sellers.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(ValidationError("Seller already exists with this email!"));
    }

    await verifyOtp(email, otp, next);
    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await prisma.sellers.create({
      data: { name, email, password: hashedPassword, country, phone_number },
    });

    res.status(201).json({
      succes: true,
      message: "Seller registerd successfully!",
    });
  } catch (error) {}
};

//create a new shop
export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "seller");

    const { name, bio, address, opening_hours, website, category, sellerId } =
      req.body;

    if (!name || !bio || !address || !opening_hours || !category || !sellerId) {
      return next(ValidationError("All fields are required!"));
    }

    const shopData: any = {
      name,
      bio,
      address,
      opening_hours,
      category,
      sellerId,
    };

    if (website && website.trim() !== "") {
      shopData.website = website;
    }

    const shop = await prisma.shops.create({
      data: shopData,
    });

    res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {}
};

// create stripe connect account link
