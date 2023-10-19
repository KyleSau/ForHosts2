import React from "react";

type TabTitleProps = {
  title: string;
  desc: string;
};

export default function TabTitle({ title, desc }: TabTitleProps) {
  return (
    <div className=" text-center">
      <h4 className="mt-6 text-xl font-bold text-gray-800">{title}</h4>
      <h3 className="text-md mt-2 text-gray-500">{desc}</h3>
      <hr className="my-6 w-full" />
    </div>
  );
}
