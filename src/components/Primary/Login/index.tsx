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
        <div className="flex flex-col items-center bg-primaryColor md:bg-white justify-center px-6 py-8 lg:px-12">
          <div className="w-full bg-white rounded-lg shadow border border-gray-200 sm:max-w-md p-6 md:p-8">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl mb-6">
              Sign In
            </h1>
            <LoginForm />
            {/* <p className="text-sm text-gray-700 mt-4 text-center">
              Don’t have an account yet?{" "}
              <Link href="/register" className="font-medium text-primaryColor hover:underline">
                Sign up
              </Link>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
