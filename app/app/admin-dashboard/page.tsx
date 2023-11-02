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
import { DataTable } from './data-table-shadcn';
import { Payment, tableTestColumns } from './columns-shadcn';
// import { ColumnDef } from '@tanstack/react-table';


export const dynamic = 'force-dynamic';

//For Test (https://ui.shadcn.com/docs/components/data-table#filtering)
// const paymentsData: Payment[] = [
//     {
//         id: "728ed52f",
//         amount: 100,
//         status: "pending",
//         email: "m@example.com",
//     },
//     {
//         id: "489e1d42",
//         amount: 125,
//         status: "processing",
//         email: "example@gmail.com",
//     }
// ]

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        {
            id: "489e1d42",
            amount: 125,
            status: "processing",
            email: "example@gmail.com",
        },
        {
            id: "489e1d43",
            amount: 130,
            status: "pending",
            email: "asdf@yahoo.com",
        },
        {
            id: "489e1d44",
            amount: 135,
            status: "success",
            email: "bob@gmail.com",
        }
    ];
}


export default async function IndexPage({
    searchParams
}: {
    searchParams: { q: string };
}) {
    // const search = searchParams.q ?? '';
    // console.log("search: ", search);
    // const sites = await prisma?.site.findMany();
    // console.log("sites: ", sites);
    // const listings = await prisma?.post.findMany();
    // console.log("listings: ", listings);
    // const reservations = await prisma?.reservation.findMany();
    // console.log("reservations: ", reservations);
    // const users: User[] | undefined = await prisma?.user.findMany({
    //     where: {
    //         name: {
    //             contains: search,
    //             mode: "insensitive" // This will make the search case-insensitive
    //         }
    //     },
    //     orderBy: {
    //         createdAt: 'desc'
    //     },
    //     include: {
    //         sites: true,
    //         posts: true
    //     }
    // });
    // console.log("users: ", users);

    // const data = [
    //     {
    //         category: 'Websites',
    //         stat: sites?.length,
    //     },
    //     {
    //         category: 'Listings',
    //         stat: listings?.length,
    //     },
    //     {
    //         category: 'Reservations',
    //         stat: reservations?.length,
    //     }
    // ];

    const tableTestData = await getData();
    console.log("tableTestColumns: ", tableTestColumns);

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            {/* <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mb-4">
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
            </Grid> */}

            <DataTable columns={tableTestColumns} data={tableTestData} />
            
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
