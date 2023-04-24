import { Avatar, Flex, Stack, Text } from "@mantine/core";
import { useAuth } from "../contexts/AuthContext";

export default function AvatarUser() {
  const { currentUser } = useAuth();

  const [initialOne, initialTwo] = currentUser!.user.displayName.toUpperCase().split(" ");

  return (
    <Flex align={"center"} gap={".5rem"}>
      <Avatar src={currentUser!.user.photoURL || null} size={48} radius={48} color="red">
        {initialOne[0]}
        {initialTwo?.[0]}
      </Avatar>
      <Stack spacing={0}>
        <Text fw={700}>{currentUser!.user.displayName}</Text>
        <Text fz="xs">{currentUser!.user.email}</Text>
      </Stack>
    </Flex>
  );
}
