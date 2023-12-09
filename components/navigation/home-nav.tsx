"use client"
import React, { useEffect, useState } from 'react'
import Logo from '../Logo';
import { getSession } from "@/lib/auth";
import { useRouter } from 'next/router';

const HomeNav = async () => {
    const [open, setOpen] = useState(false);
    const session = await getSession();
    const router = useRouter();
    return (
        <header className={`flex w-screen items-center bg-white dark:bg-dark`}>
            <div className="w-full px-10">
                <div className="relative -mx-4 flex items-center justify-between">
                    <div className="w-60 max-w-full px-4">
                        <a href="/#" className="block w-full py-5">
                            <Logo />
                        </a>
                    </div>
                    <div className="flex w-screen items-center justify-between px-4">
                        <div>
                            <button
                                onClick={() => setOpen(!open)}
                                id="navbarToggler"
                                className={` ${open && "navbarTogglerActive"
                                    } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
                            >
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-black dark:bg-white"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-black dark:bg-white"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-black dark:bg-white"></span>
                            </button>
                            <nav
                                // :className="!navbarOpen && 'hidden' "
                                id="navbarCollapse"
                                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:dark:bg-transparent ${!open && "hidden"
                                    } `}
                            >
                                <ul className="block lg:flex">
                                    <ListItem NavLink="/#">Home</ListItem>
                                    <ListItem NavLink="/#">Features</ListItem>
                                    <ListItem NavLink="/about-us">About</ListItem>
                                    <ListItem NavLink="/contact-us">Contact Us</ListItem>
                                    <ListItem NavLink="/#">Blog</ListItem>
                                </ul>
                            </nav>
                        </div>
                        <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
                            {session ? (
                                <a
                                    href="/dashboard"
                                    className="rounded-md bg-primary px-7 py-3 text-base font-medium text-dark hover:bg-sky-300"
                                >
                                    Dashboard
                                </a>
                            ) : (
                                <>
                                    <a
                                        href="/#"
                                        onClick={handleSignIn}
                                        className="rounded-md bg-primary px-7 py-3 text-base font-medium text-dark hover:bg-sky-300"
                                    >
                                        Sign in
                                    </a>
                                    <a
                                        href="/#"
                                        onClick={handleSignUp}
                                        className="rounded-md bg-primary px-7 py-3 text-base font-medium text-dark hover:bg-sky-300"
                                    >
                                        Sign Up
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

interface ListItemProps {
    children: string;
    NavLink: string
}
const ListItem: React.FC<ListItemProps> = ({ children, NavLink }) => {
    return (
        <>
            <li>
                <a
                    href={NavLink}
                    className="flex text-base font-medium text-body-color hover:text-dark dark:text-dark-6 dark:hover:text-white lg:ml-12 lg:inline-flex"
                >
                    {children}
                </a>
            </li>
        </>
    );
};

export default HomeNav