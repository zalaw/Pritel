import { useState, useEffect } from "react";
import {
  FieldValue,
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
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
  SimpleGrid,
  Stack,
  Flex,
  Title,
  Modal,
  TextInput,
  Textarea,
  Text,
  ActionIcon,
  Avatar,
} from "@mantine/core";
import { db } from "../firebase";
import { useAuth, CurrentUser } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useDisclosure } from "@mantine/hooks";
import { useFormik, FormikHelpers } from "formik";
import { createRewardSchema } from "../schemas";
import { MdEditNote, MdDeleteForever } from "react-icons/md";

const useStyles = createStyles(theme => ({
  grid: {
    padding: 80,
    // display: "flex",
    // flexDirection: "column",
    // gap: "2rem",
    // borderRight: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3]}`,
    // height: "100%",
    // maxWidth: rem(400),

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
}

let initialValues: FormValues = {
  title: "",
  description: "",
};

const AdminDashboard = () => {
  const { classes } = useStyles();
  const { currentUser, setCurrentUser } = useAuth();

  const [opened, { open, close }] = useDisclosure(false);
  const [opened2, { open: open2, close: close2 }] = useDisclosure(false);

  const [claimPointsLoading, setClaimPointsLoading] = useState(false);
  const [claimPoints, setClaimPoints] = useState<number | "">(currentUser?.company.claimPoints || "");
  const [claimPointsInterval, setClaimPointsInterval] = useState<string | null>(
    currentUser?.company.claimPointsInterval?.toString() || null
  );

  const [reward, setReward] = useState<any>(null);

  const [pointsPrice, setPointsPrice] = useState<number>(0);
  const [unapprovedRedeems, setUnapprovedRedeems] = useState<any>([]);

  const handleCloseModal = () => {
    setValues({ title: "", description: "" });
    setPointsPrice(0);
    setReward(null);
    resetForm();
    close();
  };

  useEffect(() => {
    getDocs(
      query(
        collection(db, "redeems"),
        where("completed", "==", false),
        where("companyId", "==", currentUser!.companyId),
        orderBy("createdAt", "desc")
      )
    )
      .then(async data => {
        const redeems = await Promise.all(
          data.docs.map(async doc => {
            const docData = doc.data();
            const user = await getDoc(docData.user);
            const userData = user.data() as any;
            return {
              id: doc.id,
              userName: userData.displayName,
              userEmail: userData.email,
              title: docData.title,
              description: docData.description,
              pointsPrice: docData.pointsPrice,
              createdAt: new Date(docData.createdAt.seconds * 1000).toDateString(),
            };
          })
        );

        setUnapprovedRedeems(redeems);
      })
      .catch(err => console.log(err));
  }, []);

  const handleDeleteReward = async (obj: any) => {
    try {
      const newRewards = currentUser?.company.rewards.filter((x: any) => JSON.stringify(x) !== JSON.stringify(obj));

      await updateDoc(doc(db, "companies", currentUser!.companyId), {
        rewards: newRewards,
      });

      setCurrentUser((curr: CurrentUser | null) => ({
        ...curr,
        company: {
          ...curr!.company,
          rewards: newRewards,
        },
      }));

      toast.success("Reward deleted successfully!");
    } catch (err) {}
  };

  const onSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      if (reward) {
        const rewards = currentUser!.company.rewards.map(x => {
          if (JSON.stringify(x) === JSON.stringify(reward)) {
            console.log("da");
            return { ...values, pointsPrice };
          } else {
            return x;
          }
        });

        await updateDoc(doc(db, "companies", currentUser!.companyId), {
          rewards: rewards,
        });

        setCurrentUser((curr: CurrentUser | null) => ({
          ...curr,
          company: {
            ...curr!.company,
            rewards: rewards,
          },
        }));

        toast.success("Reward updated successfully!");
      } else {
        const newReward = { title: values.title, pointsPrice: pointsPrice, description: values.description };

        await updateDoc(doc(db, "companies", currentUser!.companyId), {
          rewards: arrayUnion(newReward),
        });

        setCurrentUser((curr: CurrentUser | null) => ({
          ...curr,
          company: {
            ...curr!.company,
            rewards: [...curr!.company.rewards, newReward],
          },
        }));

        // setRewards((curr: any) => [
        //   { title: values.title, pointsPrice: pointsPrice, description: values.description },
        //   ...curr,
        // ]);
        toast.success("Reward added successfully!");
      }

      close();
      resetForm();
      setPointsPrice(0);
      setReward(null);
    } catch (err) {
      toast.error("Something went wrong!");
      console.log(err);
    }
  };

  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit, setValues, resetForm } =
    useFormik({
      initialValues,
      validationSchema: createRewardSchema,
      onSubmit,
    });

  const handleEditReward = async (obj: any) => {
    setReward(obj);
    setValues(obj);
    setPointsPrice(obj.pointsPrice);
    open();
  };

  const handleApprove = async (id: string) => {
    try {
      console.log(id);
      await setDoc(
        doc(db, "redeems", id),
        {
          completed: true,
        },
        { merge: true }
      );

      setUnapprovedRedeems(unapprovedRedeems.filter((x: any) => x.id !== id));

      toast.success("Reward approved successfully!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveClaimPoints = async () => {
    try {
      setClaimPointsLoading(true);

      await setDoc(
        doc(db, "companies", currentUser!.companyId),
        { claimPoints, claimPointsInterval: Number(claimPointsInterval) },
        { merge: true }
      );

      setCurrentUser((curr: CurrentUser | null) => ({
        ...curr,
        company: { ...curr?.company, claimPoints, claimPointsInterval },
      }));

      toast.success("Claim points updated successfully!");
    } catch (e) {
      console.log(e);
    } finally {
      setClaimPointsLoading(false);
    }
  };

  return (
    // <div style={{ width: "100%", overflow: "hidden" }}>
    <>
      <Grid>
        <Grid.Col sm={12} md={6}>
          <Paper p={50} style={{ minHeight: "100%" }}>
            <Stack>
              <NumberInput
                value={claimPoints}
                onChange={setClaimPoints}
                label="Claim points"
                defaultValue={0}
                step={10}
                min={0}
                max={10000}
              />

              <Select
                value={claimPointsInterval}
                onChange={setClaimPointsInterval}
                label="Every"
                placeholder="Pick one"
                data={[
                  { value: String(1000 * 60 * 60 * 1), label: "1 hour" },
                  { value: String(1000 * 60 * 60 * 2), label: "2 hours" },
                  { value: String(1000 * 60 * 60 * 4), label: "4 hours" },
                  { value: String(1000 * 60 * 60 * 8), label: "8 hours" },
                  { value: String(1000 * 60 * 60 * 12), label: "12 hours" },
                  { value: String(1000 * 60 * 60 * 24), label: "24 hours" },
                ]}
              />

              <Button loading={claimPointsLoading} style={{ marginTop: "1rem" }} onClick={handleSaveClaimPoints}>
                Save
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col sm={12} md={6}>
          <Paper p={50}>
            <DropZone />
          </Paper>
        </Grid.Col>
      </Grid>

      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={reward ? "Edit reward" : "Add reward"}
        closeOnClickOutside={false}
      >
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

            <NumberInput
              withAsterisk
              id="pointsPrice"
              value={pointsPrice}
              defaultValue={0}
              onChange={value => setPointsPrice(value || 0)}
              label="Points"
              step={5}
              min={0}
            />
          </Stack>

          <Button type="submit" mt={40} w="100%" loading={isSubmitting}>
            {reward ? "Edit reward" : "Add reward"}
          </Button>
        </form>
      </Modal>

      <Stack>
        <Flex align="center" gap={20}>
          <Title>Rewards</Title>
          <Button onClick={open}>Add reward</Button>
        </Flex>

        <Grid>
          {currentUser?.company.rewards?.map((reward: any, index: number) => (
            <Grid.Col sm={12} md={6} lg={4} mih={"100%"} key={index}>
              <Card mih={"100%"}>
                <Stack mih={"100%"}>
                  <Flex justify={"space-between"} align={"center"} gap={10}>
                    <Title order={3}>{reward.title}</Title>
                    <Text fz={26} fw={700}>
                      {reward.pointsPrice}
                    </Text>
                  </Flex>
                  <Flex justify={"space-between"} gap={10}>
                    <Text fz="xs">{reward.description}</Text>
                    <Flex gap={10}>
                      <ActionIcon radius="xl" onClick={() => handleEditReward(reward)}>
                        <MdEditNote size={30} color="#1971c2" />
                      </ActionIcon>
                      <ActionIcon radius="xl" onClick={() => handleDeleteReward(reward)}>
                        <MdDeleteForever size={30} color="rgb(255, 85, 113)" />
                      </ActionIcon>
                    </Flex>
                  </Flex>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {currentUser!.company.rewards?.length === 0 && <Text py={20}>No rewards added</Text>}
      </Stack>

      <Stack>
        <Title>Rewards waiting for your approval</Title>
        <Grid>
          {unapprovedRedeems.map((x: any) => {
            return (
              <Grid.Col sm={12} md={6} lg={4} mih={"100%"} key={x.id}>
                <Card mih={"100%"}>
                  <Stack mih={"100%"}>
                    <Flex align={"center"} gap={10}>
                      <Avatar src={null} size={32} radius={32} color="red">
                        {x.userName[0].toUpperCase()}
                      </Avatar>
                      <Text size="sm" weight={500}>
                        {x.userName}
                      </Text>
                    </Flex>

                    <Title order={3}>{x.title}</Title>
                    <Text fz="xs">{x.description}</Text>
                    <Button onClick={() => handleApprove(x.id)}>Approve</Button>
                  </Stack>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
        {unapprovedRedeems.length === 0 && <Text>No rewards are waiting for your approval</Text>}
      </Stack>
    </>
    // </div>
  );
};

export default AdminDashboard;
