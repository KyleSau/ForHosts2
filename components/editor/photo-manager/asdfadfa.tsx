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
import {
  uploadBlobMetadata, 
  listAllBlobsInStore, 
  deleteBlobFromStore, 
  deleteBlobMetadata,
  deleteAndReindex,
  listAllBlobMetadata,
  updateBlobMetadata,
  // swapBlobMetadata
} from '@/lib/blob_actions';
import { put, type BlobResult } from '@vercel/blob'; // test
// import BlobUploader from "./blob-uploader";

//DEV MODE
const DEBUG_TOGGLE = true;

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

// interface MappedImage {
//   id: number;
//   name: string;
//   url: string;
//   caption: string | null;
//   isCoverPhoto: boolean;
//   inBlobStore: boolean;
//   isUploading: boolean;
// }

export default function PhotoGrid({ images, postId, siteId }: PhotoGridProps) {

  console.log("images (top of PhotoGrid): ", images);

  const PERMITTED_FILE_TYPES = new Set([FILE_CONSTS.BMP, FILE_CONSTS.JPEG, FILE_CONSTS.PNG]);
  const [fileDataObjects, setFileDataObjects] = useState<FileDataObject[]>([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [coverPhotoID, setCoverPhotoID] = useState(0);
  // const [mappedImages, setMappedImages] = useState<MappedImage[]>([]);

  //TEST
  const [blobsFromStoreTest, setBlobsFromStoreTest] = useState<BlobResult[]>([]);
  const [blobMetadataTest, setBlobMetadataTest] = useState<ImagePrismaSchema[]>([]);

  useEffect(() => {
    const currentFileDataObjects = images.map(
      (blobMetadata: any & { post: any | null }) => {
        const fileDataObject: FileDataObject = {
          inBlobStore: true,
          isUploading: false,
          ...blobMetadata
        }
        return fileDataObject;
      }
    );
    
    setFileDataObjects(currentFileDataObjects);
  }, [images]);

  const uploadCard = {
    id: "upload-card",
    name: "Upload Card",
  };

  const onDragEnd = (e: Sortable.SortableEvent) => {
    console.log(e.oldIndex + " -> " + e.newIndex);
  };

  const moveForward = (index: any) => {
    if (index < fileDataObjects.length - 1) {
      const newState = [...fileDataObjects];
      const temp = newState[index];
      newState[index] = newState[index + 1];
      newState[index + 1] = temp;
      // setDummyData(newState);
      setFileDataObjects(newState);
    } else {
      toast.error("You can't move the image forward any further!");
    }
  };

  const moveBackward = (index: any) => {
    if (index > 0) {
      const newState = [...fileDataObjects];
      const temp = newState[index];
      newState[index] = newState[index - 1];
      newState[index - 1] = temp;
      // setDummyData(newState);
      setFileDataObjects(newState);
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
    const newState = fileDataObjects.map((item, i) => ({
      ...item,
      isCoverPhoto: i === index,
    }));
    setFileDataObjects(newState);
    // setDummyData(newState);
    setCoverPhotoID(index);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileUpload called");

    const newFiles = Array.from(event.target.files ?? [])
      .filter(file => PERMITTED_FILE_TYPES.has(file.type));

    const newFileDataObjects: FileDataObject[] = newFiles.map((file, index) => {
      const localBlobUrl = URL.createObjectURL(file);
      return {
        file,
        localBlobUrl,
        inBlobStore: false,
        orderIndex: fileDataObjects.length + index,
        isUploading: true,
      };
    });

    const updatedFileDataObjects = [...fileDataObjects, ...newFileDataObjects];
    setFileDataObjects(updatedFileDataObjects);

    for (let fdoIdx: number = 0; fdoIdx < newFileDataObjects.length; fdoIdx++) {
      const fdoToUpload: FileDataObject = newFileDataObjects[fdoIdx];
      const fileToUpload = fdoToUpload?.file;
      const fileOrderIndex = fdoToUpload?.orderIndex;
      
      if (fileToUpload && fileOrderIndex !== undefined) {
        // console.log("file.name: ", file.name);
        // Using this: https://vercel.com/docs/storage/vercel-blob/quickstart#browser-uploads 
        const blobResult = await put(fileToUpload.name, fileToUpload, {
          access: 'public',
          handleBlobUploadUrl: '/api/upload'
        });

        const uploadBlobMetadataResponse = await uploadBlobMetadata(blobResult, fileOrderIndex, postId, siteId);
        // console.log("uploadBlobMetadataResponse: fdoIdx: ", fdoIdx, "    responseValue: ", uploadBlobMetadataResponse);
        const newUploadedFdo: FileDataObject = {
          inBlobStore: true,
          isUploading: false,
          ...uploadBlobMetadataResponse
        }
        
        updatedFileDataObjects[fileOrderIndex] = newUploadedFdo;
        setFileDataObjects(updatedFileDataObjects); // this enables async spinner for each image 
      }
    }
  };

  // // Define an async function to handle the upload of a single file
  // const uploadSingleFile = async (fdo: FileDataObject, arrayIndex: number) => {

  //   // try {
  //   const file = fdo.file;
  //   console.log('file: ', file);

  //   if (!file)
  //     return;

  //   const pathname = file.name;
  //   console.log('pathname: ', pathname);

  //   const blobResult = await put(pathname, file, {
  //     access: 'public',
  //     handleBlobUploadUrl: '/api/upload'
  //   });

  //   const uploadedMetadata = await uploadBlobMetadata(blobResult, postId, siteId);

  //   // Update the state for this specific blob data
  //   setFileDataObjects(prevFdos => {
  //     const updatedBlobData = {
  //       ...fdo,
  //       ...uploadedMetadata,
  //       inBlobStore: true,
  //       url: blobResult.url,
  //       isUploading: false,
  //     };

  //     console.log('id: is it a guid? ', updatedBlobData.id);
  //     console.log('orderIdx: ', updatedBlobData.orderIndex);

  //     const newFdos = [...prevFdos];
  //     newFdos[arrayIndex] = updatedBlobData;
  //     return newFdos;
  //   });
  // };


  //TEST
  const handleListAllblobsInStore = async () => {
    console.log("[TEST] handleListAllblobsInStore called");
    const blobsInStore = await listAllBlobsInStore();
    console.log("listCurrentBlobsInStore: blobsInStore: ", blobsInStore);
    setBlobsFromStoreTest(blobsInStore);
  };

  //TEST
  const handlePurgeAllBlobsInStore = async () => {
    console.log("[TEST] handlePurgeAllBlobsInStore called");
    blobsFromStoreTest.forEach((br: BlobResult) => {
      if (br.url) {
        const url = br.url;
        const response = deleteBlobFromStore(url);
        response.then((responseJson: any) => {
          console.log("handlePurgeAllBlobsInStore responseJson: ", responseJson);
        });
      }
    });
  };

  //TEST
  const printOutData = async () => {
    console.log("[TEST] printOutData called");
    console.log("fileDataObjects: ", fileDataObjects);
  }

  //TEST
  const handleListBlobMetadata = async () => {
    console.log("[TEST] handleListBlobMetadata called");
    const allBlobMetadata = await listAllBlobMetadata();
    console.log("allBlobMetadata: ", allBlobMetadata);
    setBlobMetadataTest([...allBlobMetadata]);
  };

  //TEST
  const handlePurgeAllBlobMetadata = async () => {
    console.log("[TEST] handlePurgeAllBlobMetadata entered");
    blobMetadataTest.forEach((imgObj: ImagePrismaSchema) => {
      const response = deleteBlobMetadata(imgObj.id);
      // console.log("response: ", response);
      response.then((value: ImagePrismaSchema) => {
        // console.log("value deleted: ", value);
      });
    })
  };

  //TEST
  // const uploadFilesToBlobStoreAndMetadataToDB = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   // console.log("uploadFilesToBlobStoreAndMetadataToDB entered");
  //   // console.log("event: ", event);
  //   event.preventDefault();
  //   const uploadPromiseResponse = await uploadFileDataObjects(fileDataObjects);
  //   // console.log("uploadPromiseResponse: ", uploadPromiseResponse);
  //   setFileDataObjects(uploadPromiseResponse as FileDataObject[]);
  // };

  return (<>
    { DEBUG_TOGGLE &&
      <div>
        <p>
          {/* <button type="submit" className='border border-black' onClick={(event) => uploadFilesToBlobStoreAndMetadataToDB(event)}>Upload Pics to Blob Store</button> */}
          &nbsp;
          <button type="submit" className='border border-black' onClick={printOutData}>Print Local Data to Console</button>
        </p>
        <p>
          <button type="submit" className='border border-black' onClick={handleListBlobMetadata}>List All Blob Metadata</button>
          <button type="submit" className='border border-black' onClick={handlePurgeAllBlobMetadata}>Purge All Blob Metadata</button>
          &nbsp;
          <button type="submit" className='border border-black' onClick={handleListAllblobsInStore}>List All Blobs In Store</button>
          <button type="submit" className='border border-black' onClick={handlePurgeAllBlobsInStore}>Purge All Blobs In Store</button>
        </p>
      </div>
    }

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
            list={fileDataObjects}
            setList={setFileDataObjects}
            onEnd={onDragEnd}
          >
            {fileDataObjects.map((fdo, index) => (
              <div
                className=" w-full border"
                key={fdo.id}
              >
                <div className="relative">
                  <div style={{ position: "relative" }}>
                    {fdo.isUploading && !fdo.inBlobStore ? (
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
                            onClick={() => toggleModal(fdo)}
                          >
                            Delete
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    {/* {fdo.isCoverPhoto && coverPhotoID !== null && (
                      <div className="absolute left-2 top-2 z-10">
                        <Star size={32} className=" text-yellow-500" />
                      </div>
                    )} */}
                    <div className="flex justify-center ">
                      <BlurImage
                        alt={fdo.url ?? ""}
                        blurDataURL={placeholderBlurhash}
                        className="object-fit h-[300px] w-full pb-1"
                        width={200}
                        height={200}
                        placeholder="blur"
                        src={fdo.url ?? "/placeholder.png"}
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
    </>);
}
