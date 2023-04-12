// import { useState } from "react";
// import { createStyles, Table, Checkbox, ScrollArea, Group, Avatar, Text, rem } from "@mantine/core";

// interface TableSelectionProps {
//   data: { id: string; avatar: string; name: string; email: string; title: string; reward: number; deadline: Date }[];
// }

// export function CustomTable({ data }: TableSelectionProps) {
//   const rows = data.map(item => {
//     return (
//       <tr key={item.id}>
//         <td>
//           <Group spacing="sm">
//             <Avatar src={null} size={32} radius={32} color="red">
//               {item.name[0].toUpperCase()}
//             </Avatar>
//             <Text size="sm" weight={500}>
//               {item.name}
//             </Text>
//           </Group>
//         </td>
//         <td>{item.title}</td>
//         <td>{item.reward}</td>
//         <td>{item.deadline.toDateString()}</td>
//       </tr>
//     );
//   });

//   return (
//     <ScrollArea>
//       <Table miw={800} verticalSpacing="sm" striped highlightOnHover>
//         <thead>
//           <tr>
//             <th>User</th>
//             <th>Task</th>
//             <th>Points</th>
//             <th>Until</th>
//           </tr>
//         </thead>
//         <tbody>{rows}</tbody>
//       </Table>
//       {data.length === 0 && "No tasks so far. Check again shortly"}
//     </ScrollArea>
//   );
// }

import { useState } from "react";
import { createStyles, Table, Checkbox, ScrollArea, Group, Avatar, Text, rem } from "@mantine/core";
import { useNavigate } from "react-router-dom";

interface TableHeader {
  name: string;
  label: string;
}

interface TableSelectionProps {
  tableData: {
    header: TableHeader[];
    data: Record<string, any>[];
  };
}

export const CustomTable: React.FC<TableSelectionProps> = ({ tableData }) => {
  const navigate = useNavigate();

  const handleRowClicked = (id: any) => {
    navigate(`/tasks/${id}`);
    // console.log(id);
  };

  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm" striped highlightOnHover>
        <thead>
          <tr>
            {tableData.header.map((columnHeader, index: number) => (
              <th key={`th-${index}`}>{columnHeader.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.data.map((row: Record<string, any>, index: number) => (
            <tr key={index} onClick={() => handleRowClicked(row.id)}>
              {tableData.header.map((columnHeader, idx: number) => (
                <td key={`${index}-${idx}`}>{row[columnHeader.name]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {tableData.data.length === 0 && (
        <Text ta={"center"} py={10}>
          No tasks so far. Check again shortly
        </Text>
      )}
    </ScrollArea>
  );
};
