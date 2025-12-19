"use client";

import { navItems } from "apps/user-ui/src/configs/constants";
import { NavItemsTypes } from "apps/user-ui/src/configs/global";
import useUser from "apps/user-ui/src/hooks/useUser";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HeaderBottom() {
  const { user, isLoading } = useUser();
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
        setOpenSubMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={` transition-all duration-300 px-40 w-full  ${
        isSticky
          ? "fixed top-0 left-0 z-100 bg-white border-b! border-gray-300!"
          : "relative"
      }`}
    >
      <div
        className={`w-[100%] relative flex items-center justify-between  ${
          isSticky ? "pt-3" : "py-0"
        }`}
      >
        {/* DropDown */}
        <div className="relative " ref={menuRef}>
          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            className="cursor-pointer inline-flex items-center justify-center text-sm py-2 px-4 
              bg-stone-800 text-stone-50 hover:bg-stone-700 transition"
          >
            All Departments
            <ChevronDown />
          </button>

          {openMenu && (
            <div className="absolute mt-2 left-0 bg-white border border-stone-200 rounded-lg  p-1 z-50 w-48 transition-all duration-300">
              <Link
                href="#"
                className="block px-4 py-2 text-sm hover:bg-stone-100 rounded-md cursor-pointer"
              >
                Dep One
              </Link>

              <Link
                href="#"
                className="block px-4 py-2 text-sm hover:bg-stone-100 rounded-md cursor-pointer"
              >
                Dep Two
              </Link>

              {/* Submenu */}
              <div className="relative">
                <div
                  onClick={() => setOpenSubMenu((prev) => !prev)}
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-stone-100 rounded-md cursor-pointer"
                >
                  Sub Dep
                  <ChevronRight />
                </div>

                {openSubMenu && (
                  <div className="absolute top-0 left-full ml-1 bg-white border border-stone-200 rounded-lg shadow-md p-1 w-48">
                    <Link
                      href="#"
                      className="block px-4 py-2 text-sm hover:bg-stone-100 rounded-md cursor-pointer"
                    >
                      Sub Dep One
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={`flex items-center  justify-end`}>
          {navItems.map((i: NavItemsTypes, index: number) => (
            <Link
              href={i.href}
              key={index}
              className="px-5 font-medium text-lg"
            >
              {i.title}
            </Link>
          ))}
        </div>

        <div>
          {isSticky && (
            <div className="flex items-center gap-6 py-3">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  {!isLoading && user ? (
                    <>
                      <Link
                        href="/profile"
                        className="border-2! w-[45px] h-[45px] flex items-center justify-center rounded-full border-gray-400!"
                      >
                        <UserRound size={25} className="text-gray-600" />
                      </Link>
                      <Link href="/login">
                        <span className="block font-medium">Hello,</span>
                        <span className=" font-semibold">
                          {user?.name?.split(" ")[0]}
                        </span>
                      </Link>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link
                        href="/login"
                        className="border-2! w-[45px] h-[45px] flex items-center justify-center rounded-full border-gray-400!"
                      >
                        <UserRound size={25} className="text-gray-600" />
                      </Link>
                      <Link href="/login">
                        <span className="block font-medium">Hello,</span>
                        <span className=" font-semibold">
                          {isLoading ? (
                            <span className="animate-pulse">...</span>
                          ) : (
                            "Sign In"
                          )}
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
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
          )}
        </div>
      </div>
    </div>
  );
}
