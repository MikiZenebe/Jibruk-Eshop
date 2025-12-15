"use client";

import { navItems } from "apps/user-ui/src/configs/constants";
import { NavItemsTypes } from "apps/user-ui/src/configs/global";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function HeaderBottom() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.screenY > 100) {
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
        isSticky ? "fixed top left-0 z-100 bg-white shadow-lg" : "relative"
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
        <div className="flex items-center justify-end">
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
      </div>
    </div>
  );
}
