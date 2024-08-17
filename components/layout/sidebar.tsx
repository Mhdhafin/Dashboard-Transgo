"use client";
import React, { useState } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { useUser } from "@/context/UserContext";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized } = useSidebar();
  const [status, setStatus] = useState(false);

  const { user } = useUser();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || "admin"),
  );

  return (
    <nav
      className={cn(
        `relative hidden h-screen flex-none border-r z-10 pt-20 md:block`,
        status && "duration-500",
        !isMinimized ? "w-72" : "w-[64px]",
        className,
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={filteredNavItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
