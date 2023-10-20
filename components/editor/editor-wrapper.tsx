import React from "react";

type EditorWrapperProps = {
  children: React.ReactNode;
};

export default function EditorWrapper({ children }: EditorWrapperProps) {
  return (
    <div className=" h-auto border-stone-200 p-12 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-sm md:w-auto 2xl:w-[1250px]">
      {children}
    </div>
  );
}
