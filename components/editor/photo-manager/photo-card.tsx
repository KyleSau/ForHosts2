"use client"
import React from 'react'

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { placeholderBlurhash } from "@/lib/utils";
import { MoreHorizontal, Star } from "lucide-react";
import BlurImage from '@/components/blur-image';
import { Image } from '@prisma/client';

interface PhotoCardProps {
    // this should at some point be a Photo obj without guid and internal data
    photo: Image;
    index: number;
}

export default function PhotoCard({ photo, index }: PhotoCardProps) {

    const makeCoverPhoto = (index: number) => {

    }

    const moveForward = (index: number) => {

    }

    const moveBackward = (index: number) => {

    }

    const toggleModal = (index: number) => {

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
                <DropdownMenuContent className="w-56">
                    <DropdownMenuCheckboxItem
                        onClick={() => makeCoverPhoto(index)}
                    >
                        Make Cover Photo
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        onClick={() => moveForward(index)}
                    >
                        Move Forward
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        onClick={() => moveBackward(index)}
                    >
                        Move Backward
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        onClick={() => toggleModal(index)}
                    >
                        Delete
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {index === 0 && (
                <div className="absolute left-2 top-2 z-10">
                    <Star size={32} className=" text-yellow-500" />
                </div>
            )}
            <div>
                <BlurImage
                    alt={photo.url ?? ""}
                    blurDataURL={placeholderBlurhash}
                    className="object-fit h-[300px] w-full pb-1"
                    width={200}
                    height={200}
                    src={photo.url ?? "/placeholder.png"}
                />
            </div>
        </div>
    )
}
