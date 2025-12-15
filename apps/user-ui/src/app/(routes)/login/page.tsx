"use client";

import GoogleButton from "apps/user-ui/src/shared/components/google-button";
import { LogIn } from "lucide-react";
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

  const onSubmit = (data: FormData) => {};

  return (
    <div className="w-full py-10 min-h-[85vh] bg-gray-100">
      <h1 className="text-4xl font-poppins font-semibold text-black text-center">
        Login
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Login
      </p>

      <div className="w-full mx-auto bg-white rounded-lg shadow-md p-6 max-w-sm border border-stone-100">
        <div className="text-center mb-6">
          <div className="inline-grid place-items-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm min-w-[48px] min-h-[48px] shadow-sm hover:shadow-md bg-emerald-600 hover:bg-emerald-700 relative bg-gradient-to-b from-emerald-500 to-teal-600 border-stone-50 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-emerald-700 hover:to-emerald-700 hover:border-emerald-800 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition antialiased p-3 mb-4">
            <LogIn />
          </div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">
            Login To Jibruk E-Shop
          </h3>
          <p className="text-stone-600 text-sm mb-4">
            Don't have an account? {""}
            <Link href="/sign-up" className="text-blue-500">
              Sign up
            </Link>
          </p>

          <GoogleButton />
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between py-2 px-3 bg-stone-50 rounded-lg">
            <span className="text-sm text-stone-600">Accuracy</span>
            <span className="text-sm font-semibold text-emerald-600">
              98.5%
            </span>
          </div>
          <div className="flex items-center justify-between py-2 px-3 bg-stone-50 rounded-lg">
            <span className="text-sm text-stone-600">Processing Speed</span>
            <span className="text-sm font-semibold text-emerald-600">1.2s</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button className="w-full px-4 py-2 inline-flex items-center justify-center border align-middle select-none font-sans font-medium text-center duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm py-2 px-4 shadow-sm hover:shadow-md bg-stone-800 hover:bg-stone-700 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-stone-50 rounded-lg hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgba(255,255,255,0.25),inset_0_-2px_0px_rgba(0,0,0,0.35)] after:pointer-events-none transition antialiased">
            Upload & Analyze
          </button>
        </div>
      </div>
    </div>
  );
}
