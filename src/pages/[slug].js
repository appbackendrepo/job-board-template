import { Button, Text } from '@geist-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
const md = require('markdown-it')({
    breaks: false,
});
var linkify = require('linkify-it')();

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href');
    if (href && linkify.test(href)) {
        tokens[idx].attrSet('target', '_blank');
    }
    return self.renderToken(tokens, idx, options);
};

let stopper = true;
export default function Page() {
    const router = useRouter();
    const { slug } = router.query;
    const [jobPost, setJobPost] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            stopper = false;
            try {
                const res = await fetch(
                    `https://api.tablebackend.com/v1/rows/wzXPSQK0U3V8?filterKey=slug&filterValue=${slug}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const { data } = await res.json();
                setJobPost(data[0]);
                setTimeout(() => {
                    stopper = true;
                }, 1000);
            } catch (error) {
                console.error(error);
            }
        };
        if (stopper && slug) fetchData();
    }, [slug]);

    return (
        <>
            {jobPost && (
                <div className="job-post">
                    <Link href="/">
                        <Text type="secondary">View all job posts</Text>
                    </Link>
                    <div className="header">
                        <div className="post-meta">
                            <div className="card-image">
                                <img
                                    src={jobPost.company_logo}
                                    alt={jobPost.position}
                                />
                            </div>
                            <div>
                                <Text h4 my={0}>
                                    {jobPost.position}
                                </Text>
                                <Text small my={0}>
                                    {jobPost.company}
                                </Text>
                                <br />
                                <Text small type="secondary" my={0}>
                                    {jobPost.location}
                                </Text>
                            </div>
                        </div>
                        <div>
                            <a href={jobPost.apply_url} target="_blank">
                                <Button type="secondary">Apply</Button>
                            </a>
                        </div>
                    </div>

                    <div
                        className="markdown-p"
                        dangerouslySetInnerHTML={{
                            __html: md.render(jobPost.description),
                        }}
                    />
                </div>
            )}
        </>
    );
}
