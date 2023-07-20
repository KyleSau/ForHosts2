import { Reservation } from "@/lib/types";

export const paginate = (items: Reservation[], pageNumber: number, pageSize: number) => 
{
  const startIndex = (pageNumber - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
 };

const Pagination = (
  {items, pageSize, currentPage, onPageChange} : 
  { items: number, 
    pageSize: number, 
    currentPage: number, 
    onPageChange: any
  }
) => {
  const pagesCount = Math.ceil(items/pageSize);
  console.log("pagesCount: ", pagesCount);

  if(pagesCount === 1) {
    return null;
  }

  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
  console.log("pagination.tsx: pages: ", pages);
  
  const pageItemActiveStyle = "flex justify-center items-center text-white";
  const pageItemStyle = "flex justify-center items-center text-white";
  const pageLinkStyle = "cursor-pointer";

  return (
    <div>
    <ul className="flex justify-between items-center list-none">
      {pages.map((page) => (
        <li
          key={page}
          className={page === currentPage ? pageItemActiveStyle : pageItemStyle}
        >
          <a className={pageLinkStyle} onClick={() => onPageChange(page)}>
            {page}
          </a>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default Pagination;
