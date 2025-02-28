import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      role: string;
      accessToken: string;
      email: string;
    } & DefaultSession["user"];
  }

  interface Token {
    user?: Session["user"];
  }
}
