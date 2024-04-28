import { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (typeof credentials !== "undefined") {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_HOST}/auth/login`,
            {
              method: "POST",
              body: JSON.stringify(credentials),
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          const user = await res.json();

          if (res.ok && user) {
            console.log("user", user.data.user);
            // Any object returned will be saved in `user` property of the JWT
            return user.data.user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.id = token.id;
        session.user.access_token = token.access_token;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.id = user.id;
        token.access_token = user.access_token;
        token.role = user.role;
      }
      return token;
    },
  },
  // session: { strategy: "jwt" },
  pages: {
    signIn: "/", //sigin page
  },
};
