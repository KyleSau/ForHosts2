"use client";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { placeholderBlurhash } from "@/lib/utils";
import {
  MoreHorizontal,
  MoveLeft,
  MoveRight,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import BlurImage from "@/components/blur-image";
import { Image } from "@prisma/client";
import { shiftBlobMetadata } from "@/lib/blob_actions";
import DeletePhotoModal from "./delete-photo-modal";
import { useModal } from "@/components/modal/provider";

interface PhotoCardProps {
  // this should at some point be a Photo obj without guid and internal data
  photo: Image;
  index: number;
  postId: string;
  totalImages: number;
  movePhoto: (oldIndex: number, newIndex: number, moveType: string) => void;
  handleDelete: (index: number) => void;
}

export default function PhotoCard({
  photo,
  index,
  postId,
  totalImages,
  movePhoto,
  handleDelete,
}: PhotoCardProps) {
  const menuItems = [
    {
      label: "Edit Caption",
      icon: <Pencil size={15} className="mr-2 text-green-600" />,
      action: (index: number) => editCaption(index),
    },
    {
      label: "Make Cover Photo",
      icon: <Star size={15} className="mr-2 text-yellow-300" />,
      condition: (index: number) => index !== 0,
      action: (index: number) => makeCoverPhoto(index),
    },
    {
      label: "Move Forward",
      icon: <MoveRight size={15} className="mr-2 text-blue-500" />,
      condition: (index: number) => index !== totalImages - 1,
      action: (index: number) => moveForward(index),
    },
    {
      label: "Move Backward",
      icon: <MoveLeft size={15} className="mr-2 text-blue-500" />,
      condition: (index: number) => index !== 0,
      action: (index: number) => moveBackward(index),
    },
    {
      label: "Delete",
      icon: <Trash2 size={15} className="mr-2 text-red-500" />,
      action: (index: number) => toggleModal(index),
    },
  ];

  const makeCoverPhoto = (index: number) => {
    movePhoto(index, 0, "makeCoverPhoto");
    shiftBlobMetadata(postId, index, 0);
  };

  const moveForward = (index: number) => {
    if (index < totalImages - 1) {
      const newIndex = index + 1;
      movePhoto(index, newIndex, "moveForward");
      shiftBlobMetadata(postId, index, newIndex);
    }
  };

  const moveBackward = (index: number) => {
    if (index > 0) {
      const newIndex = index - 1;
      movePhoto(index, newIndex, "moveBackward");
      shiftBlobMetadata(postId, index, newIndex);
    }
  };

  const modal = useModal();

  const toggleModal = (index: number) => {
    modal?.show(
      <DeletePhotoModal
        index={index}
        imageId={photo.id}
        onDelete={handleDelete}
      />,
    );
  };

  const editCaption = (index: number) => {};

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="absolute right-1 top-1 z-10">
            <div
              className="flex cursor-pointer items-center justify-center rounded-full border bg-gray-100 p-2 opacity-75 shadow-sm transition duration-300 ease-in-out hover:scale-110 hover:bg-white hover:opacity-100 focus:scale-110 focus:bg-white focus:opacity-100"
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
              {(!item.condition ||
                (item.condition && item.condition(index))) && (
                <DropdownMenuCheckboxItem
                  className="cursor-pointer px-2 pl-0"
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
          className="object-fit h-[300px]"
          width={200}
          height={200}
          src={photo.url ?? "/placeholder.png"}
        />
      </div>
    </div>
  );
}
