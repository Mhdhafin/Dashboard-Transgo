"use client";
import { useSession } from "next-auth/react";
import React from "react";

const Welcome = () => {
  const { data: session } = useSession();
  return (
    <h2 className="text-3xl font-bold tracking-tight">
      Hi, Welcome back {session?.user?.name} 👋
    </h2>
  );
};

export default Welcome;
