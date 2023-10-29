import {
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    Text
  } from '@tremor/react';
  
  import { Reservation } from '@prisma/client';
  
  
  export default function ReservationTable({ reservations }: { reservations: Reservation[] | undefined }) {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Sites</TableHeaderCell>
            <TableHeaderCell>Listings</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations?.map((reservation: Reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>
                <Text>{reservation.id}</Text>
              </TableCell>
              <TableCell>
                <Text>{}</Text>
              </TableCell>
  
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }