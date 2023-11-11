import * as React from 'react';
import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Blog } from '@prisma/client';
import { useRouter } from 'next/navigation';

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

type DataTableProps = {
    blogs: Blog[];
    onEditBlog: (blogId: string) => void;
    onDeleteBlog: (blogId: string) => void;
};

export function BlogDataTable({ blogs, onDeleteBlog, onEditBlog }: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const columns: ColumnDef<Blog>[] = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => row.getValue('title'),
        },
        {
            accessorKey: 'author',
            header: 'Author',
            cell: ({ row }) => row.getValue('author'),
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => row.getValue('description'),
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }) => row.getValue('slug'),
        },
        {
            accessorKey: 'keywords',
            header: 'Keywords',
            cell: ({ row }) => row.getValue('keywords').join(', '),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            cell: ({ row }) => formatDate(row.getValue('createdAt')),
        },
        {
            accessorKey: 'updatedAt',
            header: 'Updated At',
            cell: ({ row }) => formatDate(row.getValue('updatedAt')),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const blog = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditBlog(blog.id)}><Pencil className="mr-2" color='blue' size={18} />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteBlog(blog.id)}><Trash2 className="mr-2" color='red' size={18} />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: blogs,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Include pagination and other controls as needed */}
        </div>
    );
}
