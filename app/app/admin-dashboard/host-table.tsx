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


export default function HostTable({ users }: { users: User[] | undefined }) {
  return (
    <Table>
        <TableHead>
            <TableRow>
            {
                <TableHeaderCell>Name</TableHeaderCell>
            }
            </TableRow>
        </TableHead>
      <TableBody>
        {users?.map((user: User) => (
          <TableRow key={user.id}>
            {/* <TableCell>{user.name}</TableCell>
            <TableCell>
              <Text>{user.id}</Text>
            </TableCell>
            <TableCell>
              <Text>{user.posts?.length}</Text>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
