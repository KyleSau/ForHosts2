"use client"
import React, { forwardRef, useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
import BlurImage from "@/components/blur-image";
import { placeholderBlurhash } from "@/lib/utils";

const CustomComponent = forwardRef((props, ref) => {
    return (
        <div
            className="grid md:grid-cols-3 grid-cols-1 gap-4"
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
        { id: 1, name: "1", url: images[0].url, primary: true, caption: 'bedroom' },
        { id: 2, name: "2", url: images[1].url },
        { id: 3, name: "3", url: images[2].url },
        { id: 4, name: "4", url: images[0].url },
        { id: 5, name: "5", url: images[1].url },
        { id: 6, name: "6", url: images[2].url },
        { id: 7, name: "7", url: images[0].url },
        { id: 8, name: "8", url: images[1].url },
        { id: 9, name: "9", url: images[2].url },
    ]);

    const onDragEnd = (e: Sortable.SortableEvent) => {
        console.log(e.oldIndex + ' -> ' + e.newIndex);
    }

    // onEnd={(evt) => console.log('peanut' + evt.newIndex)}

    return (
        <div>
            <div className="">
                <ReactSortable
                    expand={false}
                    tag={CustomComponent}
                    list={state}
                    setList={setState}
                    onEnd={onDragEnd}
                >
                    {state.map((image) => (
                        <div className="" key={image.id}>
                            {/* {image.name} */}
                            <BlurImage
                                alt={image.url ?? ""}
                                blurDataURL={placeholderBlurhash}
                                className="h-full w-full object-cover group-hover:scale-105 group-hover:duration-300"
                                width={500}
                                height={500}
                                placeholder="blur"
                                src={image.url ?? "/placeholder.png"}
                            />
                            Add Caption
                        </div>
                    ))}
                </ReactSortable >
            </div>
        </div >
    );
};
