import Link from "next/link";
import React from "react";
import { Heart, Search, ShoppingCart, UserRound } from "lucide-react";

export default function Header() {
  return (
    <div>
      <nav className="rounded-lg overflow-hidden p-5 bg-white  mx-auto w-full max-w-screen-xl">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-poppins antialiased text-lg text-current ml-2 mr-2 block py-1 font-semibold"
          >
            Jibruk E-Shop
          </Link>

          <div className="mx-auto w-96">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search For Products..."
                className="w-full text-sm text-black placeholder:text-stone-600/60 bg-white rounded-lg py-2 pl-8 pr-3 outline-1 outline-gray-300 transition-all duration-200 ease-out focus-visible:border-stone-400 focus-visible:ring-2 focus-visible:ring-stone-400/20 focus-visible:shadow-sm hover:border-stone-300 disabled:opacity-50 disabled:pointer-events-none aria-disabled:cursor-not-allowed"
              />
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-stone-600/70    transition-all duration-300 ease-in overflow-hidden w-4 h-4">
                <Search size={18} />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="border-2! w-[45px] h-[45px] flex items-center justify-center rounded-full border-gray-400!"
              >
                <UserRound size={25} className="text-gray-600" />
              </Link>
            </div>

            <Link href="/login">
              <span className="block font-medium">Hello,</span>
              <span className=" font-semibold">Sign In</span>
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/wishlist" className="relative">
              <Heart size={30} className="text-gray-600" />
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                0
              </div>
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart size={30} className="text-gray-600" />
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                0
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
