import React from "react";

type EditorTitleProps = {
  title: string;
  desc: string;
};

export default function EditorTitle({ title, desc }: EditorTitleProps) {
  return (
    <div className=" text-center">
      <h4 className="text-xl font-bold text-gray-800">{title}</h4>
      <h3 className="text-md mt-2 text-gray-500">{desc}</h3>
      <hr className="my-6 w-full" />
    </div>
  );
}
