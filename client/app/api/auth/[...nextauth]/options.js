import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    GitHubProvider({
      async profile(profile) {
        const res = await fetch(
          `http://localhost:3300/api/v1/users?email=${profile?.email}`
        );

        if (res.ok) {
          // user exist
          const user = await res.json();

          return {
            ...user,
            id: profile?.id,
          };
        } else {
          // user doesn't exist
          const res = await fetch("http://localhost:3300/api/v1/users", {
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
          `http://localhost:3300/api/v1/users?email=${profile?.email}`
        );

        if (res.ok) {
          // user exist
          const user = await res.json();

          return {
            ...user,
            id: profile.sub,
          };
        } else {
          // user doesn't exist
          const res = await fetch("http://localhost:3300/api/v1/users", {
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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "text",
          placeholder: "Your email",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "Your password",
        },
      },
      async authorize(credentials) {
        try {
          let userRole = "user";

          const response = await fetch(
            "http://localhost:3300/api/v1/users/auth",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await response.json();

          if (data.error) {
            throw new Error();
          }

          console.log(data);
          data.role = userRole;

          return {
            ...data,
            name: data.firstName + " " + data.lastName,
            id: data._id,
            username: data.username,
            dob: data.dob,
          };
        } catch (error) {
          console.log("Error:", error);
          throw new Error("Invalid email or password");
        }
        return null;
      },
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
  },
  pages: {
    signIn: "/auth/signin",
  },
  theme: {
    colorScheme: "light",
    brandColor: "#3B82F6",
    logo: "https://i.ibb.co/Mg03MWv/vibe-logo.png",
    buttonText: "#FFF",
  },
};
