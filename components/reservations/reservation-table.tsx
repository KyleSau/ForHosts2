"use client"
import React, { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Reservation } from "@/lib/types";
import Pagination, { paginate } from "../pagination";
import { RESERVATION_STATUS } from "@/lib/constants";
import Image from "next/image";
import { Tooltip } from "@mui/material";
import { useDebounce } from "use-debounce";
import { createCleanQueryList } from "@/lib/utils";

const getStatusIcon = (status: string) => {
  let icon = null;
  switch (status) {
    case RESERVATION_STATUS.CONFIRMED:
      icon = <CheckCircle color="#00ff40" />;
      break;
    case RESERVATION_STATUS.PENDING:
      icon = <Clock color="#dbb042" />;
      break;
    case RESERVATION_STATUS.CANCELLED:
      icon = <XCircle color="#ff0000" />;
      break;
    default:
      // If the status is not one of the predefined cases, return null or any other default value
      icon = null;
      break;
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {icon}
      <span style={{ marginLeft: "0.5rem" }}>{status}</span>
    </div>
  );
};

const generateTableRows = (paginatedReservations: Reservation[]) => {
  return (
    <tbody className="text-black divide-y divide-gray-200">
      {paginatedReservations.map((reservation: Reservation, idx: number) => (
        <tr className="hover:bg-gray-500" key={idx}>
          <td className="px-2 sm:px-6 py-2 text-center border-r">
            {reservation.post.title}
          </td>
          <td className="px-2 sm:px-6 py-2 text-center border-r">
            {reservation.id}
          </td>
          <td className="px-2 sm:px-6 py-2 text-center border-r">
            {getStatusIcon(reservation.status)}
          </td>
          <td className="px-2 sm:px-6 py-2 text-center border-r">
            {reservation.startDate.toUTCString()}
          </td>
          <td className="px-2 sm:px-6 py-2 text-center border-r">
            {reservation.endDate.toUTCString()}
          </td>
          <td className="px-2 sm:px-6 py-2 text-center border-r">
            {reservation.createdAt.toUTCString()}
          </td>
          <td className="px-2 sm:px-6 py-2 text-center border-r">
            {reservation.updatedAt.toUTCString()}
          </td>
        </tr>
      ))}
    </tbody>
  );
}

const ReservationTable: React.FC<{ reservations: Reservation[] }> = ({
  reservations,
}) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<"all" | "CONFIRMED" | "PENDING" | "CANCELLED">("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tableRowLimit, setTableRowLimit] = useState(10);

  const [listingIdInput, setListingIdInput] = useState("");
  const [listingIdInputDebounced] = useDebounce(listingIdInput, 1000);

  const [listingNameInput, setListingNameInput] = useState("");
  const [listingNameInputDebounced] = useDebounce(listingNameInput, 1000);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  }

  let filteredReservations = reservations;

  //filter by status
  filteredReservations = (filteredReservations.length > 0) ?
    filterType === "all" ? reservations : reservations.filter(reservation => reservation.status === filterType)
    : [];

  //filter by listing id
  if (filteredReservations.length > 0) {
    const queryList = createCleanQueryList(listingIdInputDebounced);
    filteredReservations = filteredReservations.filter((reservation: Reservation) =>
      (queryList.length > 0) ? queryList.some(query => reservation.id.includes(query))
        : true);
  }

  //filter by listing name
  if (filteredReservations.length > 0) {
    const queryList = createCleanQueryList(listingNameInputDebounced);
    filteredReservations = filteredReservations.filter((reservation: Reservation) =>
      (queryList.length > 0) ? queryList.some(query => reservation.post.title.includes(query))
        : true);
  }

  //sort by creation date
  const sortedReservations = (filteredReservations.length > 0) ?
    filteredReservations?.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.createdAt.getTime() - b.createdAt.getTime();
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    })
    : filteredReservations;

  //paginate
  const paginatedReservations = paginate(sortedReservations, currentPage, tableRowLimit);

  return (
    <div className="overflow-x-auto lg:overflow-visible w-full lg:w-auto">
      <div className="flex flex-auto mb-4">
        <div className="justify-start">
          <label htmlFor="filterSelect" className="mr-2 font-medium text-gray-600">Status:</label>
          <Tooltip title="Filter by STATUS">
            <select
              id="filterSelect"
              className="px-2 py-1 border rounded-md bg-white text-gray-800 w-[120px]"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "CONFIRMED" | "PENDING" | "CANCELLED")}
            >
              <option value="all">All</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </Tooltip>
          <Tooltip title="Sort on CREATED date">
            <button
              className="ml-4 px-2 py-1 border rounded-md bg-white text-gray-800"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
            </button>
          </Tooltip>

          <Tooltip title="Start typing or paste a LISTING NAME">
            <input id="listing-name-filter-input" type="text" name="listing-name-filter-input" placeholder="Filter by LISTING NAME"
              className="ml-4 mt-1 px-2 py-1 border rounded-md bg-white text-gray-800 w-64"
              onChange={(event) => setListingNameInput(event.target.value)}
            ></input>
          </Tooltip>

          <Tooltip title="Start typing or paste a LISTING ID">
            <input id="listing-id-filter-input" type="text" name="listing-id-filter-input" placeholder="Filter by LISTING ID"
              className="ml-4 mt-1 px-2 py-1 border rounded-md bg-white text-gray-800 w-64"
              onChange={(event) => setListingIdInput(event.target.value)}
            >
            </input>
          </Tooltip>
        </div>

        <div className="flex flex-auto justify-end">
          <label htmlFor="num-of-items-adjuster" className="mr-2 mt-1 font-medium text-gray-600">Number of Items:</label>
          <select id="num-of-items-adjuster" className="px-2 py-1 border rounded-md bg-white text-gray-800 w-[80px]"
            onChange={(selection) => setTableRowLimit(parseInt(selection.target.value))}
          >
            <option defaultValue="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200 border-collapse lg:w-auto">
        <thead className="bg-gray-50">
          <tr>
            {[
              "Listing Name",
              "Listing ID",
              "Status",
              "Check-in Time",
              "Check-out Time",
              "Created",
              "Updated",
            ].map((header, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {
          (paginatedReservations.length == 0) ?
            <tbody></tbody> :
            generateTableRows(paginatedReservations)
        }
      </table>
      {
        (paginatedReservations.length == 0) &&
        <div className="flex flex-col items-center space-x-4">
          <h1 className="font-cal text-4xl mt-5">No Reservations Yet</h1>
          <Image
            alt="missing post"
            src="https://illustrations.popsy.co/gray/digital-nomad.svg"
            width={400}
            height={400}
          />
          <p className="text-lg text-stone-500">
            You do not have any reservations yet. Create one to get started.
          </p>
        </div>
      }
      <Pagination
        items={sortedReservations.length}
        pageSize={tableRowLimit}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div >
  );
};

export default ReservationTable;
