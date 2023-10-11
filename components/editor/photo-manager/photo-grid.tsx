"use client";
import React, { forwardRef, useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [state, setState] = useState([
    {
      id: 1,
      name: "1",
      url: "https://upload.wikimedia.org/wikipedia/en/1/11/SoCal_Lashings_Logo.png",
      caption: "",
    },
    {
      id: 2,
      name: "2",
      url: "https://upload.wikimedia.org/wikipedia/en/e/e8/Callipygia.jpg",
      caption: "",
    },
    {
      id: 3,
      name: "3",
      url: "https://upload.wikimedia.org/wikipedia/en/e/e0/KAUH_logo.png",
      caption: "",
    },
    {
      id: 4,
      name: "4",
      url: "https://upload.wikimedia.org/wikipedia/en/6/6e/Okapi_large.png",
      caption: "",
    },
    {
      id: 5,
      name: "5",
      url: "https://upload.wikimedia.org/wikipedia/en/8/89/Grammy-frontcover.jpg",
      caption: "",
    },
    {
      id: 6,
      name: "6",
      url: "https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Lenna.png/220px-Lenna.png",
      caption: "",
    },
    {
      id: 7,
      name: "7",
      url: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Lenna66.png/250px-Lenna66.png",
      caption: "",
    },
    {
      id: 8,
      name: "8",
      url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1920px-Wikipedia-logo-v2.svg.png",
      caption: "",
    },
    {
      id: 9,
      name: "9",
      url: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Lenna66.png/250px-Lenna66.png",
      caption: "",
    },
  ]);

  const onDragEnd = (e: Sortable.SortableEvent) => {
    console.log(e.oldIndex + " -> " + e.newIndex);
  };

  // onEnd={(evt) => console.log('peanut' + evt.newIndex)}

  const aspectRatio = "16/9";

  return (
    <div>
      <div className="border p-10">
        <ReactSortable
          expand={false}
          tag={CustomComponent}
          list={state}
          setList={setState}
          onEnd={onDragEnd}
        >
          {state.map((image) => (
            <div
              className="h-full w-full border border-gray-300"
              key={image.id}
            >
              <div
                className="relative"
                style={{ aspectRatio, overflow: "hidden" }}
              >
                <div style={{ position: "relative" }}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="absolute right-2 top-2 z-10  hover:scale-110">
                        <MoreHorizontal
                          size={24}
                          className="text-gray-400 hover:text-black"
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
                  <BlurImage
                    alt={image.url ?? ""}
                    blurDataURL={placeholderBlurhash}
                    className="object-fit h-full w-full gap-4 rounded-lg  p-2 hover:scale-105"
                    width={200}
                    height={200}
                    placeholder="blur"
                    src={image.url ?? "/placeholder.png"}
                  />
                </div>
                <div className="bg-tranparent absolute bottom-0 left-0 right-0 cursor-pointer rounded-lg bg-opacity-10 text-white transition-opacity hover:bg-gray-300 hover:bg-opacity-60 hover:text-opacity-100">
                  <input
                    type="text"
                    className="absolute bottom-0 w-full rounded-lg bg-transparent text-black focus:bg-gray-100 focus:bg-opacity-90 focus:ring-blue-300"
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
    </div>
  );
}
