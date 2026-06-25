import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Francisco M. Bautista Foundation Inc.</title>

        <meta
          name="description"
          content="Francisco M. Bautista Foundation Inc. Student Portal"
        />

        <link rel="icon" href="/images/logo.png" />
      </Head>

      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}
