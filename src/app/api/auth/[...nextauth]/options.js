import GoogleProvider from "next-auth/providers/google";

export const options = {
    providers: [
        GoogleProvider({
            profile(profile) {
                console.log("Google profile: " + profile);

                // const studentPattern = /^([a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{3}|\d{9})@iitdh\.ac\.in$/;
                // const professorPattern = /^(?!([a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{3}|[0-9]{9})@iitdh\.ac\.in$)[a-zA-Z0-9._%+-]+@iitdh\.ac\.in$/;

                // test
                const studentPattern = /^([a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{3}|\d{9})@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                const professorPattern = /^(?!([a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{3}|\d{9})@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                let userRole = "unknown";
                if (studentPattern.test(profile?.email)) {
                    userRole = "student";
                } else if (professorPattern.test(profile?.email)) {
                    userRole = "professor";
                }

                return {
                    ...profile,
                    id: profile.sub,
                    role: userRole,
                };
            },
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    ],
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }) {
        //     const emailPattern = /^[a-zA-Z0-9._%+-]+@iitdh\.ac\.in$/;

        //     if (account.provider === "google" && !emailPattern.test(user.email)) {
        //         return false;
        //     }

        //     return true;
        // },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role;
            }
            return session;
        }
    }
}