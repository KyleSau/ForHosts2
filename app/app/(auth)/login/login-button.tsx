"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';

export default function LoginButton() {
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  // Get error message added by next/auth in URL.
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error;
    errorMessage && toast.error(errorMessage);
  }, [error]);

  return (
    <div className="btn-wrapper text-center">
      <button
        className="active:bg-blueGray-50 text-blueGray-700 mb-1 mr-2 inline-flex items-center rounded bg-white px-4 py-2 text-xs font-bold font-normal uppercase shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none"
        type="button"
        onClick={() => {
          setGithubLoading(true);
          signIn("github");
        }}
      >
        <img
          alt="..."
          className="mr-1 w-5"
          src="https://demos.creative-tim.com/notus-js/assets/img/github.svg"
        />
        Github
      </button>
      <button
        className="active:bg-blueGray-50 text-blueGray-700 mb-1 mr-1 inline-flex items-center rounded bg-white px-4 py-2 text-xs font-bold font-normal uppercase shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none"
        type="button"
        onClick={() => {
          setGoogleLoading(true);
          signIn("google");
        }}
      >
        <img
          alt="..."
          className="mr-1 w-5"
          src="https://demos.creative-tim.com/notus-js/assets/img/google.svg"
        />
        Google{" "}
      </button>
    </div>
    // <div>
    //   <button
    //     disabled={githubLoading}
    //     onClick={() => {
    //       setGithubLoading(true);
    //       signIn("github");
    //     }}
    //     className={`${githubLoading
    //       ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
    //       : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
    //       } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    //   >
    //     {githubLoading ? (
    //       <LoadingDots color="#A8A29E" />
    //     ) : (
    //       <>
    //         <svg
    //           className="h-4 w-4 text-black text:black"
    //           aria-hidden="true"
    //           fill="currentColor"
    //           viewBox="0 0 24 24"
    //         >
    //           <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    //         </svg>
    //         <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
    //           Login with GitHub
    //         </p>
    //       </>
    //     )}
    //   </button>
    //   <button
    //     disabled={googleLoading}
    //     onClick={() => {
    //       setGoogleLoading(true);
    //       signIn("google");
    //     }}
    //     className={`${googleLoading
    //       ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
    //       : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
    //       } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    //   >
    //     {googleLoading ? (
    //       <LoadingDots color="#A8A29E" />
    //     ) : (
    //       <>
    //         <GoogleIcon />
    //         <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
    //           Login with Google
    //         </p>
    //       </>
    //     )}
    //   </button>
    //   <button
    //     disabled={facebookLoading}
    //     onClick={() => {
    //       setFacebookLoading(true);
    //       signIn("facebook");
    //     }}
    //     className={`${facebookLoading
    //       ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
    //       : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
    //       } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    //   >
    //     {facebookLoading ? (
    //       <LoadingDots color="#A8A29E" />
    //     ) : (
    //       <>
    //         <FacebookIcon />
    //         <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
    //           Login with Facebook
    //         </p>
    //       </>
    //     )}
    //   </button>
    // </div>
  );
}
