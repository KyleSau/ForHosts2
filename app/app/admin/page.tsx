import Searchable from './search';
import UsersTable from './table';
import { Card, Metric, Text, Title, BarList, Flex, Grid } from '@tremor/react';
import Chart from './chart';
import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { RollerCoaster } from 'lucide-react';
import { Role } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function IndexPage({
    searchParams
}: {
    searchParams: { q: string };
}) {

    // const session = await getSession();
    // if (!session?.user.role === Role.ADMIN) {
    //     redirect("/login");
    // }

    const search = searchParams.q ?? '';
    const sites = await prisma?.site.findMany();
    const listings = await prisma?.site.findMany();
    const reservations = await prisma?.reservation.findMany();
    const users = await prisma?.user.findMany({
        where: {
            name: {
                contains: search,
                mode: "insensitive" // This will make the search case-insensitive
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            sites: true,
            posts: true
        }
    });

    const data = [
        {
            category: 'Websites',
            stat: sites?.length,
        },
        {
            category: 'Listings',
            stat: listings?.length,
        },
        {
            category: 'Reservations',
            stat: reservations?.length,
        }
    ];

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mb-4">
                {data.map((item) => (
                    <Card key={item.category}>
                        <Title>{item.category}</Title>
                        <Flex
                            justifyContent="start"
                            alignItems="baseline"
                            className="space-x-2"
                        >
                            <Metric>{item.stat}</Metric>
                            <Text>Total {item.category}</Text>
                        </Flex>
                    </Card>
                ))}
            </Grid>
            <Title>Hosts</Title>
            <Searchable />
            <Card className="mt-2">
                <UsersTable users={users} />
            </Card>
            <Chart />
        </main>
    );
}
