"use client";
import React, { forwardRef, useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import { MoreHorizontal, Star } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modal from "@/components/modal";
import { toast } from "sonner";

const CustomComponent = forwardRef(function CustomComponent(props, ref) {
  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      style={{
        boxSizing: "border-box",
        padding: "5px",
        height: "auto",
      }}
      ref={ref}
    >
      {props.children}
    </div>
  );
});

export default function PhotoGrid({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [coverPhotoID, setCoverPhotoID] = useState(null);
  const [state, setState] = useState([
    {
      id: 1,
      name: "1",
      url: "https://upload.wikimedia.org/wikipedia/en/1/11/SoCal_Lashings_Logo.png",
      caption: "",
      isCoverPhoto: false,
    },
    {
      id: 2,
      name: "2",
      url: "https://upload.wikimedia.org/wikipedia/en/e/e8/Callipygia.jpg",
      caption: "",
      isCoverPhoto: false,
    },
    {
      id: 3,
      name: "3",
      url: "https://upload.wikimedia.org/wikipedia/en/e/e0/KAUH_logo.png",
      caption: "",
      isCoverPhoto: false,
    },
    {
      id: 4,
      name: "4",
      url: "https://upload.wikimedia.org/wikipedia/en/6/6e/Okapi_large.png",
      caption: "",
      isCoverPhoto: false,
    },
    {
      id: 5,
      name: "5",
      url: "https://upload.wikimedia.org/wikipedia/en/8/89/Grammy-frontcover.jpg",
      caption: "",
      isCoverPhoto: false,
    },
    {
      id: 6,
      name: "6",
      url: "https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Lenna.png/220px-Lenna.png",
      caption: "",
      isCoverPhoto: false,
    },
    {
      id: 7,
      name: "7",
      url: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Lenna66.png/250px-Lenna66.png",
      caption: "",
      isCoverPhoto: false,
    },
    {
      id: 8,
      name: "8",
      url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1920px-Wikipedia-logo-v2.svg.png",
      caption: "",
      isCoverPhoto: false,
    },
    {
      id: 9,
      name: "9",
      url: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Lenna66.png/250px-Lenna66.png",
      caption: "",
      isCoverPhoto: false,
    },
  ]);

  const onDragEnd = (e: Sortable.SortableEvent) => {
    console.log(e.oldIndex + " -> " + e.newIndex);
  };

  const moveForward = (index) => {
    if (index < state.length - 1) {
      const newState = [...state];
      const temp = newState[index];
      newState[index] = newState[index + 1];
      newState[index + 1] = temp;
      setState(newState);
    } else {
      toast.error("You can't move the image forward any further!");
    }
  };

  const moveBackward = (index) => {
    if (index > 0) {
      const newState = [...state];
      const temp = newState[index];
      newState[index] = newState[index - 1];
      newState[index - 1] = temp;
      setState(newState);
    } else {
      toast.error("You can't move the image back any further!");
    }
  };

  const toggleModal = (image) => {
    setSelectedImage(image);
  };

  const deleteImage = () => {
    // Handle delete image logic here
    setSelectedImage(null);
  };
  const closeImage = () => {
    setSelectedImage(null);
  };
  const makeCoverPhoto = (index) => {
    const newState = state.map((item, i) => ({
      ...item,
      isCoverPhoto: i === index,
    }));
    setState(newState);
    setCoverPhotoID(state[index].id);
  };
  return (
    <div>
      <div className="flex justify-center border p-10">
        <ReactSortable
          expand={false}
          tag={CustomComponent}
          list={state}
          setList={setState}
          onEnd={onDragEnd}
        >
          {state.map((image, index) => (
            <div
              className="h-full w-[250px] hover:animate-pulse md:w-[400px]"
              key={image.id}
            >
              <div className="relative" style={{ aspectRatio: "16/9" }}>
                <div style={{ position: "relative" }}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="absolute right-2 top-2 z-10 hover:scale-110">
                        <MoreHorizontal
                          size={30}
                          className="text-gray-400  hover:text-black"
                        />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuCheckboxItem>Edit</DropdownMenuCheckboxItem>
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
                        onClick={() => toggleModal(image)}
                      >
                        Delete
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {image.isCoverPhoto && coverPhotoID !== null && (
                    <div className="absolute left-2 top-2 z-10">
                      <Star size={32} className=" text-yellow-500" />
                    </div>
                  )}
                  <div className="flex justify-center">
                    <BlurImage
                      alt={image.url ?? ""}
                      blurDataURL={placeholderBlurhash}
                      className="object-fit h-[200px] w-full gap-4 pb-1"
                      width={200}
                      height={200}
                      placeholder="blur"
                      src={image.url ?? "/placeholder.png"}
                    />
                  </div>
                </div>
                <div className="bg-tranparent relative cursor-pointer bg-opacity-10 pt-10 text-white hover:bg-gray-300 hover:bg-opacity-60 hover:text-opacity-100">
                  <input
                    type="text"
                    className="absolute bottom-0 w-full border-none bg-transparent text-black focus:animate-none focus:rounded-lg focus:bg-gray-100 focus:bg-opacity-90 focus:ring-blue-300"
                    placeholder="Add a caption..."
                    value={image.caption}
                    onChange={(e) => {
                      const newCaption = e.target.value;
                      // Update the caption in the state
                      setState((prevState) =>
                        prevState.map((item) =>
                          item.id === image.id
                            ? { ...item, caption: newCaption }
                            : item,
                        ),
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </ReactSortable>
      </div>
      {selectedImage && (
        <Modal showModal={selectedImage !== null} setShowModal={closeImage}>
          <div className="max-h-[60vh] overflow-y-auto rounded-lg bg-white p-6 shadow-md md:p-8">
            <button
              className="absolute right-4 top-4 text-2xl"
              onClick={() => toggleModal(null)}
            >
              &times;
            </button>
            <h2 className="mb-4 text-lg font-semibold">Delete Image</h2>
            <div className="mb-4">
              <p className="text-base text-gray-600">
                Are you sure you want to delete this image?
              </p>
            </div>
            <div className="flex justify-between">
              <button
                className="rounded border border-black bg-orange-100 px-4 py-2 text-black hover:bg-black hover:text-white"
                onClick={() => {
                  // Handle delete image logic here
                  closeImage();
                }}
              >
                Cancel
              </button>
              <button
                className="rounded border border-black bg-red-400 px-4 py-2 text-black  hover:bg-black hover:text-white"
                onClick={() => {
                  // Handle delete image logic here
                  deleteImage();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
