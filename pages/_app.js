import "../css/style.css";
import "../css/form.css";
import Head from "next/head";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import "../css/globals.css";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [credits, setCredits] = useState(0);
  const [boughtItems, setBoughtItems] = useState([]);

  // const getData = async () => {
  //   const res = await fetch(`/api/user/${session?.user?.email}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   console.log(await res.json())
  // }

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Pet Care App</title>
      </Head>

      <div className="top-bar">
        <div className="nav">
          <Link href="/">Home</Link>
          <Link href="/new">Add Pet</Link>
          <Link href="/create">Buy credits</Link>
          <Link href="/slot">Slot Machine</Link>
          <Link href="/coin">Coin Flip</Link>
          <Link href="/articles">View Articles</Link>
          <Link href="/scraper">Scrape Website</Link>

          <Navbar
            credits={credits}
            setCredits={setCredits}
            setBoughtItems={setBoughtItems}
          />
        </div>

        <img
          id="title"
          src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
          alt="pet care logo"
          onClick={() => setText(`Number:${Math.random()}`)}
        ></img>
      </div>
      <div className="grid wrapper">
        <Component
          {...pageProps}
          credits={credits}
          setCredits={setCredits}
          boughtItems={boughtItems}
          setBoughtItems={setBoughtItems}
        />
      </div>
    </SessionProvider>
  );
}

export default MyApp;
