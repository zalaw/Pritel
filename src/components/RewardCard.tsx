import {
  ActionIcon,
  Card,
  Flex,
  Image,
  Menu,
  Text,
  Box,
  Badge,
  TextInput,
  Textarea,
  NumberInput,
  Divider,
  useMantineTheme,
  Group,
  rem,
  FileButton,
  Button,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { MdImage, MdMoreVert, MdEditNote, MdOutlineDelete, MdClose } from "react-icons/md";

interface RewardCardProps {
  created: boolean;
  image: string | null;
  title: string;
  description: string;
  pointsPrice: number;
  onChange: (e: any) => void;
  handleClickEdit: () => void;
  handleClickDelete: () => void;
}

export function RewardCard({
  created = true,
  image,
  title,
  description,
  pointsPrice,
  onChange,
  handleClickEdit,
  handleClickDelete,
}: RewardCardProps) {
  const theme = useMantineTheme();

  return (
    <Card shadow="sm" padding="xl">
      <Card.Section>
        {created ? (
          <Image
            src={
              image ||
              "https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
            }
            height={160}
            alt="No way!"
          />
        ) : (
          <>
            <FileButton onChange={() => {}} accept="image/png,image/jpeg">
              {props => <Button {...props}>Upload image</Button>}
            </FileButton>

            <Dropzone
              onDrop={files => console.log("accepted files", files)}
              onReject={files => console.log("rejected files", files)}
              maxSize={4 * 1024 ** 2}
              accept={IMAGE_MIME_TYPE}
              multiple={false}
            >
              <Group position="center" spacing="sm" style={{ minHeight: rem(160), pointerEvents: "none" }}>
                <Dropzone.Accept>
                  <MdImage size="2rem" color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <MdClose size="2rem" color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <MdImage size="2rem" />
                </Dropzone.Idle>

                <div>
                  <Text inline size="xl" ta="center">
                    Choose image
                  </Text>
                  <Text inline size="sm" color="dimmed" mt={20} ta={"center"}>
                    We can accept only image files that are less than 4mb in size
                  </Text>
                </div>
              </Group>
            </Dropzone>
            <Divider />
          </>
        )}
      </Card.Section>

      <Flex justify={"space-between"} align={"center"}>
        {created ? (
          <Text weight={500} size="lg" mt="md">
            {title}
          </Text>
        ) : (
          <TextInput
            value={title}
            name="title"
            onChange={onChange}
            w={"100%"}
            label="Title"
            placeholder="A good title is a good title"
            withAsterisk
            mt="md"
          />
        )}

        {created && (
          <Box mt="md">
            <Menu shadow="xl" width={200} offset={10} withArrow position="bottom">
              <Menu.Target>
                <ActionIcon radius="lg" size="lg">
                  <MdMoreVert size="1.5rem" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item color="blue" icon={<MdEditNote size={14} />} onClick={handleClickEdit}>
                  Edit reward
                </Menu.Item>
                <Menu.Item color="red" icon={<MdOutlineDelete size={14} />} onClick={handleClickDelete}>
                  Delete reward
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        )}
      </Flex>

      {created ? (
        <Text mt="xs" color="dimmed" size="sm">
          {description}
        </Text>
      ) : (
        <Textarea
          value={description}
          name="description"
          onChange={onChange}
          label="Description"
          placeholder="Put here something meaningful"
          withAsterisk
          mt={"md"}
        />
      )}

      <Badge w={"100%"} size="xl" mt="md">
        {created ? pointsPrice : <NumberInput value={pointsPrice} onChange={onChange} />}
      </Badge>
    </Card>
  );
}
