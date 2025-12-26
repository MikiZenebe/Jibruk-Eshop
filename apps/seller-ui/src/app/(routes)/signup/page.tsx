"use client";

import { useMutation } from "@tanstack/react-query";
import { CirclePlus, CircleX, Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "apps/user-ui/src/shared/utils/base-url";
import { countries } from "apps/seller-ui/src/utils/countires";
import CreateShop from "apps/seller-ui/src/shared/modules/auth/create-shop";
import StripeLogo from "../../../assets/stripe.svg";
import Image from "next/image";

interface FormData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  country: string;
}

export default function Signup() {
  const [activeStep, setActiveStep] = useState(3);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [sellerData, setSellerData] = useState<FormData | null>(null);
  const [sellerId, setSellerId] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${BASE_URL}/api/seller-registration`,
        data
      );

      return response.data;
    },

    onSuccess: (_, formData) => {
      setSellerData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!sellerData) return;
      const response = await axios.post(`${BASE_URL}/api/verify-seller`, {
        ...sellerData,
        otp: otp.join(""),
      });

      return response.data;
    },

    onSuccess: (data) => {
      setSellerId(data?.seller?.id ?? "");
      setActiveStep(2);
    },
  });

  const { isPending } = signupMutation;
  const {
    isPending: isVerifyOtpPending,
    isError: isVerifyOtpIsError,
    error: isVerifyOtpError,
  } = verifyOtpMutation;

  const onSubmit = (data: FormData) => {
    signupMutation.mutate(data);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const resendOtp = () => {
    if (sellerData) {
      signupMutation.mutate(sellerData);
    }
  };

  const connectStripe = () => {};

  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      <div className="relative w-full flex items-center justify-between md:w-[50%] my-10">
        <div className="absolute top-[25%] left-0 w-full md:-[90%] h-0.5 bg-gray-300 -z-10 flex justify-between items-center">
          {[
            { step: 1, label: "Create Account", icon: <CirclePlus /> },
            { step: 2, label: "Setup Shop" },
            { step: 3, label: "Connect Bank" },
          ].map((item) => (
            <div>
              {" "}
              <div key={item.step}>
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold  text-white mt-5 ${
                    item.step <= activeStep ? "bg-black" : "bg-gray-300 "
                  }`}
                >
                  {item.step}
                </div>

                {/* Step Label */}
              </div>
              <span className="ml-[-15px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="md:w-[480px] p-8 bg-white border! border-gray-200 rounded-lg mt-24">
        {activeStep === 1 && (
          <>
            <div className=" text-center">
              <h3 className="text-xl font-bold text-stone-800 mb-2 text-center font-poppins">
                Create Account
              </h3>

              {!showOtp ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-3"
                >
                  <div>
                    {" "}
                    <label className="block text-gray-700 mb-1 text-start font-semibold">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="mikiyas"
                      className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-3  px-4 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed"
                      {...register("name", {
                        required: "Name is required",
                      })}
                    />
                    {errors.name && (
                      <div
                        role="alert"
                        className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
                      >
                        <CircleX />
                        <div className="w-full text-sm font-sans leading-none m-1.5">
                          {String(errors.name.message)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {" "}
                    <label className="block text-gray-700 mb-1 text-start font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="support@jibruk.com"
                      className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-3  px-4 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <div
                        role="alert"
                        className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
                      >
                        <CircleX />
                        <div className="w-full text-sm font-sans leading-none m-1.5">
                          {String(errors.email.message)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {" "}
                    <label className="block text-gray-700 mb-1 text-start font-semibold">
                      Phone No
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="+251900000000"
                        className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-3  px-4 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed"
                        {...register("phone_number", {
                          required: "Phone Number is required",
                          pattern: {
                            value: /^\+?[1-9]\d{1,14}$/,
                            message: "Invalid phone number format",
                          },
                          minLength: {
                            value: 10,
                            message: "Phone number can't be exceed 15 digits",
                          },
                        })}
                      />
                    </div>
                    {errors.phone_number && (
                      <div
                        role="alert"
                        className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
                      >
                        <CircleX />
                        <div className="w-full text-sm font-sans leading-none m-1.5">
                          {String(errors.phone_number.message)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {" "}
                    <label className="block text-gray-700 mb-1 text-start font-semibold">
                      Country
                    </label>
                    <div>
                      <select
                        className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-3  px-4 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed cursor-pointer"
                        {...register("country", {
                          required: "Country is required",
                        })}
                      >
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.country && (
                      <div
                        role="alert"
                        className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
                      >
                        <CircleX />
                        <div className="w-full text-sm font-sans leading-none m-1.5">
                          {String(errors.country.message)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {" "}
                    <label className="block text-gray-700 mb-1 text-start font-semibold">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-3  px-4 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />

                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <div
                        role="alert"
                        className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
                      >
                        <CircleX />
                        <div className="w-full text-sm font-sans leading-none m-1.5">
                          {String(errors.password.message)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mt-3">
                    <button
                      type="submit"
                      className="w-full px-4 py-3 inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm  shadow-sm hover:shadow-md bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-stone-600 hover:to-stone-600 hover:border-stone-700 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_#00000059] after:pointer-events-none transition antialiased cursor-pointer"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <span className="flex items-center gap-2">
                          <LoaderCircle size={18} className="animate-spin" />
                          Signing up...
                        </span>
                      ) : (
                        "Signup"
                      )}
                    </button>

                    {signupMutation.isError &&
                      signupMutation.error instanceof AxiosError && (
                        <div
                          role="alert"
                          className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
                        >
                          <CircleX />
                          <div className="w-full text-sm font-sans leading-none m-1.5">
                            {signupMutation.error.response?.data?.message ||
                              signupMutation?.error.message}
                          </div>
                        </div>
                      )}
                  </div>

                  <p className="text-stone-600 text-sm font-semibold text-center">
                    Already have an account? {""}
                    <Link href="/login" className="text-blue-500">
                      Login
                    </Link>
                  </p>
                </form>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-center mb-4 font-poppins">
                    Enter OTP
                  </h3>

                  <div className="flex justify-center gap-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        ref={(el) => {
                          if (el) inputRefs.current[index] = el;
                        }}
                        maxLength={1}
                        className="w-12 h-12 text-center border! border-gray-300! outline-none rounded! font-semibold text-lg"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      type="submit"
                      className="w-full px-4 py-3 inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm  shadow-sm hover:shadow-md bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-stone-600 hover:to-stone-600 hover:border-stone-700 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_#00000059] after:pointer-events-none transition antialiased cursor-pointer"
                      onClick={() => verifyOtpMutation.mutate()}
                      disabled={isVerifyOtpPending}
                    >
                      {isVerifyOtpPending ? (
                        <span className="flex items-center gap-2">
                          <LoaderCircle size={18} className="animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>

                    <p className="text-center text-sm mt-2">
                      {canResend ? (
                        <button
                          onClick={resendOtp}
                          className="text-black cursor-pointer font-semibold"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        `Resend OTP in ${timer}s`
                      )}
                    </p>
                    {isVerifyOtpIsError &&
                      isVerifyOtpError instanceof AxiosError && (
                        <div
                          role="alert"
                          className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
                        >
                          <CircleX />
                          <div className="w-full text-sm font-sans leading-none m-1.5">
                            {isVerifyOtpError.response?.data?.message ||
                              isVerifyOtpError?.message}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeStep === 2 && (
          <CreateShop sellerId={sellerId} setActiveStep={setActiveStep} />
        )}

        {activeStep === 3 && (
          <div className="text-center">
            <h3 className="text-2xl font-semibold">Withdraw Method</h3>
            <br />
            <button
              type="submit"
              className="w-full px-4 py-3 inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm  shadow-sm hover:shadow-md bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-stone-600 hover:to-stone-600 hover:border-stone-700 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_#00000059] after:pointer-events-none transition antialiased cursor-pointer gap-2"
              onClick={connectStripe}
            >
              <span className="text-md">Connect Stripe</span>
              <Image src={StripeLogo} width={20} height={20} alt="" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
