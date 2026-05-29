import "../css/style.css";
import "../css/form.css";
import Head from "next/head";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import "../css/globals.css";
import Navbar from "../components/Navbar";
import { UserProvider } from "../context/UserContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <Head>
          <title>Pet App</title>
        </Head>

        <div className="top-bar">
          <div className="nav">
            <Link href="/">Home</Link>
            <Link href="/buy">Buy credits</Link>
            <Link href="/slot">Slot Machine</Link>
            <Link href="/coin">Coin Flip</Link>
            <Link href="/articles">View Articles</Link>
            <Link href="/scraper">Scrape Website</Link>
            <Link href="/profile">Profile</Link>
            <Navbar />
          </div>

          <img
            id="title"
            src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Pet_logo_with_flowers.png"
            alt="pet care logo"
          ></img>
        </div>
        <div className="grid wrapper">
          <Component {...pageProps} />
        </div>
      </UserProvider>
    </SessionProvider>
  );
}

export default MyApp;
