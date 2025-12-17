"use client";

import { useMutation } from "@tanstack/react-query";
import GoogleButton from "apps/user-ui/src/shared/components/google-button";
import { BASE_URL } from "apps/user-ui/src/shared/utils/base-url";
import axios, { AxiosError } from "axios";
import {
  Check,
  CircleCheck,
  CircleX,
  Eye,
  EyeOff,
  LoaderCircle,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${BASE_URL}/api/login-user`, data, {
        withCredentials: true,
      });

      return response.data;
    },

    onSuccess: (data) => {
      setServerError(null);
      router.push("/");
    },
    onError: (error: AxiosError) => {
      const errorMSg =
        (error.response?.data as { message?: string })?.message ||
        "Invalid Credentials!";
      setServerError(errorMSg);
      console.log(errorMSg);
    },
  });

  const { isPending } = loginMutation;

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-gray-100">
      <div className="w-full mx-auto bg-white rounded-lg  p-6 max-w-sm border border-stone-300">
        <div className="text-center">
          <div className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm min-w-[48px] min-h-[48px] shadow-sm hover:shadow-md bg-emerald-600 hover:bg-emerald-700 relative bg-gradient-to-b from-emerald-500 to-teal-600 border-stone-50 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-emerald-700 hover:to-emerald-700 hover:border-emerald-800 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition antialiased p-3 mb-4">
            <LogIn />
          </div>
          <h3 className="text-xl font-bold text-stone-800 mb-2 text-center font-poppins">
            Login To Jibruk E-Shop
          </h3>
          <p className="text-stone-600 text-sm mb-4 text-center">
            Don't have an account? {""}
            <Link href="/signup" className="text-blue-500">
              Sign up
            </Link>
          </p>

          <GoogleButton />

          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t! border-gray-300!" />
            <span className="px-3">or Sign in with Email</span>
            <div className="flex-1 border-t! border-gray-300!" />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
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
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-z0-9.-]+\.[a-zA-Z]{2,4}$/,
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

            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-3">
                {" "}
                <label
                  className="flex items-center cursor-pointer relative"
                  htmlFor="checkbox"
                >
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow-sm hover:shadow border border-stone-200 checked:bg-stone-800 checked:border-stone-800"
                    id="checkbox"
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Check size={15} />
                  </span>
                </label>
                <label
                  className="cursor-pointer text-stone-600 text-sm"
                  htmlFor="checkbox"
                >
                  Remember Me
                </label>
              </div>

              <Link href="/forgot-password" className="text-blue-500 text-sm">
                Forgot Password?
              </Link>
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
                    Logging up...
                  </span>
                ) : (
                  "Login"
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
      </div>
    </div>
  );
}
