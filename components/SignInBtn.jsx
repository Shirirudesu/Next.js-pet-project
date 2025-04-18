"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignInBtn() {
  return (
    <button
      onClick={() => signIn("google")}
      style={{
        backgroundColor: "#4285F4",
        color: "#fff",
        border: "none",
        borderRadius: "9999px",
        padding: "12px 24px",
        fontSize: "16px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Image
        src="/images.png"
        height={20}
        width={20}
        alt="Google logo"
        style={{ background: "#fff", borderRadius: "50%", padding: "2px" }}
      />
      Sign in with Google
    </button>
  );
}
