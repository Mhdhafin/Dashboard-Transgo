"use client";
import React, { useState } from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";

export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const initialUser = session?.user || null;

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <UserProvider initialUser={initialUser}>{children}</UserProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
