import { useMutation } from "@tanstack/react-query";
import { shopCategories } from "apps/seller-ui/src/utils/categories";
import { BASE_URL } from "apps/user-ui/src/shared/utils/base-url";
import axios, { AxiosError } from "axios";
import { CircleX, LoaderCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  bio: string;
  address: string;
  opening_hours: string;
  website: string;
  category: string;
}

export default function CreateShop({
  sellerId,
  setActiveStep,
}: {
  sellerId: string;
  setActiveStep: (step: number) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const shopCreateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${BASE_URL}/api/create-shop`, data);

      return response.data;
    },

    onSuccess: () => {
      setActiveStep(3);
    },
  });

  const { isPending } = shopCreateMutation;

  const onSubmit = (data: FormData) => {
    const shopData = { ...data, sellerId };

    shopCreateMutation.mutate(shopData);
  };

  const countWords = (text: string) => text.trim().split(/\s+/).length;

  return (
    <div>
      <div className=" text-center">
        <h3 className="text-xl font-bold text-stone-800 mb-2 text-center font-poppins">
          Setup New Shop
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            {" "}
            <label className="block text-gray-700 mb-1 text-start font-semibold">
              Name
            </label>
            <input
              type="text"
              placeholder="Shop Name"
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
              Bio (Max 100 words)
            </label>
            <textarea
              cols={10}
              rows={4}
              placeholder="Shop Bio"
              className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-3  px-4 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed"
              {...register("bio", {
                required: "Bio is required",
                validate: (value) =>
                  countWords(value) <= 100 || "Bio can't be exceed 100 words",
              })}
            />
            {errors.bio && (
              <div
                role="alert"
                className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
              >
                <CircleX />
                <div className="w-full text-sm font-sans leading-none m-1.5">
                  {String(errors.bio.message)}
                </div>
              </div>
            )}
          </div>

          <div>
            {" "}
            <label className="block text-gray-700 mb-1 text-start font-semibold">
              Address
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Shop Location"
                className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-3  px-4 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed"
                {...register("address", {
                  required: "Shop Address is required",
                })}
              />
            </div>
            {errors.address && (
              <div
                role="alert"
                className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
              >
                <CircleX />
                <div className="w-full text-sm font-sans leading-none m-1.5">
                  {String(errors.address.message)}
                </div>
              </div>
            )}
          </div>

          <div>
            {" "}
            <label className="block text-gray-700 mb-1 text-start font-semibold">
              Opening Hours
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., Mon-Fri 9AM - 6PM"
                className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-3  px-4 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed"
                {...register("opening_hours", {
                  required: "Opening Hour are required",
                })}
              />
            </div>
            {errors.opening_hours && (
              <div
                role="alert"
                className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
              >
                <CircleX />
                <div className="w-full text-sm font-sans leading-none m-1.5">
                  {String(errors.opening_hours.message)}
                </div>
              </div>
            )}
          </div>

          <div>
            {" "}
            <label className="block text-gray-700 mb-1 text-start font-semibold">
              Website
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://example.com"
                className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-3  px-4 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed"
                {...register("website", {
                  pattern: {
                    value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/,
                    message: "Enter a valid URL",
                  },
                })}
              />
            </div>
            {errors.website && (
              <div
                role="alert"
                className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
              >
                <CircleX />
                <div className="w-full text-sm font-sans leading-none m-1.5">
                  {String(errors.website.message)}
                </div>
              </div>
            )}
          </div>

          <div>
            {" "}
            <label className="block text-gray-700 mb-1 text-start font-semibold">
              Shop Category
            </label>
            <div>
              <select
                className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-3  px-4 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed cursor-pointer"
                {...register("category", {
                  required: "Country is required",
                })}
              >
                <option value="">Select a category</option>
                {shopCategories.map((category) => (
                  <option key={category.value} value={category.label}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <div
                role="alert"
                className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
              >
                <CircleX />
                <div className="w-full text-sm font-sans leading-none m-1.5">
                  {String(errors.category.message)}
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
                  Creating...
                </span>
              ) : (
                "Create"
              )}
            </button>

            {shopCreateMutation.isError &&
              shopCreateMutation.error instanceof AxiosError && (
                <div
                  role="alert"
                  className="my-2 relative flex items-start w-full border p-2 rounded-none border-b-0 border-l-4 border-r-0 border-t-0 border-red-500 bg-red-500/10 font-medium text-red-500"
                >
                  <CircleX />
                  <div className="w-full text-sm font-sans leading-none m-1.5">
                    {shopCreateMutation.error.response?.data?.message ||
                      shopCreateMutation?.error.message}
                  </div>
                </div>
              )}
          </div>
        </form>
      </div>
    </div>
  );
}
