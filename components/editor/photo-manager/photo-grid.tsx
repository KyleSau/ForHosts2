"use client";
import React, { forwardRef, useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
import BlurImage from "@/components/blur-image";
import { humanReadableFileSize, placeholderBlurhash } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { FILE_CONSTS, IMAGE_UPLOAD_QUANTITY_LIMIT, IMAGE_SIZE_LIMIT_BYTES, IMAGE_SIZE_LIMIT_MB } from '@/lib/constants';
import { Image as ImagePrismaSchema, Post } from "@prisma/client";
import { Image, Trash2, Loader2 } from 'lucide-react';
import EditorWarningModal, { EditorWarningModalDataType, EditorWarningModalDataTemplate } from "@/components/editor/warning-confirmation-modal";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { put, type BlobResult } from '@vercel/blob'; // test
import {
  uploadBlobMetadata,
  listAllBlobsInStore,
  deleteBlobFromStore,
  deleteBlobMetadata,
  deleteAndReindex,
  listAllBlobMetadata,
  updateBlobMetadata,
  swapBlobMetadata
} from '@/lib/blob_actions';

//DEV MODE
const DEBUG_TOGGLE = true;
const TOP_DRAGGABLE_AREA_TOGGLE = false;

//abstract data type used to handle file operations in this editor
interface FileDataObject extends Partial<ImagePrismaSchema> {
  file?: File | null, //for handling local-only files
  localBlobUrl?: string,
  inBlobStore: boolean,
  isUploading: boolean
}

const PERMITTED_FILE_TYPES = new Set([FILE_CONSTS.JPEG, FILE_CONSTS.PNG]);

const CustomComponent = forwardRef(function CustomComponent(props, ref) {
    return (
        <div
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            style={{
                boxSizing: "border-box",
                padding: "5px",
                height: "auto",
            }}
            // ref={ref}
        >
            {/* {props.children} */}
        </div>
    );
});

interface FileDataObject extends Partial<ImagePrismaSchema> {
    file?: File | null, //for handling local-only files
    localBlobUrl?: string,
    inBlobStore: boolean,
    isUploading: boolean
}

export default function PhotoGrid({ siteId, postId, images, currentFileDataObjects }: any) {
    //states for confirmation modal for deleting pictures
    const [fileDataObjects, setFileDataObjects] = useState<FileDataObject[]>(currentFileDataObjects);
    const [editorWarningModalOpen, setEditorWarningModalOpen] = useState<boolean>(false);
    const [editorWarningModalData, setEditorWarningModalData] = useState<EditorWarningModalDataType>(EditorWarningModalDataTemplate);
    const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);
    const [imageEaseTransition, setImageEaseTranstion] = useState<boolean>(false);
    // const [state, setState] = useState([
    //     {
    //         id: 1,
    //         name: "1",
    //         url: "https://upload.wikimedia.org/wikipedia/en/1/11/SoCal_Lashings_Logo.png",
    //         caption: "",
    //     },
    //     {
    //         id: 2,
    //         name: "2",
    //         url: "https://upload.wikimedia.org/wikipedia/en/e/e8/Callipygia.jpg",
    //         caption: "",
    //     },
    //     {
    //         id: 3,
    //         name: "3",
    //         url: "https://upload.wikimedia.org/wikipedia/en/e/e0/KAUH_logo.png",
    //         caption: "",
    //     },
    //     {
    //         id: 4,
    //         name: "4",
    //         url: "https://upload.wikimedia.org/wikipedia/en/6/6e/Okapi_large.png",
    //         caption: "",
    //     },
    //     {
    //         id: 5,
    //         name: "5",
    //         url: "https://upload.wikimedia.org/wikipedia/en/8/89/Grammy-frontcover.jpg",
    //         caption: "",
    //     },
    //     {
    //         id: 6,
    //         name: "6",
    //         url: "https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Lenna.png/220px-Lenna.png",
    //         caption: "",
    //     },
    //     {
    //         id: 7,
    //         name: "7",
    //         url: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Lenna66.png/250px-Lenna66.png",
    //         caption: "",
    //     },
    //     {
    //         id: 8,
    //         name: "8",
    //         url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1920px-Wikipedia-logo-v2.svg.png",
    //         caption: "",
    //     },
    //     {
    //         id: 9,
    //         name: "9",
    //         url: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Lenna66.png/250px-Lenna66.png",
    //         caption: "",
    //     },
    // ]);


  //TEST
    
    //TEST
    
    const [blobsFromStoreTest, setBlobsFromStoreTest] = useState<BlobResult[]>([]);
    const [blobMetadataTest, setBlobMetadataTest] = useState<ImagePrismaSchema[]>([]);

    const handleAddFilesToLocalStateViaOpenWindow = (event: any) => {
        console.log("handleAddFilesToLocalStateViaOpenWindow entered");
        event.preventDefault();
        const newFiles: Array<File> = Array.from(event.target.files as ArrayLike<File>)
            .filter((file: File) => PERMITTED_FILE_TYPES.has(file.type));
        addFilesToLocalStateAndDoUpload(newFiles);
    };

    const handleDropNewFilesToLocalState = (event: any) => {
        // console.log("handleDropNewFilesToLocalState entered");
        event.preventDefault();
        const dataTransferItems: DataTransferItemList = event.dataTransfer.items;
        let newFiles: (File | null)[] = [];
        if (dataTransferItems) {
            newFiles = Array.from(dataTransferItems)
                .filter((item: DataTransferItem) => item.kind === FILE_CONSTS.FILE && PERMITTED_FILE_TYPES.has(item.type))
                .map((item: DataTransferItem) => item.getAsFile());
        } else {
            const dataTransferFiles: FileList = event.dataTransfer.files;
            newFiles = Array.from(dataTransferFiles);
        }
        addFilesToLocalStateAndDoUpload(newFiles);
    };

    const handleDragOver = (event: any) => {
        console.log("handleDragOver entered");
        event.preventDefault();
        event.stopPropagation();
    };

    const addFilesToLocalStateAndDoUpload = async (newFiles: (File | null)[]) => {
        setUploadInProgress(true);

        //first check if adding the new files causes currently uploaded pics to surpass the upload threshold; show modal if so
        if (fileDataObjects.length > IMAGE_UPLOAD_QUANTITY_LIMIT || fileDataObjects.length + newFiles.length > IMAGE_UPLOAD_QUANTITY_LIMIT) {
            setEditorWarningModalData({
                ...editorWarningModalData,
                idxToRemove: -1,
                message: `Only ${IMAGE_UPLOAD_QUANTITY_LIMIT} images may be uploaded for this listing`
            });
            setEditorWarningModalOpen(true);
        } else {
            const newFilesAboveSizeLimit: (File | null)[] = [];
            const newFilesBelowSizeLimit: FileDataObject[] = [];
            newFiles.forEach((file: File | null, fileIdx: number) => {
                // console.log("new file: ", file);
                if (file) {
                    const fileSizeBytes = file?.size ? file.size : IMAGE_SIZE_LIMIT_BYTES;
                    if (fileSizeBytes > IMAGE_SIZE_LIMIT_BYTES) {
                        newFilesAboveSizeLimit.push(file);
                    } else {
                        const localBlobUrl = URL.createObjectURL(file);
                        // console.log("localBlobUrl: ", localBlobUrl);
                        const newFileNotStored: FileDataObject = {
                            file,
                            localBlobUrl,
                            inBlobStore: false,
                            orderIndex: fileDataObjects.length + fileIdx,
                            isUploading: true
                        }
                        newFilesBelowSizeLimit.push(newFileNotStored);
                    }
                }
            });
            const updatedFdoArray = [...fileDataObjects, ...newFilesBelowSizeLimit];
            // console.log("updatedFdoArray first time: ", updatedFdoArray);
            setFileDataObjects(updatedFdoArray);

            //if needed, throw up modal informing user that files above the size limit were not added
            if (newFilesAboveSizeLimit.length > 0) {
                const filesAndSizes = newFilesAboveSizeLimit.map((file: File | null) => `${file?.name} (${humanReadableFileSize(file?.size)})`).join("\n");
                // setEditorWarningModalData({
                //     ...editorWarningModalData,
                //     idxToRemove: -2,
                //     message: `The following files were not uploaded because they exceed the file size limit of ${IMAGE_SIZE_LIMIT_MB} MB:\n` + filesAndSizes
                // });
                // setEditorWarningModalOpen(true);
            }

            const updatedFdoArrayAfterUpload = await uploadFileDataObjects(updatedFdoArray);
            // console.log("updatedFdoArray second time: ", updatedFdoArrayAfterUpload);
            setFileDataObjects(updatedFdoArrayAfterUpload);
        }
        setUploadInProgress(false);
    };


    const uploadFileDataObjects = async (fileDataObjects: FileDataObject[]) => {
        const fileDataObjectsCopy = [...fileDataObjects];
        console.log("fileDataObjectsCopy: ", fileDataObjectsCopy);

        for (let fdoIdx: number = 0; fdoIdx < fileDataObjects.length; fdoIdx++) {
            const fdo: FileDataObject = fileDataObjects[fdoIdx];
            console.log(">>> fdo: ", fdo);
            if (fdo.inBlobStore) {
                // console.log("111111111111111111111111111111111111111");
                if (fdo?.id && fdo.orderIndex != fdoIdx) {
                    const updateBlobMetadataResponse = await updateBlobMetadata(fdo.id, { orderIndex: fdoIdx });
                    const newUpdatedFile: FileDataObject = {
                        inBlobStore: true,
                        isUploading: false,
                        ...updateBlobMetadataResponse
                    }
                    fileDataObjectsCopy[fdoIdx] = newUpdatedFile;
                }
            }
            else {
                // console.log("2222222222222222222222222222222222222222222");
                const file = fdo?.file;
                if (file) {
                    // console.log("file.name: ", file.name);
                    // Using this: https://vercel.com/docs/storage/vercel-blob/quickstart#browser-uploads 
                    const blobResult = await put(file.name, file, {
                        access: 'public',
                        handleBlobUploadUrl: '/api/upload'
                    });

                    const uploadBlobMetadataResponse = await uploadBlobMetadata(blobResult, fdoIdx, postId, siteId);
                    // console.log("uploadBlobMetadataResponse: fdoIdx: ", fdoIdx, "    responseValue: ", uploadBlobMetadataResponse);
                    const newUploadedFile: FileDataObject = {
                        inBlobStore: true,
                        isUploading: false,
                        ...uploadBlobMetadataResponse
                    }
                    fileDataObjectsCopy[fdoIdx] = newUploadedFile;
                }
            }
            setFileDataObjects(fileDataObjectsCopy); // this enables async spinner for each image 
        };
        return fileDataObjectsCopy;
    }

    const onDragEnd = (e: Sortable.SortableEvent) => {
        console.log(e.oldIndex + " -> " + e.newIndex);
    };

    // onEnd={(evt) => console.log('peanut' + evt.newIndex)}

    const aspectRatio = "16/9";

    //TEST
    const uploadFilesToBlobStoreAndMetadataToDB = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      // console.log("uploadFilesToBlobStoreAndMetadataToDB entered");
      // console.log("event: ", event);
      event.preventDefault();
      const uploadPromiseResponse = await uploadFileDataObjects(fileDataObjects);
      // console.log("uploadPromiseResponse: ", uploadPromiseResponse);
      setFileDataObjects(uploadPromiseResponse as FileDataObject[]);
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

    return (<>
            {DEBUG_TOGGLE &&
              <div>
                <p>
                  <button type="submit" className='border border-black' onClick={(event) => uploadFilesToBlobStoreAndMetadataToDB(event)}>Upload Pics to Blob Store</button>
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
            <div className="flex justify-center border p-10">
                <ReactSortable
                    // expand={false}
                    tag={CustomComponent}
                    // list={fileDataObjects}
                    // setList={setFileDataObjects}
                    onEnd={onDragEnd}
                >
                    {fileDataObjects.map((image) => (
                        <div
                            className="h-full w-[250px] rounded-lg border border-gray-300 hover:animate-pulse md:w-[400px]"
                            key={image.id}
                        >
                            <div className="relative" style={{ aspectRatio }}>
                                <div style={{ position: "relative" }}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="absolute right-2 top-2 z-10  hover:scale-110">
                                                <MoreHorizontal
                                                    size={24}
                                                    className="text-gray-400  hover:text-black"
                                                />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuCheckboxItem>Edit</DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem>
                                                Move Forward
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem>
                                                Move Backward
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem>
                                                Delete
                                            </DropdownMenuCheckboxItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="flex justify-center">
                                        <BlurImage
                                            alt={image.url ?? ""}
                                            blurDataURL={placeholderBlurhash}
                                            className="object-fit h-[200px] w-full gap-4 rounded-lg pb-1"
                                            width={200}
                                            height={200}
                                            placeholder="blur"
                                            src={image.url ?? "/placeholder.png"}
                                        />
                                    </div>
                                </div>
                                {/* <div className="bg-tranparent relative cursor-pointer rounded-lg bg-opacity-10 pt-10 text-white  hover:bg-gray-300 hover:bg-opacity-60 hover:text-opacity-100">
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
                                </div> */}
                            </div>
                        </div>
                    ))}
                </ReactSortable>
                <div className="relative flex flex-col items-center justify-center border rounded cursor-pointer hover:bg-gray-200">
                    <Image id="drag-drop-image-icon" />
                    <p className="m-0">Drag your files here or click in this area.</p>
                    <input accept="image/png, image/jpeg" type="file" title="" multiple
                        className="absolute inset-0 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
                        onDrop={handleDropNewFilesToLocalState}
                        onDragOver={handleDragOver}
                        onChange={handleAddFilesToLocalStateViaOpenWindow}
                    />
                </div>
            </div>
        
    </>);
}
