import { useState, useEffect } from "react";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { UploadEmailsDropZone } from "../components/UploadEmailsDropZone";
import {
  Card,
  NumberInput,
  Grid,
  Select,
  Button,
  Paper,
  SimpleGrid,
  Stack,
  Flex,
  Title,
  Modal,
  Text,
  Avatar,
} from "@mantine/core";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useDisclosure } from "@mantine/hooks";
import { MdAddCircleOutline } from "react-icons/md";
import { RewardCard } from "../components/RewardCard";
import AddReward from "../components/AddReward";
import { Reward } from "../interfaces";

const AdminDashboard = () => {
  const { currentUser, getRewards, saveClaimPoints } = useAuth();

  const [claimPoints, setClaimPoints] = useState<number | "">(currentUser!.company.claimPoints || "");
  const [claimPointsInterval, setClaimPointsInterval] = useState<string | null>(
    currentUser!.company.claimPointsInterval?.toString() || null
  );
  const [claimPointsLoading, setClaimPointsLoading] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const [rewardToEdit, setRewardToEdit] = useState<Reward | null>(null);

  const [unapprovedRedeems, setUnapprovedRedeems] = useState<any>([]);

  const handleSaveClaimPoints = async () => {
    setClaimPointsLoading(true);
    await saveClaimPoints(Number(claimPoints), Number(claimPointsInterval));
    setClaimPointsLoading(false);
  };

  const handleCloseModal = () => {
    setRewardToEdit(null);
    close();
  };

  // useEffect(() => {
  //   getRewards();

  //   getDocs(
  //     query(
  //       collection(db, "redeems"),
  //       where("completed", "==", false),
  //       where("companyId", "==", currentUser!.companyId),
  //       orderBy("createdAt", "desc")
  //     )
  //   )
  //     .then(async data => {
  //       const redeems = await Promise.all(
  //         data.docs.map(async doc => {
  //           const docData = doc.data();
  //           const user = await getDoc(docData.user);
  //           const userData = user.data() as any;
  //           return {
  //             id: doc.id,
  //             userName: userData.displayName,
  //             userEmail: userData.email,
  //             title: docData.title,
  //             description: docData.description,
  //             pointsPrice: docData.pointsPrice,
  //             createdAt: new Date(docData.createdAt.seconds * 1000).toDateString(),
  //           };
  //         })
  //       );

  //       setUnapprovedRedeems(redeems);
  //     })
  //     .catch(err => console.log(err));
  // }, []);

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

  return (
    <>
      <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
        <Grid.Col sm={12} md={6}>
          <Paper radius="lg" p={30} mih={"100%"} h={"100%"}>
            <Stack h={"100%"} justify="center">
              <NumberInput
                value={claimPoints}
                onChange={setClaimPoints}
                label="Claim points"
                defaultValue={""}
                step={10}
                min={1}
                max={10000}
              />

              <Select
                value={claimPointsInterval}
                onChange={setClaimPointsInterval}
                label="Every"
                placeholder="Pick one"
                data={[
                  { value: String(3600 * 1), label: "1 hour" },
                  { value: String(3600 * 2), label: "2 hours" },
                  { value: String(3600 * 4), label: "4 hours" },
                  { value: String(3600 * 8), label: "8 hours" },
                  { value: String(3600 * 12), label: "12 hours" },
                  { value: String(3600 * 24), label: "24 hours" },
                ]}
              />

              <Button
                loading={claimPointsLoading}
                style={{ marginTop: "1rem" }}
                disabled={
                  Number(claimPoints) <= 0 ||
                  Number(claimPointsInterval) <= 0 ||
                  (claimPoints === currentUser!.company.claimPoints &&
                    claimPointsInterval === currentUser!.company.claimPointsInterval?.toString())
                }
                onClick={handleSaveClaimPoints}
              >
                Save
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col sm={12} md={6}>
          <Paper radius="lg" p={30}>
            <UploadEmailsDropZone />
          </Paper>
        </Grid.Col>
      </Grid>

      <Modal opened={opened} onClose={handleCloseModal} closeOnClickOutside={false} withCloseButton={false}>
        <AddReward reward={rewardToEdit || undefined} handleClose={handleCloseModal} />
      </Modal>

      <Stack>
        <Title>Rewards</Title>

        <SimpleGrid
          cols={4}
          spacing={"xl"}
          verticalSpacing="xl"
          breakpoints={[
            { maxWidth: "90rem", cols: 3, spacing: "md", verticalSpacing: "md" },
            { maxWidth: "70rem", cols: 2, spacing: "sm", verticalSpacing: "sm" },
            { maxWidth: "40rem", cols: 1, spacing: "sm", verticalSpacing: "md" },
          ]}
        >
          <Card p={50} onClick={open}>
            <Stack justify="center" align="center" h={"100%"}>
              <MdAddCircleOutline size="4rem" />
              <Text>Add reward</Text>
            </Stack>
          </Card>

          {currentUser?.company.rewards?.map((reward: any, index: number) => (
            <RewardCard
              {...reward}
              key={index}
              handleClickEdit={() => {
                setRewardToEdit(reward);
                open();
              }}
              handleClickDelete={() => console.log("todo handleClickDelete", reward)}
            />
          ))}
        </SimpleGrid>

        {/* <Grid grow>
          <Grid.Col span="content">
            <Card p={50} onClick={open} miw={350} maw={450}>
              <Stack justify="center" align="center">
                <MdAddCircleOutline size="4rem" />
                <Text>Add reward</Text>
              </Stack>
            </Card>
          </Grid.Col>

          {[
            ...currentUser?.company.rewards!,
            ...currentUser?.company.rewards!,
            ...currentUser?.company.rewards!,
            ...currentUser?.company.rewards!,
            ...currentUser?.company.rewards!,
            ...currentUser?.company.rewards!,
            ...currentUser?.company.rewards!,
            ...currentUser?.company.rewards!,
          ].map((reward: any, index: number) => (
            <Grid.Col span="content" key={index}>
              <Card shadow="sm" padding="xl" miw={350} maw={450}>
                <Card.Section>
                  <Image
                    src="https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
                    height={160}
                    alt="No way!"
                  />
                </Card.Section>

                <Flex justify={"space-between"} align={"center"}>
                  <Text weight={500} size="lg" mt="md">
                    {reward.title}
                  </Text>

                  <Menu shadow="xl" width={200} offset={10} withArrow position="bottom">
                    <Menu.Target>
                      <ActionIcon radius="lg" size="lg">
                        <MdMoreVert size="1.5rem" />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item color="blue" icon={<MdEditNote size={14} />} onClick={() => handleEditReward(reward)}>
                        Edit reward
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        icon={<MdOutlineDelete size={14} />}
                        onClick={() => handleDeleteReward(reward)}
                      >
                        Delete reward
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Flex>

                <Text mt="xs" color="dimmed" size="sm">
                  {reward.description}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid> */}
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
  );
};

export default AdminDashboard;
