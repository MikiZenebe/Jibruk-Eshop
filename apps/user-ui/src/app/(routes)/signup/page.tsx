"use client";

import GoogleButton from "apps/user-ui/src/shared/components/google-button";
import { CircleX, Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showOtp, setShowOtp] = useState(true);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {};

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

  const resendOtp = () => {};

  return (
    <div className="w-full py-10 min-h-[85vh] bg-gray-100">
      <div className="w-full mx-auto bg-white rounded-lg  p-6 max-w-sm border border-stone-300">
        <div className=" text-center">
          <div className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm min-w-[48px] min-h-[48px] shadow-sm hover:shadow-md bg-emerald-600 hover:bg-emerald-700 relative bg-gradient-to-b from-emerald-500 to-teal-600 border-stone-50 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-emerald-700 hover:to-emerald-700 hover:border-emerald-800 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition antialiased p-3 mb-4">
            <LogIn />
          </div>
          <h3 className="text-xl font-bold text-stone-800 mb-2 text-center font-poppins">
            Signup To Jibruk E-Shop
          </h3>
          <p className="text-stone-600 text-sm mb-4 text-center">
            Already have an account? {""}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>

          <GoogleButton />

          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t! border-gray-300!" />
            <span className="px-3">or Sign in with Email</span>
            <div className="flex-1 border-t! border-gray-300!" />
          </div>

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
                    {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
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
                >
                  Signup
                </button>

                {serverError && (
                  <div
                    role="alert"
                    className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
                  >
                    <CircleX />
                    <div className="w-full text-sm font-sans leading-none m-1.5">
                      {serverError}
                    </div>
                  </div>
                )}
              </div>
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
                >
                  Verify OTP
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
