"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUserCircle, FaAngleDown, FaBars, FaTimes } from "react-icons/fa";
import Logo from "../Logo";
import { useSession } from "next-auth/react";

type NavOption = {
  name: string;
  url?: string;
  subOptions?: { name: string; url: string }[];
};

const navOptions: NavOption[] = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Features",
    subOptions: [
      { name: "Channel Manager", url: "/channels" },
      { name: "Payment Options", url: "/payments" },
      { name: "Booking System", url: "/booking" },
    ],
  },
  {
    name: "Pricing",
    url: "/pricing",
  },
  {
    name: "Blogs",
    url: "/blogs"
  },
];

const Navbar = () => {
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    // Disable scrolling when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-white h-20 text-lg text-black flex items-center px-4 shadow-xl justify-between">
      <div className="flex items-center justify-between w-full md:justify-center">
        <div className="flex items-center">
          <Link className="p-5" href="/">
            <Logo />
          </Link>
        </div>
        <div className="flex items-center">
          <ul className="hidden md:flex items-center space-x-4">
            {navOptions.map((option) => (
              <li
                key={option.name}
                className="relative"
                onMouseEnter={() => setActiveOption(option.name)}
                onMouseLeave={() => setActiveOption(null)}
              >
                {option.subOptions ? (
                  <span
                    className={`px-4 py-2 text-black flex items-center cursor-pointer`}
                  >
                    {option.name} {<FaAngleDown size={12} />}
                  </span>
                ) : (
                  <Link
                    href={option.url || "#"}
                    className={`px-4 py-2 ${activeOption === option.name ? "underline" : ""
                      } hover:underline text-black flex items-center`}
                  >
                    {option.name}
                  </Link>
                )}
                {option.subOptions && activeOption === option.name && (
                  <ul className="absolute z-50 left-0 bg-white border border-gray-300 shadow-xl text-black py-2 transition-opacity duration-200 ease-in-out opacity-100 w-48">
                    {option.subOptions.map((subOption) => (
                      <li
                        key={subOption.name}
                        className="px-4 py-2 transition-all duration-300 ease-in-out transform hover:bg-sitecolor"
                      >
                        <Link
                          href={subOption.url}
                          className={`block hover:underline text-black`}
                        >
                          {subOption.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            {/* {session ? (
              <button
                className=" hover:bg-gray-200 text-black font-bold w-28 rounded-xl h-12 text-lg hover:border-2 focus:outline-none transition-all ease-in-out duration-150"
                onClick={() => router.push('https://app.forhosts.com')}
              >
                Dashboard
              </button>
            ) : (
              <button
                className=" hover:bg-gray-200 text-black font-bold w-28 rounded-xl h-12 text-lg hover:border-2 focus:outline-none transition-all ease-in-out duration-150"
                onClick={() => router.push('https://app.forhosts.com/login')}
              >
                <span className="text-black"> Login</span>
              </button>
            )} */}
          </ul>

          <div className="md:hidden">
            <button
              className="p-2 text-black"
              onClick={handleMobileMenuToggle}
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>
      {/* Render mobile menu */}
      <div className={`fixed inset-0 flex flex-col justify-center items-center bg-white z-50 transition-opacity duration-300 ease-in-out transform ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <button
          className="absolute top-0 right-0 m-4 p-2 text-black"
          onClick={closeMobileMenu}
        >
          <FaTimes size={24} />
        </button>
        <ul className="space-y-8">
          {navOptions.map((option) => (
            <li key={option.name} onClick={closeMobileMenu}>
              <Link
                href={option.url || "/"}
                className={`block text-2xl font-bold text-black`}
              >
                {option.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
