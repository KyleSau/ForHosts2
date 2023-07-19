import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Reservation } from "@/lib/types";

const getStatusIcon = (status: string) => {
  let icon = null;
  switch (status) {
    case "CONFIRMED":
      icon = <CheckCircle color="#00ff40" />;
      break;
    case "PENDING":
      icon = <Clock color="#fffa3c" />;
      break;
    case "CANCELLED":
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
}) => (
  <div className="overflow-x-auto lg:overflow-visible w-full lg:w-auto">
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
        {reservations?.map((reservation, idx) => (
          <tr className="hover:bg-gray-500" key={idx}>
            <td className="px-2 sm:px-6 py-4 text-center border-r">
              {idx + 1}
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

export default ReservationTable;
