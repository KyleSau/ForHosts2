"use client";
import { Reservation } from "@/lib/types";
import { useState } from "react";

export const paginate = (items: Reservation[], pageNumber: number, pageSize: number) => 
{
  const startIndex = (pageNumber - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};

const Pagination = (
  {items, pageSize, currentPage, onPageChange} : 
  { 
    items: number, 
    pageSize: number, 
    currentPage: number, 
    onPageChange: any
  }
) => {
  const SELECTOR_COUNT_LIM = 10; // only allow n numbered buttons at most
  const [startPgIdx, setStartPgIdx] = useState(0); //inclusive
  const [endPgIdx, setEndPgIdx] = useState(SELECTOR_COUNT_LIM); //exclusive

  const pagesCount = Math.ceil(items/pageSize);

  if(pagesCount === 1) {
    return null;
  }

  const pages = Array.from({ length: pagesCount }, (_, i) => (i + 1));

  if(pages.length === 0) {
    return null;
  }

  const inactivePageStyle = "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 \
    hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
  const activePageStyle = "z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 \
    hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white";

  function renderNumberButtons() {
    return pages.slice(startPgIdx, endPgIdx).map((page: number) => {
      //console.log("page: ", page, " currentPage: ", currentPage);
      return (
        <li>
          <a onClick={() => onPageChange(page)} 
            {...(page == currentPage) && {"aria-current": "page", "color": "red"}} 
            className={ currentPage? activePageStyle: inactivePageStyle }
          >
            {page}
          </a>
        </li> 
      );
    })
  }

  function updateNumberedRowButtons(currentPage: number, direction: boolean) {
    if(direction) { // view to the right
      if(currentPage < startPgIdx+1) {
        onPageChange(currentPage+1);
      }
      if(endPgIdx < pages.length-1) {
        setStartPgIdx(startPgIdx+1);
        setEndPgIdx(endPgIdx+1);
      }
    } else if (!direction) { // view to the left
      if(currentPage > endPgIdx+1) {
        onPageChange(currentPage-1);
      }
      if(startPgIdx > 0) {
        setStartPgIdx(startPgIdx-1);
        setEndPgIdx(endPgIdx-1);
      }
    }
  }

  return (<>
    <ul className="flex -space-x-px h-8 text-sm">
      <li>
        <a 
          onClick={() => updateNumberedRowButtons(currentPage, false)} 
          className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          <span className="sr-only">Previous</span>
          <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
          </svg>
        </a>
      </li>
      {
        renderNumberButtons()
      }
      <li>
        <a 
          onClick={() => updateNumberedRowButtons(currentPage, true)}
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          <span className="sr-only">Next</span>
          <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
          </svg>
        </a>
      </li>
    </ul>
  </>);
};

export default Pagination;
