import { DropZone } from "../components/DropZone";
import {
  Card,
  NumberInput,
  Grid,
  createStyles,
  Select,
  Group,
  Button,
  Paper,
  Box,
  Modal,
  Input,
  Textarea,
  Radio,
  Stack,
  TextInput,
  Loader,
  Flex,
  Title,
  Text,
  TypographyStylesProvider,
  Avatar,
  Spoiler,
  UnstyledButton,
} from "@mantine/core";
import { CustomTable } from "../components/CustomTable";
import { useDisclosure } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useAuth, CurrentUser } from "../contexts/AuthContext";
import { useFormik, FormikHelpers } from "formik";
import { createTaskSchema } from "../schemas";
import { MdCheck } from "react-icons/md";
import {
  DocumentReference,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { TasksTable } from "../components/TasksTable";
import { useParams } from "react-router-dom";
import { ref } from "yup";

const Task = () => {
  const { id } = useParams();
  const [task, setTask] = useState<any>(null);
  const [taskLoading, setTaskLoading] = useState(true);
  const [comm, setComm] = useState("");

  const { currentUser } = useAuth();

  useEffect(() => {
    try {
      setTaskLoading(true);

      getDoc(doc(db, "tasks", id!)).then(async data => {
        const taskData = data.data();
        if (taskData === undefined) return;

        const user = (await getDoc(taskData.user)) as any;
        const userData = user.data();

        const comments = await getDocs(
          query(collection(db, "comments"), where("taskId", "==", id!), orderBy("createdAt", "asc"))
        );

        const commsPromises = comments.docs.map(async doc => {
          const docData = doc.data();
          const user = await getDoc(docData.user);
          const userData = user.data() as any;

          return {
            id: doc.id,
            userId: docData.userId,
            userName: userData.displayName,
            userEmail: userData.email,
            createdAt: new Date(docData.createdAt.seconds * 1000).toDateString(),
            content: docData.content,
          };
        });

        const comms = await Promise.all(commsPromises);

        console.log("comms", comms);

        setTask({
          id,
          title: taskData.title,
          description: taskData.description,
          reward: taskData.reward,
          completed: taskData.completed,
          deadline: new Date(taskData.deadline.seconds * 1000).toDateString(),
          comments: comms,
          winner: {
            id: taskData.winnerId,
          },
          user: {
            id: user.id,
            name: userData!.displayName,
            email: userData!.email,
          },
        });

        setTaskLoading(false);
      });
    } catch (err) {
      console.log(err);
      setTaskLoading(false);
    }
  }, []);

  const handleMarkAsWinner = async (userId: string) => {
    try {
      await setDoc(
        doc(db, "tasks", id!),
        {
          completed: true,
          winner: doc(db, "users", userId),
          winnerId: userId,
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "users", userId),
        {
          points: currentUser!.user.points + Number(task.reward),
          pointsCollected: currentUser!.user.pointsCollected + Number(task.reward),
        },
        { merge: true }
      );

      setTask((curr: any) => ({
        ...curr,
        completed: true,
        winnerId: userId,
      }));

      toast.success("Task marked as completed!");
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = async () => {
    try {
      const comment = await addDoc(collection(db, "comments"), {
        user: doc(db, `users/${currentUser!.userId}`),
        userId: currentUser!.userId,
        task: doc(db, `tasks/${id!}`),
        taskId: id!,
        content: comm,
        createdAt: new Date(),
      });

      setTask((curr: any) => ({
        ...curr,
        comments: [
          {
            id: comment.id,
            // id: "d22",
            userId: currentUser!.userId,
            userName: currentUser!.user.displayName,
            userEmail: currentUser!.user.email,
            createdAt: new Date().toDateString(),
            content: comm,
          },
          ...curr.comments,
        ],
      }));
    } catch (err) {}
    setComm("");
  };

  return (
    <>
      {taskLoading ? (
        <Flex justify="center" p={20}>
          <Loader />
        </Flex>
      ) : (
        <Stack>
          <Title>
            {task?.title} - {task?.reward} points
          </Title>
          <Flex align={"center"} gap={10}>
            <Avatar src={null} size={32} radius={32} color="red">
              {task?.user.name[0].toUpperCase()}
            </Avatar>
            <Text size="md" weight={500}>
              {task?.user.name}
            </Text>
            <Text fz="sm" fs="italic">
              {task?.user.email}
            </Text>
          </Flex>

          <Text>
            Deadline:{" "}
            <Text span fz="xs" fs="italic">
              {task?.deadline}
            </Text>
          </Text>

          <Paper p="md">
            <Text>{task?.description}</Text>
          </Paper>

          {currentUser!.userId !== task.user.id && (
            <>
              <Textarea
                value={comm}
                onChange={e => setComm(e.target.value)}
                mt={50}
                autosize
                minRows={1}
                maxRows={10}
                placeholder="Your comment here"
              />
              <Button disabled={comm.trim() === ""} onClick={addComment} id="custom-disabled">
                Post
              </Button>
            </>
          )}

          <Stack mt={50}>
            <Title>Comments - {task?.comments.length}</Title>

            <TypographyStylesProvider>
              <Stack spacing={20}>
                {task?.comments.map((x: any, index: number) => {
                  return (
                    <Paper withBorder key={index} p={20}>
                      <Stack miw={"100%"}>
                        <Flex align={"center"} justify={"space-between"}>
                          <Flex align={"center"} gap={10}>
                            <Avatar src={null} size={32} radius={32} color="red">
                              {x?.userName[0].toUpperCase()}
                            </Avatar>
                            <Text size="md" weight={500}>
                              {x?.userName}
                            </Text>
                            <Text fz="sm" fs="italic">
                              {x?.userEmail}
                            </Text>
                          </Flex>
                          {currentUser!.userId === task.user.id && !task.completed && (
                            <Button
                              onClick={() => handleMarkAsWinner(x.userId)}
                              color="teal"
                              leftIcon={<MdCheck size={26} />}
                            >
                              Mark as winner
                            </Button>
                          )}
                        </Flex>
                        <Text>{x?.createdAt}</Text>

                        <Spoiler maxHeight={320} showLabel="Show more" hideLabel="Hide">
                          <div dangerouslySetInnerHTML={{ __html: x.content }}></div>
                        </Spoiler>
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </TypographyStylesProvider>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Task;
