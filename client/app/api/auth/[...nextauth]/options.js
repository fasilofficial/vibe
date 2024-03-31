import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { SERVER_BASE_URL } from "@/constants";

export const options = {
  providers: [
    GitHubProvider({
      async profile(profile) {
        const res = await fetch(
          `${SERVER_BASE_URL}/api/v1/users?email=${profile?.email}`
        );

        if (res.ok) {
          // user exist
          const { data: user } = await res.json();

          return {
            ...user,
            id: profile?.id,
          };
        } else {
          // user doesn't exist
          const res = await fetch(`${SERVER_BASE_URL}/api/v1/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: profile?.name,
              email: profile?.email,
              profileUrl: profile?.avatar_url,
              username: profile?.login,
            }),
          });

          if (res.ok) {
            // user created
            const user = await res.json();

            return {
              ...user,
              id: profile?.id,
            };
          } else {
            const err = await res.json();
            throw new Error(err?.message);
          }
        }
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      async profile(profile) {
        const res = await fetch(
          `${SERVER_BASE_URL}/api/v1/users?email=${profile?.email}`
        );

        if (res.ok) {
          // user exist
          const { data: user } = await res.json();

          return {
            ...user,
            id: profile.sub,
          };
        } else {
          // user doesn't exist
          const res = await fetch(`${SERVER_BASE_URL}/api/v1/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: profile?.given_name + " " + profile?.family_name,
              email: profile?.email,
              profileUrl: profile?.picture,
              username: profile?.email.split("@")[0],
            }),
          });

          if (res.ok) {
            // user created
            const user = await res.json();

            return {
              ...user,
              id: profile.sub,
            };
          } else {
            const err = await res.json();
            throw new Error(err?.message);
          }
        }
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
    },
    async redirect() {
      return "/";
    },
  },
};
