"use client"
import React, { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Reservation } from "@/lib/types";
import Pagination, { paginate } from "../pagination";

const RESERVATION_STATUS = {
  ALL: "all",
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED"
}

const getStatusIcon = (status: string) => {
  let icon = null;
  switch (status) {
    case RESERVATION_STATUS.CONFIRMED:
      icon = <CheckCircle color="#00ff40" />;
      break;
    case RESERVATION_STATUS.PENDING:
      icon = <Clock color="#fffa3c" />;
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

const ReservationTable: React.FC<{ reservations: Reservation[] }> = ({
  reservations,
}) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<"all" | "CONFIRMED" | "PENDING" | "CANCELLED">("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  }

  const filteredReservations = filterType === "all" ? reservations : reservations.filter(reservation => reservation.status === filterType);

  const sortedReservations = filteredReservations.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.createdAt.getTime() - b.createdAt.getTime();
    } else {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const paginatedReservations = paginate(sortedReservations, currentPage, pageSize);

  return (
    <div className="overflow-x-auto lg:overflow-visible w-full lg:w-auto">
      <div className="mb-4">
        <label htmlFor="filterSelect" className="mr-2 font-medium text-gray-600">Filter:</label>
        <select
          id="filterSelect"
          className="px-2 py-1 border rounded-md bg-white text-gray-800"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "all" | "CONFIRMED" | "PENDING" | "CANCELLED")}
        >
          <option value="all">All</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button
          className="ml-4 px-2 py-1 border rounded-md bg-white text-gray-800"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
        </button>
        <Pagination 
          items={sortedReservations.length} 
          pageSize={pageSize} 
          currentPage={currentPage} 
          onPageChange={onPageChange}
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200 border-collapse lg:w-auto">
        <thead className="bg-gray-50">
          <tr>
            {[
              "#",
              "Listing",
              "Status",
              "Start",
              "End",
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
        <tbody className="text-white divide-y divide-gray-200">
          {paginatedReservations.map((reservation, idx) => (
            <tr className="hover:bg-gray-500" key={idx}>
              <td className="px-2 sm:px-6 py-4 text-center border-r">
                {idx+1}
              </td>
              <td className="px-2 sm:px-6 py-4 text-center border-r">
                {reservation.post.title}
              </td>
              <td className="px-2 sm:px-6 py-4 text-center border-r">
                {getStatusIcon(reservation.status)}
              </td>
              <td className="px-2 sm:px-6 py-4 text-center border-r">
                {reservation.startDate.toUTCString()}
              </td>
              <td className="px-2 sm:px-6 py-4 text-center border-r">
                {reservation.endDate.toUTCString()}
              </td>
              <td className="px-2 sm:px-6 py-4 text-center border-r">
                {reservation.createdAt.toUTCString()}
              </td>
              <td className="px-2 sm:px-6 py-4 text-center border-r">
                {reservation.updatedAt.toUTCString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
