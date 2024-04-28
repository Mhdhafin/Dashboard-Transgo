import { Metadata } from "next";
import UserAuthForm from "@/components/forms/user-auth-form";

export const metadata: Metadata = {
  title: "Login | Trango",
  description: "Please Login before access the dashboard",
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center">
      <div className="p-4 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Login
            </h1>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
