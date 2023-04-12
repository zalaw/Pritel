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
} from "@mantine/core";
import { CustomTable } from "../components/CustomTable";
import { useDisclosure } from "@mantine/hooks";
import { DateInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import { useAuth, CurrentUser } from "../contexts/AuthContext";
import { useFormik, FormikHelpers } from "formik";
import { createTaskSchema } from "../schemas";
import {
  DocumentReference,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { TasksTable } from "../components/TasksTable";

const useStyles = createStyles(theme => ({
  grid: {
    padding: 80,

    [theme.fn.smallerThan("xs")]: {
      padding: 10,
    },
  },

  box: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
}));

interface FormValues {
  title: string;
  description: string;
  deadline: any;
  reward: number;
}

const initialValues: FormValues = {
  title: "",
  description: "",
  deadline: new Date(),
  reward: 1,
};

interface Task {
  id: string;
  company: DocumentReference;
  companyId: string;
  deadline: Date;
  description: string;
  reward: number;
  title: string;
  user: DocumentReference;
  userId: string;
}

const Tasks = () => {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure();
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [reward, setReward] = useState<number | "">(1);
  const { currentUser, setCurrentUser } = useAuth();

  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    setTasksLoading(true);

    const unsubscribe = onSnapshot(
      query(
        collection(db, "tasks"),
        where("completed", "==", false),
        where("companyId", "==", currentUser!.companyId),
        where("deadline", ">=", new Date()),
        orderBy("deadline"),
        orderBy("createdAt", "desc")
      ),
      async snapshot => {
        const taskDataPromises = snapshot.docs.map(async doc => {
          const taskData = doc.data();
          const userDoc = await getDoc(taskData.user);
          const userData = userDoc.data() as any;

          return {
            id: doc.id,
            avatar: "ddd",
            name: userData.displayName,
            title: taskData.title,
            reward: taskData.reward,
            createdAt: new Date(taskData.createdAt.seconds * 1000),
            deadline: new Date(taskData.deadline.seconds * 1000),
          };
        });

        const taskData = await Promise.all(taskDataPromises);

        console.log(taskData);
        setTasks(taskData.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime()));

        setTasksLoading(false);
      }
    );

    return () => {
      unsubscribe();
      setTasks([]);
    };
  }, []);

  const onSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      const task = await addDoc(collection(db, "tasks"), {
        user: doc(db, `users/${currentUser?.userId}`),
        userId: currentUser?.userId,
        company: doc(db, `companies/${currentUser?.companyId}`),
        companyId: currentUser?.companyId,
        title: values.title,
        description: values.description,
        deadline: dateValue,
        reward: reward,
        completed: false,
        winner: null,
        winnerId: null,
        comments: [],
        createdAt: new Date(),
      });

      await setDoc(
        doc(db, "users", currentUser!.userId),
        {
          points: currentUser?.user.points! - Number(reward),
          pointsSpent: currentUser!.user.pointsSpent + Number(reward),
        },
        { merge: true }
      );

      setCurrentUser((curr: CurrentUser | null) => ({
        ...curr,
        user: {
          ...curr?.user,
          points: currentUser?.user.points! - Number(reward),
          pointsSpent: currentUser!.user.pointsSpent + Number(reward),
        },
      }));

      close();

      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Something went wrong!");
      console.log(err);
    }
  };

  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: createTaskSchema,
    onSubmit,
  });

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create task" closeOnClickOutside={false} padding={30}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Stack spacing={20}>
            <TextInput
              withAsterisk
              id="title"
              error={touched.title && errors.title}
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Task title"
              placeholder="Something short and concise"
            />

            <Textarea
              withAsterisk
              id="description"
              error={touched.description && errors.description}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Description"
              placeholder="Put here a good description"
              autosize
              minRows={6}
              maxRows={10}
            />

            <DateInput
              withAsterisk
              id="deadline"
              value={dateValue}
              onChange={setDateValue}
              w={"100%"}
              mx="auto"
              label="Deadline"
              valueFormat="DD MM YYYY"
              minDate={new Date()}
            />

            <NumberInput
              withAsterisk
              id="reward"
              value={reward}
              onChange={value => setReward(value)}
              label="Reward points"
              description={`Your balance is ${currentUser?.user.points}`}
              defaultValue={1}
              step={5}
              min={1}
              max={currentUser?.user.points}
            />

            <Button type="submit" mt={40} w="100%" loading={isSubmitting}>
              Create Task
            </Button>
          </Stack>
        </form>
      </Modal>

      <Grid>
        <Grid.Col sm={12} md={12}>
          <Flex align="center" gap={20}>
            <Title>Ongoing tasks</Title>
            <Button onClick={open} disabled={currentUser!.user.points === 0} id="custom-disabled">
              {currentUser!.user.points === 0 ? "You have 0 points" : "Create task"}
            </Button>
          </Flex>

          {tasksLoading ? (
            <Flex justify="center" p={20}>
              <Loader />
            </Flex>
          ) : (
            <TasksTable data={tasks} />
          )}
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Tasks;
