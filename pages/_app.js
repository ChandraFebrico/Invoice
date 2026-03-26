import Head from "next/head";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#111111" />
                <link rel="icon" href="/logo.png" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
