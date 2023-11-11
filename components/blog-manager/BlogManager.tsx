"use client"
import React, { useEffect, useState } from 'react'
import { deleteBlogPost, getAllBlogs } from '@/lib/actions';
import { Blog } from '@prisma/client';
import { BlogDataTable } from './BlogDataTable';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface BlogManagerProps {
    blogs: Blog[];
}

export default function BlogManager({ blogs }: BlogManagerProps) {

    const [localBlogs, setLocalBlogs] = useState<Blog[]>([]);

    const router = useRouter();

    // Initialize local state with blogs passed from the server
    useEffect(() => {
        setLocalBlogs(blogs);
    }, [blogs]);

    // Function to refresh the local blogs list after a delete
    const refreshLocalBlogsAfterDelete = (deletedBlogId: string) => {
        setLocalBlogs(currentBlogs => currentBlogs.filter(blog => blog.id !== deletedBlogId));
    };

    const editBlog = async (blogId: string) => {
        router.push(`/admin/blogs/edit-blog/${blogId}`);
    };

    // Function to handle blog deletion
    const deleteBlog = async (blogId: string) => {
        try {
            await deleteBlogPost(blogId);
            refreshLocalBlogsAfterDelete(blogId);
            toast.success('Post successfully deleted!');
        } catch (error) {
            toast.error('Error deleting post');
        }
    };

    return (
        <div>
            <Link href="/admin/blogs/create-blog" passHref>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Blog Post
                </button>
            </Link>
            <BlogDataTable blogs={localBlogs} onDeleteBlog={deleteBlog} onEditBlog={editBlog} />
        </div>
    )
}
