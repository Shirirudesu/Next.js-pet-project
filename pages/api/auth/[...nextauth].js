import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email } = user;
        try {
          await dbConnect();
          const userExists = await User.findOne({ email });

          if (!userExists) {
            await User.create({ name, email, roleId: 0 });
          }
          console.log(userExists);
          // return userExists;
          return user;
        } catch (error) {
          console.log("Error during signIn:", error);
        }
      }
      return user;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export default NextAuth(authOptions);
export { handler as GET, handler as POST };
