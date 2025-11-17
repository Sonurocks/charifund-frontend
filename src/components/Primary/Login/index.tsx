"use client";

import Image from "next/image";
import { logo } from "@/public/assets";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 flex-grow">
        {/* Left Side */}
        <div className="hidden md:flex flex-col items-center justify-center bg-primaryColor text-black p-10">
          <Image src={logo.src} alt="logo" width={280} height={120} className="mb-6 object-contain md:w-96 md:h-40 lg:w-[420px] lg:h-48 -ml-16" />
          <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
          <p className="mt-4 text-center text-black/80 max-w-md">
            Sign in to continue managing your funds and stay connected with the Charifund community.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center justify-baseline md:justify-center bg-primaryColor/70 md:bg-white px-6 py-8 lg:px-12">
           <div className="flex flex-col items-center justify-center md:hidden  p-10">
          <Image src={logo.src} alt="logo" width={220} height={80} className="mb-6 object-contain md:w-96 md:h-40 lg:w-[420px] lg:h-48 -ml-16" />
        </div>
          <div className="w-full bg-white rounded-lg shadow border border-gray-200 sm:max-w-md p-6 md:p-8">
            <h1 className="text-2xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-3xl mb-6">
              Sign In
            </h1>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
