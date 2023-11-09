"use client"
import React from 'react'
import prisma from "@/lib/prisma";
import { createDummyBlog } from '@/lib/actions';
export default function BlogManager() {

    const onClickington = async () => {
        await createDummyBlog();
    }

    return (
        <div><button onClick={onClickington}>Create Blogington</button></div>
    )
}
