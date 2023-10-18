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
                    <DropdownMenuCheckboxItem
                        className="pl-0 px-2 cursor-pointer"
                        onClick={() => editCaption(index)}
                    >
                        <Pencil size={15} className="text-green-600 mr-2" />Edit Caption
                    </DropdownMenuCheckboxItem>
                    <hr />
                    <DropdownMenuCheckboxItem
                        className="pl-0 px-2 cursor-pointer"
                        onClick={() => makeCoverPhoto(index)}
                    >
                        <Star size={15} className=" text-yellow-300 mr-2" /> Make Cover Photo
                    </DropdownMenuCheckboxItem>
                    <hr />
                    {<DropdownMenuCheckboxItem
                        className="pl-0 px-2 cursor-pointer"
                        onClick={() => moveForward(index)}
                    >
                        <MoveRight size={15} className=" text-blue-500 mr-2" /> Move Forward
                    </DropdownMenuCheckboxItem>
                    }
                    <hr />
                    {index !== 0 && <DropdownMenuCheckboxItem
                        className="pl-0 px-2 cursor-pointer"
                        onClick={() => moveBackward(index)}
                    >
                        <MoveLeft size={15} className=" text-blue-500 mr-2" />Move Backward
                    </DropdownMenuCheckboxItem>}
                    <hr />
                    <DropdownMenuCheckboxItem
                        className="pl-0 px-2 cursor-pointer"
                        onClick={() => toggleModal(index)}
                    >
                        <Trash2 size={15} className=" text-red-500 mr-2" />Delete
                    </DropdownMenuCheckboxItem>
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
                    className="object-fit h-[300px] w-full pb-1"
                    width={200}
                    height={200}
                    src={photo.url ?? "/placeholder.png"}
                />
            </div>
        </div>
    )
}
