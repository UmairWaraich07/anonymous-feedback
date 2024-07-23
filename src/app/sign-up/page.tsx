import SignupForm from "@/components/SignupForm";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#1F2937] flex items-center justify-center  ">
      <div className="max-w-[450px] m-auto bg-white sm:rounded-md p-6 max-sm:p-4 sm:shadow-sm ">
        <div className="w-full flex flex-col items-center justify-center text-center text-black">
          <h1 className="text-5xl font-extrabold">Join Veil Feedback</h1>
          <p className=" mt-3 ">Sign up to start your anonymous adventure</p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
};

export default SignUpPage;
