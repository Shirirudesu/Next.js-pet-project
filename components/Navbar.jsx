"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";
// import axios from 'axios'

export default function Navbar(props) {
  const { status, data: session } = useSession();
  const { credits, refreshUser } = useUser();

  useEffect(() => {
    if (status === "authenticated") {
      refreshUser();
    }
  }, [status]);

  return (
    <>
      {status === "authenticated" ? (
        <>
          <a>Balance: {credits} credits</a>
          <button
            onClick={() => signOut()}
            style={{
              margin: "24px",
              cursor: "pointer",
              cursor: "pointer",
              backgroundColor: "black",
              padding: "12px 24px",
              borderRadius: "8px",
              color: "white",
            }}
            className="bg-slate-900 text-white px-6 py-2 rounded-md"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn("google")}
          style={{
            margin: "24px",
            cursor: "pointer",
            backgroundColor: "black",
            padding: "12px 24px",
            borderRadius: "8px",
            color: "white",
          }}
          className="bg-red-500 text-white px-6 py-3 rounded-lg"
        >
          Sign In
        </button>
      )}
    </>
  );
}
