"use client";

import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "apps/user-ui/src/shared/utils/base-url";
import axios, { AxiosError } from "axios";
import { CircleX, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface FormData {
  email?: string;
  password?: string;
}

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
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

  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axios.post(
        `${BASE_URL}/api/forgot-password-user`,
        { email }
      );

      return response.data;
    },

    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setServerError(null);
      setCanResend(false);
      startResendTimer();
    },

    onError: (error: AxiosError) => {
      const errorMsg =
        (error.response?.data as { message?: string })?.message ||
        "Invalid OTP. Try again!";
      setServerError(errorMsg);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const response = await axios.post(
        `${BASE_URL}/api/verify-password-user`,
        {
          email: userEmail,
          otp: otp.join(""),
        }
      );

      return response.data;
    },

    onSuccess: () => {
      setStep("reset");
      setServerError(null);
    },

    onError: (error: AxiosError) => {
      const errorMsg =
        (error.response?.data as { message?: string })?.message ||
        "Invalid OTP. Try again!";
      setServerError(errorMsg);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password) return;
      const response = await axios.post(`${BASE_URL}/api/reset-password-user`, {
        email: userEmail,
        newPassword: password,
      });

      return response.data;
    },

    onSuccess: () => {
      setStep("email");
      toast.success(
        "Password reset successfully! Please login with your new password."
      );
      setServerError(null);
      router.push("/login");
    },

    onError: (error: AxiosError) => {
      const errorMsg = (error.response?.data as { message?: string })?.message;
      setServerError(errorMsg || "Failed to reset password. Try again!");
    },
  });

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

  const onSubmitEmail = (data: FormData) => {
    if (!data.email) return;
    requestOtpMutation.mutate({ email: data.email });
  };

  const onSubmitPassword = (data: FormData) => {
    if (!data.password) return;
    resetPasswordMutation.mutate({ password: data.password });
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-gray-100 justify-center items-center flex">
      <div className="w-full mx-auto bg-white rounded-lg  p-6 max-w-sm border border-stone-300">
        {step === "email" && (
          <div className="text-center">
            <h3 className="text-xl font-bold text-stone-800 mb-2 text-center font-poppins">
              Forgot Password
            </h3>
            <p className="text-stone-600 text-sm mb-4 text-center">
              Go back to {""}
              <Link href="/login" className="text-blue-500">
                Login
              </Link>
            </p>

            <form
              onSubmit={handleSubmit(onSubmitEmail)}
              className="flex flex-col gap-3"
            >
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

              <div className="flex flex-col gap-2 mt-3">
                <button
                  type="submit"
                  className="w-full px-4 py-3 inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm  shadow-sm hover:shadow-md bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-stone-600 hover:to-stone-600 hover:border-stone-700 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_#00000059] after:pointer-events-none transition antialiased cursor-pointer"
                  disabled={requestOtpMutation.isPending}
                >
                  {requestOtpMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <LoaderCircle size={18} className="animate-spin" />
                      Sending OTP...
                    </span>
                  ) : (
                    "Submit"
                  )}
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
          </div>
        )}

        {step === "otp" && (
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
                disabled={verifyOtpMutation.isPending}
              >
                {verifyOtpMutation.isPending ? (
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
                    onClick={() => {
                      requestOtpMutation.mutate({ email: userEmail! });
                    }}
                    className="text-black cursor-pointer font-semibold"
                  >
                    Resend OTP
                  </button>
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </p>

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
          </div>
        )}

        {step === "reset" && (
          <>
            <div className="text-center">
              <h3 className="text-xl font-bold text-stone-800 mb-2 text-center font-poppins">
                Reset Password
              </h3>

              <form
                onSubmit={handleSubmit(onSubmitPassword)}
                className="flex flex-col gap-3"
              >
                <div>
                  {" "}
                  <label className="block text-gray-700 mb-1 text-start font-semibold">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new passowrd"
                    className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-3  px-4 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
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
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <LoaderCircle size={18} className="animate-spin" />
                        Resetting...
                      </span>
                    ) : (
                      "Reset Password"
                    )}
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
