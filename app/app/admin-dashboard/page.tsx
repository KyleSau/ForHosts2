import Searchable from './search';
import UsersTable from './host-table';
import { Card, Metric, Text, Title, BarList, Flex, Grid } from '@tremor/react';
import PerformanceChart from './chart';
import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { RollerCoaster } from 'lucide-react';
import { User, Role } from "@prisma/client";
import HostTable from './host-table';
import ReservationTable from './reservation-table';
import { DataTable } from './host-table-shadcn';
import { ColumnDef } from '@tanstack/react-table';

export const dynamic = 'force-dynamic';

//Shadcn example columns
type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
]

//For Test (https://ui.shadcn.com/docs/components/data-table#filtering)
async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      }
    ]
  }


export default async function IndexPage({
    searchParams
}: {
    searchParams: { q: string };
}) {
    const search = searchParams.q ?? '';
    console.log("search: ", search);
    const sites = await prisma?.site.findMany();
    console.log("sites: ", sites);
    const listings = await prisma?.post.findMany();
    console.log("listings: ", listings);
    const reservations = await prisma?.reservation.findMany();
    console.log("reservations: ", reservations);
    const users: User[] | undefined = await prisma?.user.findMany({
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
    console.log("users: ", users);

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

    const tableTestData = await getData();

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

            <DataTable columns={columns} data={tableTestData} />
            
            {/* <Title>Recent Reservations</Title>
            <Searchable />
            <Card className="mt-2">
                <ReservationTable reservations={reservations} />
            </Card> */}

            {/* <Title>Host Information</Title> */}
            {/* <Searchable /> */}
            {/* <Card className="mt-2">
                <HostTable users={users} />
            </Card> */}

            {/* <Title></Title> */}
        </main>
    );
}
