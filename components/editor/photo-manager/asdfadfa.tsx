"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import { Loader2, MoreHorizontal, Star } from "lucide-react";
import { Image } from "@prisma/client";
import { Image as ImagePrismaSchema, Post } from '@prisma/client';
// import { Image } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modal from "@/components/modal";
import { toast } from "sonner";
import PhotoDeleteModal from "./photo-delete-modal";
import { FILE_CONSTS } from "@/lib/constants";
import { uploadBlobMetadata } from "@/lib/blob_actions";
import { put } from "@vercel/blob";
import PhotoUploader from "./photo-uploader";
const CustomComponent = forwardRef(function CustomComponent(props, ref) {
  return (
    <div
      className="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3 grid-rows-[300px] md:grid-rows-[300px] 2xl:grid-rows-[300px]"
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

interface PhotoGridProps {
  images: Image[];
  postId: string;
  siteId: string;
}

interface FileDataObject extends Partial<ImagePrismaSchema> {
  file?: File | null;
  localBlobUrl?: string;
  inBlobStore: boolean;
  isUploading?: boolean;
}

interface MappedImage {
  id: number;
  name: string;
  url: string;
  caption: string | null;
  isCoverPhoto: boolean;
  inBlobStore: boolean;
  isUploading: boolean;
}

export default function asdfasdfa({ images, postId, siteId }: PhotoGridProps) {
  const [fileDataObjects, setFileDataObjects] = useState<FileDataObject[]>([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [coverPhotoID, setCoverPhotoID] = useState(0);
  const [mappedImages, setMappedImages] = useState<MappedImage[]>([]);

  // useEffect(() => {
  //   const newMappedImages = images.map((image, i) => {
  //     console.log('N: ', JSON.stringify(image));
  //     return {
  //       id: image.orderIndex,  // Assuming sortIdx is the value you want to use for id
  //       name: i.toString(),
  //       url: image.url,
  //       caption: image.caption,
  //       isCoverPhoto: i == 0,
  //       inBlobStore: true,
  //       isUploading: false,
  //     };
  //   });
  //   setMappedImages(newMappedImages);
  // }, [images]);

  const uploadCard = {
    id: "upload-card",
    name: "Upload Card",
  };

  const onDragEnd = (e: Sortable.SortableEvent) => {
    console.log(e.oldIndex + " -> " + e.newIndex);
  };


  const moveForward = (index: any) => {
    if (index < mappedImages.length - 1) {
      const newState = [...mappedImages];
      const temp = newState[index];
      newState[index] = newState[index + 1];
      newState[index + 1] = temp;

      setMappedImages(newState);
    } else {
      toast.error("You can't move the image forward any further!");
    }
  };

  const moveBackward = (index: any) => {
    if (index > 0) {
      const newState = [...mappedImages];
      const temp = newState[index];
      newState[index] = newState[index - 1];
      newState[index - 1] = temp;
      // setDummyData(newState);
      setMappedImages(newState);
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
    const newState = mappedImages.map((item, i) => ({
      ...item,
      isCoverPhoto: i === index,
    }));
    setMappedImages(newState);
    // setDummyData(newState);
    setCoverPhotoID(mappedImages[index].id);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const PERMITTED_TYPES = [FILE_CONSTS.FILE, FILE_CONSTS.JPEG, FILE_CONSTS.PNG];

    const newFiles = Array.from(event.target.files ?? [])
      .filter(file => PERMITTED_TYPES.includes(file.type));

    const initialBlobDataArray = newFiles.map((file, index) => {
      const localBlobUrl = URL.createObjectURL(file);
      return {
        file,
        localBlobUrl,
        inBlobStore: false,
        orderIndex: fileDataObjects.length + index,
        isUploading: true,
      };
    });

    const updatedFileDataObjects = [...fileDataObjects, ...initialBlobDataArray];

    const initialMappedImagesArray = newFiles.map((file, index) => ({
      id: updatedFileDataObjects.length + index,
      name: (updatedFileDataObjects.length + index).toString(),
      url: URL.createObjectURL(file),
      caption: '',
      isCoverPhoto: false,
      inBlobStore: false,
      isUploading: true,
    }));

    setFileDataObjects(updatedFileDataObjects);
    setMappedImages(prevArray => [...prevArray, ...initialMappedImagesArray]);

    // Define an async function to handle the upload of a single file
    const uploadSingleFile = async (fdo: FileDataObject, arrayIndex: number) => {

      // try {
      const file = fdo.file;

      if (!file)
        return;

      const pathname = file.name;

      console.log('pathname: ', pathname);
      console.log('file: ', file);

      const blobResult = await put(pathname, file, {
        access: 'public',
        handleBlobUploadUrl: '/api/upload'
      });

      const updatedMetadata = await uploadBlobMetadata(blobResult, arrayIndex, postId, siteId);

      // Update the state for this specific blob data
      setFileDataObjects(prevArray => {
        const updatedBlobData = {
          ...fdo,
          ...updatedMetadata,
          inBlobStore: true,
          url: blobResult.url,
          isUploading: false,
        };

        console.log('id: is it a guid? ', updatedBlobData.id);
        console.log('orderIdx: ', updatedBlobData.orderIndex);
        debugger;
        // here: setMappedImages
        const newArray = [...prevArray];
        newArray[arrayIndex] = updatedBlobData;

        const updatedMappedImages = [...mappedImages, {
          id: updatedBlobData.orderIndex,
          name: newArray.length.toString(),
          url: updatedBlobData.url,
          caption: updatedBlobData.caption,
          isCoverPhoto: newArray.length === 1,  // Assuming the first image is the cover photo
          inBlobStore: true,
          isUploading: false,
        }];

        setMappedImages(updatedMappedImages);
        return newArray;
      });

      // } catch (error) {
      //   console.error('Error uploading file:', error);

      //   setBlobDataArray(prevArray => {
      //     const updatedBlobData = {
      //       ...blobData,
      //       isUploading: false,
      //     };
      //     const newArray = [...prevArray];
      //     newArray[arrayIndex] = updatedBlobData;
      //     return newArray;
      //   });
      // }
    };

    initialBlobDataArray.forEach((fdo, index) => {
      const arrayIndex = fileDataObjects.length + index;
      uploadSingleFile(fdo, arrayIndex);
    });
  };

  return (
    <div>
      {/* <BlobUploader onFileUpload={handleFileUpload} /> */}
      <div className="w-auto border p-10">
        <h1 className=" text-start text-4xl font-bold">Photo Manager</h1>
        <h2 className="text-md mb-4 text-start text-gray-500">
          Manage your listing&apos;s photos
        </h2>
        <hr className="pb-6" />
        <div className="flex justify-start gap-8">
          <ReactSortable
            tag={CustomComponent}
            list={mappedImages}
            setList={setMappedImages}
            onEnd={onDragEnd}
          >
            {mappedImages.map((image, index) => (
              <div
                className=" w-full border"
                key={image.id}
              >
                <div className="relative">
                  <div style={{ position: "relative" }}>
                    {image.isUploading && !image.inBlobStore ? (
                      <button type="button" className="z-10">
                        <Loader2 className="animate-spin" />
                      </button>
                    ) : (
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
                    )}
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
                  {/* <div className="bg-tranparent relative cursor-pointer bg-opacity-10 pt-10 text-white hover:bg-gray-300 hover:bg-opacity-60 hover:text-opacity-100">
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
                  </div> */}
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
                    {/* <Image
                      className="mt-0 md:mt-[100px]"
                      id="drag-drop-image-icon"
                    />{" "} */}
                    <p className="m-0 mt-4">
                      {" "}
                      Drag your files here or click in this area.
                    </p>
                    <PhotoUploader onFileUpload={handleFileUpload} />
                    {/* <input
                      accept="image/png, image/jpeg"
                      type="file"
                      title="Drag or click this area to upload files"
                      multiple
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    /> */}
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
