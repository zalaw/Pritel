import { useState, useEffect } from "react";
import { Card, Grid, createStyles, Button, Stack, Text, Flex, Title, Chip, Badge, Loader } from "@mantine/core";
import { useAuth, CurrentUser } from "../contexts/AuthContext";
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const useStyles = createStyles(theme => ({
  grid: {
    padding: 40,

    [theme.fn.smallerThan("xs")]: {
      // padding: 10,
    },
  },

  box: {
    display: "flex",
    flexDirection: "column",
    // gap: "1rem",
  },
}));

const Rewards = () => {
  const { classes } = useStyles();
  const { currentUser, setCurrentUser } = useAuth();
  const [redeemLoading, setRedeemLoagin] = useState(false);
  const [myRedeemsLoading, setMyRedeemsLoading] = useState(false);
  const [myRedeems, setMyRedeems] = useState<any>([]);

  useEffect(() => {
    setMyRedeemsLoading(true);

    const unsubscribe = onSnapshot(
      query(
        collection(db, "redeems"),
        where("userId", "==", currentUser!.userId),
        where("companyId", "==", currentUser!.companyId),
        orderBy("createdAt", "desc")
      ),
      async snapshot => {
        const redeemsData = await Promise.all(
          snapshot.docs.map(async doc => {
            const redeemData = doc.data();

            return {
              id: doc.id,
              title: redeemData.title,
              description: redeemData.description,
              pointsPrice: redeemData.pointsPrice,
              completed: redeemData.completed,
            };
          })
        );

        console.log(redeemsData);
        setMyRedeems(redeemsData);

        setMyRedeemsLoading(false);
      }
    );

    return () => {
      unsubscribe();
      setMyRedeems([]);
    };
  }, []);

  const redeemReward = async (title: string, description: string, points: number) => {
    try {
      setRedeemLoagin(true);

      await addDoc(collection(db, "redeems"), {
        user: doc(db, `users/${currentUser?.userId}`),
        userId: currentUser?.userId,
        company: doc(db, `companies/${currentUser?.companyId}`),
        companyId: currentUser?.companyId,
        title: title,
        description: description,
        pointsPrice: points,
        completed: false,
        createdAt: new Date(),
      });

      await setDoc(
        doc(db, "users", currentUser!.userId),
        {
          points: currentUser?.user.points! - Number(points),
          pointsSpent: currentUser!.user.pointsSpent + Number(points),
        },
        { merge: true }
      );

      setCurrentUser((curr: CurrentUser | null) => ({
        ...curr,
        user: {
          ...curr?.user,
          points: currentUser?.user.points! - Number(points),
          pointsSpent: currentUser!.user.pointsSpent + Number(points),
        },
      }));

      toast.success("Item redeemed successfully!");
    } catch (e) {
      console.log(e);
    } finally {
      setRedeemLoagin(false);
    }
  };

  return (
    <>
      <Stack>
        <Title>Rewards</Title>
        <Text fz="sm">My points: {currentUser!.user.points}</Text>
        {currentUser?.company.rewards.length === 0 && "Company didn't list any rewards. Check again shortly"}
        <Grid gutter={20}>
          {currentUser?.company.rewards.map((reward: any, index: number) => {
            return (
              <Grid.Col sm={12} md={4} key={index}>
                <Card padding={30} h="100%">
                  <Flex h={"100%"} direction={"column"} justify={"space-between"} gap={20}>
                    <Stack>
                      <Title order={3}>{reward.title}</Title>

                      <Text fz="xs">{reward.description}</Text>
                    </Stack>
                    <Button
                      id="custom-disabled"
                      loading={redeemLoading}
                      disabled={currentUser!.user.points < reward.pointsPrice}
                      w="100%"
                      onClick={() => redeemReward(reward.title, reward.description, reward.pointsPrice)}
                    >
                      {reward.pointsPrice} points
                    </Button>
                  </Flex>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      </Stack>

      <Stack>
        <Title>My redeemed rewards</Title>
        {myRedeems.length === 0 && "You didn't claim any rewards"}
        {myRedeemsLoading && (
          <Flex justify="center" p={20}>
            <Loader />
          </Flex>
        )}
        <Grid gutter={20}>
          {myRedeems.map((redeem: any, index: number) => {
            return (
              <Grid.Col sm={12} md={4} key={index}>
                <Card padding={30} h="100%">
                  <Flex h={"100%"} direction={"column"} justify={"space-between"} gap={20}>
                    <Stack>
                      <Flex align={"center"} justify={"space-between"}>
                        <Title order={3}>{redeem.title}</Title>
                        {redeem.completed ? (
                          <Badge color="green">Approved</Badge>
                        ) : (
                          <Badge color="orange">Pending</Badge>
                        )}
                      </Flex>

                      <Text fz="xs">{redeem.description}</Text>
                    </Stack>
                  </Flex>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      </Stack>
    </>
  );
};

export default Rewards;
