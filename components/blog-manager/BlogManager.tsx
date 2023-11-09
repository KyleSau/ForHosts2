"use client"
import React from 'react'
import prisma from "@/lib/prisma";
import { createDummyBlog, getAllBlogs } from '@/lib/actions';
import { Blog } from '@prisma/client';
import { BlogDataTable } from './BlogDataTable';

interface BlogManagerProps {
    blogs: Blog[];
}

export default function BlogManager({ blogs }: BlogManagerProps) {

    const onClickington = async () => {
        await createDummyBlog();
    }

    return (
        <div>
            <button onClick={onClickington}>Create Blogington</button>
            <BlogDataTable blogs={blogs} />
        </div>
    )
}
