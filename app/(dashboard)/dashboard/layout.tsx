import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { authOptions } from "@/lib/auth-options";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Dashboard | Transgo",
  description: "Dashboard page",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role || "admin";

  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar role={role} />
        <main className="w-full pt-16  overflow-y-scroll">{children}</main>
      </div>
    </>
  );
}
