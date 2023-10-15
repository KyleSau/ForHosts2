"use client";
import React, { forwardRef, useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import { MoreHorizontal, Star } from "lucide-react";
import { Image } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modal from "@/components/modal";
import { toast } from "sonner";
import PhotoDeleteModal from "./photo-delete-modal";
import TabTitle from "../tab-title";

const CustomComponent = forwardRef(function CustomComponent(props, ref) {
  return (
    <div
      className="grid grid-cols-1 gap-2 md:grid-cols-3"
      style={{
        boxSizing: "border-box",
        padding: "15px",
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
  const [dummyData, setDummyData] = useState([
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
  ]);
  const uploadCard = {
    id: "upload-card",
    name: "Upload Card",
  };

  const onDragEnd = (e: Sortable.SortableEvent) => {
    console.log(e.oldIndex + " -> " + e.newIndex);
  };

  const moveForward = (index: any) => {
    if (index < dummyData.length - 1) {
      const newState = [...dummyData];
      const temp = newState[index];
      newState[index] = newState[index + 1];
      newState[index + 1] = temp;
      setDummyData(newState);
    } else {
      toast.error("You can't move the image forward any further!");
    }
  };

  const moveBackward = (index: any) => {
    if (index > 0) {
      const newState = [...dummyData];
      const temp = newState[index];
      newState[index] = newState[index - 1];
      newState[index - 1] = temp;
      setDummyData(newState);
    } else {
      toast.error("You can't move the image back any further!");
    }
  };

  const toggleModal = (image: any) => {
    setSelectedImage(image);
  };

  const deleteImage = () => {
    setSelectedImage(null);
  };
  const closeImage = () => {
    setSelectedImage(null);
  };
  const makeCoverPhoto = (index: any) => {
    const newState = dummyData.map((item, i) => ({
      ...item,
      isCoverPhoto: i === index,
    }));
    setDummyData(newState);
    setCoverPhotoID(dummyData[index].id);
  };
  return (
    <div>
      <div className="w-auto border p-10">
        <h1 className=" text-start text-4xl font-bold">Photo Manager</h1>
        <h2 className="text-md mb-4 text-start text-gray-500">
          Manage your listing&apos;s photos
        </h2>
        <hr className="pb-6" />
        <div className="flex justify-start gap-8">
          <ReactSortable
            expand={false}
            tag={CustomComponent}
            list={dummyData}
            setList={setDummyData}
            onEnd={onDragEnd}
          >
            {dummyData.map((image, index) => (
              <div
                className=" w-[250px] border md:w-[350px]"
                key={image.id}
              >
                <div className="relative" style={{ aspectRatio: "16/9" }}>
                  <div style={{ position: "relative" }}>
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
                    <div className="flex justify-center ">
                      <BlurImage
                        alt={image.url ?? ""}
                        blurDataURL={placeholderBlurhash}
                        className="object-fit h-[300px] w-full pb-1"
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
                      className="absolute bottom-0 w-full border-none bg-transparent text-black focus:animate-none  focus:bg-gray-100 focus:bg-opacity-90 focus:ring-blue-300"
                      placeholder="Add a caption..."
                      value={image.caption}
                      onChange={(e) => {
                        const newCaption = e.target.value;
                        setDummyData((prevState) =>
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
            {/* Render the card for uploading files */}
            <div className="relative items-center justify-center text-center text-gray-400">
              <div
                className="w-[250px] border  hover:animate-pulse md:h-full  md:w-[350px] "
                key={uploadCard.id}
              >
                <div className="relative" style={{ aspectRatio: "16/9" }}>
                  <div className=" flex h-[300px] flex-col items-center justify-center  md:h-full">
                    <Image
                      className="mt-0 md:mt-[100px]"
                      id="drag-drop-image-icon"
                    />{" "}
                    <p className="m-0 mt-4">
                      {" "}
                      Drag your files here or click in this area.
                    </p>
                    <input
                      accept="image/png, image/jpeg"
                      type="file"
                      title="Drag or click this area to upload files"
                      multiple
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ReactSortable>
        </div>
        {selectedImage && (
          <Modal showModal={selectedImage !== null} setShowModal={closeImage}>
            <PhotoDeleteModal
              toggleModal={toggleModal}
              closeImage={closeImage}
              deleteImage={deleteImage}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}
