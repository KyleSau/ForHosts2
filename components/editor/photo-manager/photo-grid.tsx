"use client"
import React, { forwardRef, useState } from "react";
import "./styles.css";
import { ReactSortable, Sortable } from "react-sortablejs";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";

const CustomComponent = forwardRef((props, ref) => {
    return (
        <div
            className="forward-ref"
            style={{
                boxSizing: "border-box",
                padding: "5px",
                border: "1px solid green"
            }}
            ref={ref}
        >
            {props.children}
        </div>
    );
});

export default function PhotoGrid({ images }) {
    const [state, setState] = useState([
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 4, name: "4" },
        { id: 5, name: "5" },
        { id: 6, name: "6" },
        { id: 7, name: "7" },
        { id: 8, name: "8" },
        { id: 9, name: "9" },
        { id: 10, name: "10" },
        { id: 11, name: "11" },
        { id: 12, name: "12" }
    ]);

    const onDragEnd = (e: Sortable.SortableEvent) => {
        console.log(e.oldIndex + ' -> ' + e.newIndex);
    }

    // onEnd={(evt) => console.log('peanut' + evt.newIndex)}

    return (
        <div className="grid grid-cols-1 gap-4">
            <ReactSortable
                expand={false}
                tag={CustomComponent}
                list={state}
                setList={setState}
                onEnd={onDragEnd}
            >
                {images.map((image) => (
                    <div className="col-span-1" key={image.id}>
                        <BlurImage
                            alt={image.url ?? ""}
                            blurDataURL={image.blurHash ?? placeholderBlurhash}
                            className="h-full w-full object-cover group-hover:scale-105 group-hover:duration-300"
                            width={500}
                            height={500}
                            placeholder="blur"
                            src={image.url ?? "/placeholder.png"}
                        />
                    </div>
                ))}
            </ReactSortable>
        </div>
    );
};
