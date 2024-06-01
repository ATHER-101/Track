"use client"

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
    const { data: session, status } = useSession(); // Get session and authentication status
    const router = useRouter(); // Next.js router for redirection

    useEffect(() => {
        if (status === "authenticated") {
            // Redirect based on user role
            if (session.user.role === "student") {
                router.push("/student");
            } else if (session.user.role === "professor") {
                router.push("/dashboard");
            } else {
                router.push("/signIn");
            }
        }
    }, [status, session, router]);

    return (
        <div>
            <button onClick={() => signIn("google")}>Sign in with Google</button>
        </div>
    );
}
