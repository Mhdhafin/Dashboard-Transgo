import { Metadata } from "next";
import UserAuthForm from "@/components/forms/user-auth-form";
import Logo from "@/components/Logo";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login | Transgo",
  description: "Please Login before access the dashboard",
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center">
      <div className="p-4 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[350px]">
          <div className=" border-white">
            <Logo className="fill-main dark:fill-main w-full h-[120px] " />
          </div>
          <div className="flex flex-col text-center">
            <h1 className="text-2xl md:text-2xl font-semibold tracking-tight">
              Selamat datang! <br />
              Silahkan Log in ke Dashboard
            </h1>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
