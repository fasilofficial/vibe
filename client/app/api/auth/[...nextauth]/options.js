import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";


export const options = {
  providers: [
    GitHubProvider({
      profile(profile) {
        let userRole = "GitHub User";
        

        if (profile?.email === "muhammedfasilofficial@gmail.com") {
          userRole = "admin";
        }

        return {
          ...profile,
          role: userRole,
          image: profile.avatar_url,
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      profile(profile) {
        let userRole = "Google User";
        console.log("Google", profile);

        if (profile?.email === "muhammedfasilofficial@gmail.com") {
          userRole = "admin";
        }

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
          image: profile.picture,
        };
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
