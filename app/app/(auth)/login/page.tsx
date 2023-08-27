import Image from "next/image";
import LoginButton from "./login-button";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    // <div className="mx-5 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">

    //   <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
    //     <Suspense
    //       fallback={
    //         <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
    //       }
    //     >
    //       <LoginButton />
    //     </Suspense>
    //   </div>
    // </div>
    <Suspense>
    <section >
      <div className="mx-auto w-full px-4 pt-6 lg:w-4/12">
        <div className="bg-gray-100 relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
          <div className="mb-0 rounded-t px-6 py-6">
            <div className="mb-3 text-center">
              <h6 className="text-black text-sm font-bold">
                Sign in with
              </h6>
            </div>
<LoginButton />
            <hr className="border-b-1 border-blueGray-300 mt-6" />
          </div>
          <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
            <div className="text-blueGray-400 mb-3 text-center font-bold">
              <small>Or sign in with credentials</small>
            </div>
            <form>
              <div className="relative mb-3 w-full">
                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase">
                  Email
                </label>
                <input
                  type="email"
                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                  placeholder="Email"
                />
              </div>
              <div className="relative mb-3 w-full">
                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase">
                  Password
                </label>
                <input
                  type="password"
                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                  placeholder="Password"
                />
              </div>
              <div>
                <label className="inline-flex cursor-pointer items-center">
                  <input
                    id="customCheckLogin"
                    type="checkbox"
                    className="text-blueGray-700 form-checkbox ml-1 h-5 w-5 rounded border-0 transition-all duration-150 ease-linear"
                  />
                  <span className="text-blueGray-600 ml-2 text-sm font-semibold">
                    Remember me
                  </span>
                </label>
              </div>
              <div className="mt-6 text-center">
                <button
                  className="bg-sitecolor active:bg-blueGray-600 mb-1 mr-1 w-full rounded px-6 py-3 text-sm font-bold uppercase text-black shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none"
                  type="button"
                >
                  {" "}
                  Sign In{" "}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      </section>
      </Suspense>
  );
}
