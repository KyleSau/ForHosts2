import { Prisma } from "@prisma/client";
import React from "react";

interface Reservation {
  [key: string]: any;
}

interface Props {
  reservations: Reservation[];
}

const ReservationTable: React.FC<Props> = ({ reservations }) => {

  const a = "force--";

  const resFields = Prisma.dmmf.datamodel.models.find(
    (model) => model.name === "Reservation"
  )?.fields;

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
            {resFields?.map((field, fieldIdx) => (
              <th
                scope="col"
                key={fieldIdx}
                className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
              >
                {field.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white divide-y divide-gray-200">
          {reservations.map((reservation: Reservation, idx: number) => (
            <tr className="hover:bg-gray-500" key={idx}>
              <td className="px-2 sm:px-6 py-4 text-center border-r">{idx}</td>
              {resFields?.map((field, fieldIdx) => {
                type ObjectKey = keyof typeof reservation;
                const fieldName = field.name as ObjectKey;
                return (
                  <td
                    key={fieldIdx}
                    className="px-2 sm:px-6 py-4 text-center border-r"
                  >
                    {reservation[fieldName]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
