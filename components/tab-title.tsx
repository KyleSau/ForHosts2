import React from "react";

interface TabTitleProps {
  title: string;
  desc: string;
}

export default function TabTitle({ title, desc }: TabTitleProps) {
  return (
    <div>
      <h4 className="mt-10 text-base font-bold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm leading-6 text-gray-600">{desc}</p>
    </div>
  );
}
