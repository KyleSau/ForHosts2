import { getSession } from "@/lib/auth";
import HomeView from '@/components/stripe/HomeView';
import { fetchStripeData } from "@/lib/actions";
import { NextPageContext } from "next";
import { ParsedUrlQuery } from 'querystring';
import { GetServerSideProps } from "next";

type Props = {
    params: {},
    searchParams: { [key: string]: string | string[] | undefined },
}

// export default async function PaymentsPage(props: Props) {
export default function Page({ }) {

    return <h1>Test</h1>

}