import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text
} from '@tremor/react';

import { User } from '@prisma/client';

// interface User {
//   id: number;
//   name: string;
//   username: string;
//   email: string;
// }

export default function UsersTable({ users }: { users: User[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Sites</TableHeaderCell>
          <TableHeaderCell>Listings</TableHeaderCell>
          <TableHeaderCell>Listings</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>
              <Text>{user.sites?.length}</Text>
            </TableCell>
            <TableCell>
              <Text>{user.posts?.length}</Text>
            </TableCell>
            <TableCell>
              <Text>{user.}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
