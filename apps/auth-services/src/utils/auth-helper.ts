import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import redis from "../../../../packages/libs/redis";
import { sendEmail } from "./sendMail";
import { NextFunction } from "express";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw ValidationError(`Missing required fields!`);
  }

  if (!emailRegex.test(email)) {
    throw ValidationError(`Invalid email format!`);
  }
};

export const checkOtpRestriction = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      ValidationError(
        "Account locked due to multiple failed attempts! try again for 30 minutes"
      )
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      ValidationError(
        "Too many OTP requests! Please wait 1 hour before requesting again."
      )
    );
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      ValidationError("Please wait 1 minute before requesting a new OTP!")
    );
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequest = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequest >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600); //1 hour lock
    return next(
      ValidationError(
        "Too many OTP requests! Please wait 1 hour before requesting again."
      )
    );
  }

  await redis.set(otpRequestKey, otpRequest + 1, "EX", 3600); // Reset count after 1 hour
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify Your Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300); //OTP valid for 5 minutes
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60); // OTP resend cooldown of 1 minutes
};
