"use client";
import { Prisma } from "@prisma/client";
import React from "react";
import { useState, useEffect } from "react";
import { getReservationFields, getReservations } from "@/lib/actions";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { RESERVATION_STATUS } from "@/lib/types";

interface Reservation {
  [key: string]: any;
}

interface Props {
  // reservationFields: Prisma.DMMF.Field[] | undefined;
  // reservations: Reservation[];
}

const ReservationTable: React.FC<Props> = () => {

  const [reservationFields, setReservationFields] = useState<Prisma.DMMF.Field[] | undefined>(undefined);
  const [reservations, setReservations] = useState<any>([]);

  useEffect(() => {
    async function handleGetReservationFields() {
        const resFields = await getReservationFields();
        setReservationFields(resFields);
    }
    handleGetReservationFields();
  }, []);

  useEffect(() => {
      async function handleGetReservations(): Promise<any> {
          const reservations = await getReservations();
          setReservations(reservations);
      }
      handleGetReservations();
  }, []);

  const handleTableStyleFormatting = (fieldIdx: number, fieldName: string | number, fieldValue: any) => {
    if(fieldName === "status") {
      let statusIcon = undefined;

      switch(fieldValue) {
        case RESERVATION_STATUS.CONFIRMED:
          statusIcon = <CheckCircle color="#00ff40"/>;
          break;
        case RESERVATION_STATUS.PENDING:
          statusIcon = <Clock color="#fffa3c" />
          break;
        case RESERVATION_STATUS.CANCELLED:
          statusIcon = <XCircle color="#ff0000" />;
          break;
        default:
          break;
      }

      return ( 
        <td key={fieldIdx} className="px-2 sm:px-6 py-4 text-center border-r">
          <div className="flex flex-row justify-stretch">{ statusIcon }{ fieldValue }</div>
        </td> 
      );
    } else if(fieldValue instanceof Date) {
      return (
        <td key={fieldIdx} className="px-2 sm:px-6 py-4 text-center border-r">
          { fieldValue.toUTCString() }
        </td>
      );
    } else {
      return (
        <td key={fieldIdx} className="px-2 sm:px-6 py-4 text-center border-r">
          { fieldValue }
        </td>
      );
    }
  }

  return (
    <div className="overflow-x-auto lg:overflow-visible w-full lg:w-auto">
      <table className="min-w-full divide-y divide-gray-200 border-collapse lg:w-auto">
        <thead className="bg-gray-50">
          <tr>
            { reservationFields && 
              <th
                scope="col"
                className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
              >
                #
              </th>
            }
            { reservationFields?.map((field, fieldIdx) => (
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
            { reservations?.map((reservation: Reservation, idx: number) => {
              return (
                <tr className="hover:bg-gray-500" key={idx}>
                  <td className="px-2 sm:px-6 py-4 text-center border-r">{idx+1}</td>
                  { reservationFields?.map((field, fieldIdx) => {
                    type ObjectKey = keyof typeof reservation;
                    const fieldName = field.name as ObjectKey;
                    const fieldValue = reservation[fieldName];
                    return handleTableStyleFormatting(fieldIdx, fieldName, fieldValue);
                  })}
                </tr>
              );
            })}
          </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
