import Head from 'next/head';
import Image from 'next/image';
import meta from '../../meta.json';
export default function Home() {
    return (
        <>
            <Head>
                <title>{meta.title.value}</title>
                <meta name="description" content={meta.description.value} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <p>Job b</p>
            </main>
        </>
    );
}
