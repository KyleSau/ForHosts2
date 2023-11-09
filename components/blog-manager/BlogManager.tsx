"use client"
import React from 'react'
import prisma from "@/lib/prisma";
import { createDummyBlog, getAllBlogs } from '@/lib/actions';
import { Blog } from '@prisma/client';

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
            {blogs.map((blog) =>
                <li key={blog.id}>{blog.title}</li>
            )}
        </div>
    )
}
