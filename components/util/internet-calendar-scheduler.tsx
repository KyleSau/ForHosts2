// interface Event {
//     id: string;
//     dtstart: string;
//     dtend: string;
//     location: string;
//     description: string;
//     url: string;
// }

import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { PrismaClient } from '@prisma/client';

interface PathProps extends ParsedUrlQuery {
    site: string;
    slug: string;
}

interface PathProps extends ParsedUrlQuery {
    site: string;
    slug: string;
}


export default function InternetCalendarScheduler({ events }: any) {

    return (
        <div>

        </div>
    )

}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const prisma = new PrismaClient();
    const { site, slug } = query as PathProps;

    const post = await prisma.post.findFirst({
        where: {
            site: {
                subdomain: site,
            },
            slug,
        },
        select: {
            id: true,
        },
    });

    if (!post) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            postId: post.id,
        },
    };
};