import Head from 'next/head';
import Image from 'next/image';
import meta from '../../meta.json';
import { useEffect, useState } from 'react';
import { Input, Text } from '@geist-ui/core';
import moment from 'moment';
import { Search } from 'iconoir-react';
import PoweredBy from '@/components/poweredBy';
import Link from 'next/link';
let stopper = true;
export default function Home() {
    const [posts, setPosts] = useState([]);
    const [copyPosts, setCopyPosts] = useState([]);
    const [timer, setTimer] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            stopper = false;
            try {
                const res = await fetch(
                    `https://api.tablebackend.com/v1/rows/wzXPSQK0U3V8`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const { data } = await res.json();
                setPosts(data);
                setCopyPosts(data);
                setTimeout(() => {
                    stopper = true;
                }, 1000);
            } catch (error) {
                console.error(error);
            }
        };
        if (stopper) fetchData();
    }, []);

    const searchResult = (e) => {
        const { value } = e.target;

        if (value === '') {
            setPosts(copyPosts);
            return;
        }

        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://api.tablebackend.com/v1/rows/wzXPSQK0U3V8/search?q=${value}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const { hits } = await res.json();
                setPosts(hits);
                // handle success
            } catch (error) {
                console.error(error);
                // handle error
            }
        }, 1000);

        setTimer(newTimer);
    };
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
                <PoweredBy />
                <div className="main-container">
                    <div className="search-input">
                        <Text h2>Job Board Template</Text>
                        <Input
                            icon={<Search />}
                            placeholder="Advance search to find a job"
                            width="100%"
                            onChange={searchResult}
                        />
                    </div>
                    <div className="posts">
                        {posts.map((post, key) => (
                            <Link
                                href={`/${post.slug}`}
                                className="card"
                                key={key}
                            >
                                <div className="post-meta">
                                    <div className="card-image">
                                        <img
                                            src={post.company_logo}
                                            alt={post.position}
                                        />
                                    </div>
                                    <div>
                                        <Text h4 my={0}>
                                            {post.position}
                                        </Text>
                                        <Text small my={0}>
                                            {post.company}
                                        </Text>
                                        <br />
                                        <Text small type="secondary" my={0}>
                                            {post.location}
                                        </Text>
                                    </div>
                                </div>
                                <div className="post-date">
                                    <Text small type="secondary">
                                        {moment(post.date).fromNow()}
                                    </Text>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
