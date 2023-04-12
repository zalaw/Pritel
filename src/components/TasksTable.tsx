import { useState } from "react";
import { createStyles, Table, Checkbox, ScrollArea, Group, Avatar, Text, rem } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";

interface TableSelectionProps {
  data: { id: string; avatar: string; name: string; email: string; title: string; reward: number; deadline: Date }[];
}

export function TasksTable({ data }: TableSelectionProps) {
  const navigate = useNavigate();

  const handleRowClicked = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  const rows = data.map(item => {
    return (
      <tr key={item.id} onClick={() => handleRowClicked(item.id)}>
        <td>
          <Group spacing="sm">
            <Avatar src={null} size={32} radius={32} color="red">
              {item.name[0].toUpperCase()}
            </Avatar>
            <Text size="sm" weight={500}>
              {item.name}
            </Text>
          </Group>
        </td>

        <td>{item.title}</td>

        <td>{item.reward}</td>
        <td>{item.deadline.toDateString()}</td>
      </tr>
    );
  });

  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm" striped highlightOnHover>
        <thead>
          <tr>
            <th>User</th>
            <th>Task</th>
            <th>Points</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      {data.length === 0 && (
        <Text ta={"center"} py={10}>
          No tasks so far. Check again shortly
        </Text>
      )}
    </ScrollArea>
  );
}
