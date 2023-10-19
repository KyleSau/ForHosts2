"use client"
import React from 'react'

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { placeholderBlurhash } from "@/lib/utils";
import { MoreHorizontal, MoveLeft, MoveRight, Pencil, Star, Trash2 } from "lucide-react";
import BlurImage from '@/components/blur-image';
import { Image } from '@prisma/client';
import { shiftBlobMetadata } from '@/lib/blob_actions';

interface PhotoCardProps {
    // this should at some point be a Photo obj without guid and internal data
    photo: Image;
    index: number;
    postId: string;
}

export default function PhotoCard({ photo, index, postId }: PhotoCardProps) {

    const menuItems = [
        {
            label: "Edit Caption",
            icon: <Pencil size={15} className="text-green-600 mr-2" />,
            action: (index: number) => editCaption(index),
        },
        {
            label: "Make Cover Photo",
            icon: <Star size={15} className="text-yellow-300 mr-2" />,
            condition: (index: number) => index !== 0,
            action: (index: number) => makeCoverPhoto(index),
        },
        {
            label: "Move Forward",
            icon: <MoveRight size={15} className="text-blue-500 mr-2" />,
            action: (index: number) => moveForward(index),
        },
        {
            label: "Move Backward",
            icon: <MoveLeft size={15} className="text-blue-500 mr-2" />,
            condition: (index: number) => index !== 0,
            action: (index: number) => moveBackward(index),
        },
        {
            label: "Delete",
            icon: <Trash2 size={15} className="text-red-500 mr-2" />,
            action: (index: number) => toggleModal(index),
        },
    ];

    const makeCoverPhoto = (index: number) => {
        shiftBlobMetadata(postId, index, 0);
        // visually move it in the photo manager's photos state
    }

    const moveForward = (index: number) => {
        shiftBlobMetadata(postId, index, index + 1); // do bounds checks here
        // visually show this
    }

    const moveBackward = (index: number) => {
        shiftBlobMetadata(postId, index, index - 1); // do bounds checks here
        // visually show this
    }

    const toggleModal = (index: number) => {

    }

    const editCaption = (index: number) => {

    }

    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="absolute right-1 top-1 z-10">
                        <div
                            className="flex items-center justify-center rounded-full border shadow-sm bg-gray-100 opacity-75 p-2 hover:scale-110 transition ease-in-out duration-300 hover:bg-white hover:opacity-100 cursor-pointer"
                            style={{
                                width: "36px",
                                height: "36px",
                            }}
                        >
                            <MoreHorizontal size={30} className="text-black" />
                        </div>{" "}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto">
                    {menuItems.map((item) => (
                        <>
                            {(!item.condition || (item.condition && item.condition(index))) && (
                                <DropdownMenuCheckboxItem
                                    className="pl-0 px-2 cursor-pointer"
                                    onClick={() => item.action(index)}
                                >
                                    {item.icon}
                                    {item.label}
                                </DropdownMenuCheckboxItem>
                            )}
                            <hr />
                        </>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {index === 0 && (
                <div className="absolute left-2 top-2 z-10">
                    <Star size={32} className=" text-yellow-300" />
                </div>
            )}
            <div>
                <BlurImage
                    alt={photo.url ?? ""}
                    blurDataURL={placeholderBlurhash}
                    className="object-fit h-[300px] w-full pb-3"
                    width={200}
                    height={200}
                    src={photo.url ?? "/placeholder.png"}
                />
                {photo.orderIndex}
                {photo.caption}
            </div>
        </div>
    )
}
