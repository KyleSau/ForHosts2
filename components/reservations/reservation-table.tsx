"use client";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { RESERVATION_STATUS } from "@/lib/types";

interface Reservation {
  [key: string]: any;
}

interface ReservationTableProps {
  data: Reservation[];
}


// const ReservationTable: React.FC = ({ data }: any) => {
const ReservationTable: React.FC<ReservationTableProps> = ({ data }) => {

  const handleTableStyleFormatting = (
    fieldIdx: number,
    fieldName: string | number,
    fieldValue: any
  ) => {
    if (fieldName === "status") {
      let statusIcon = undefined;

      switch (fieldValue) {
        case RESERVATION_STATUS.CONFIRMED:
          statusIcon = <CheckCircle color="#00ff40" />;
          break;
        case RESERVATION_STATUS.PENDING:
          statusIcon = <Clock color="#fffa3c" />;
          break;
        case RESERVATION_STATUS.CANCELLED:
          statusIcon = <XCircle color="#ff0000" />;
          break;
        default:
          break;
      }

      return (
        <td
          key={fieldIdx}
          className="px-2 sm:px-6 py-4 text-center border-r"
        >
          <div className="flex flex-row justify-stretch">
            {statusIcon}
            {fieldValue}
          </div>
        </td>
      );
    } else if (fieldValue instanceof Date) {
      return (
        <td
          key={fieldIdx}
          className="px-2 sm:px-6 py-4 text-center border-r"
        >
          {fieldValue.toUTCString()}
        </td>
      );
    } else {
      return (
        <td
          key={fieldIdx}
          className="px-2 sm:px-6 py-4 text-center border-r"
        >
          {fieldValue}
        </td>
      );
    }
  };

  return (
    <div className="overflow-x-auto lg:overflow-visible w-full lg:w-auto">
      <table className="min-w-full divide-y divide-gray-200 border-collapse lg:w-auto">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
            >
              #
            </th>
            <th
              scope="col"
              className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
            >
              Listing
            </th>
            <th
              scope="col"
              className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
            >
              Start
            </th>
            <th
              scope="col"
              className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
            >
              End
            </th>
            <th
              scope="col"
              className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
            >
              Created
            </th>
            <th
              scope="col"
              className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
            >
              Updated
            </th>
          </tr>
        </thead>
        <tbody className="text-white divide-y divide-gray-200">
          {data?.map((reservation: Reservation, idx: number) => {
            return (
              <tr className="hover:bg-gray-500" key={idx}>
                <td className="px-2 sm:px-6 py-4 text-center border-r">
                  {idx + 1}
                </td>
                <td className="px-2 sm:px-6 py-4 text-center border-r">
                  {reservation.post.title}
                </td>
                {handleTableStyleFormatting(0, "status", reservation.status)}
                {handleTableStyleFormatting(1, "start", reservation.startDate)}
                {handleTableStyleFormatting(2, "end", reservation.endDate)}
                {handleTableStyleFormatting(3, "created", reservation.createdAt)}
                {handleTableStyleFormatting(4, "updated", reservation.updatedAt)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
