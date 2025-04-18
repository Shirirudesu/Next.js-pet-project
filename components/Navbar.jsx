"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
// import axios from 'axios'

export default function Navbar(props) {
  const { status, data: session } = useSession();


  const getData = async () => {
    if(status === "authenticated") {
    const res = await fetch(`/api/user/${session?.user?.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resJson = await res.json()
    console.log(resJson.data.credits)
    props.setCredits(resJson.data.credits)
  }

  }

useEffect(()=> {
  // console.log(session)
  // setTimeout(() => {getData(session )}, 5000)
 getData()
},[status])

  return (
    < >
      {status === "authenticated" ? (
        <>
        <a>Balance: {props.credits} credits</a> 
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
