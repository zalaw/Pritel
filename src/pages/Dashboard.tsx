import { useState, useEffect } from "react";
import { collection, doc, onSnapshot, query, where, setDoc } from "firebase/firestore";
import { Card, Grid, createStyles, Button, Stack, Text, Flex, Box, ScrollArea, Title } from "@mantine/core";
import { db } from "../firebase";
import { useAuth, CurrentUser } from "../contexts/AuthContext";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import { CustomTable } from "../components/CustomTable";

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

const Dashboard = () => {
  const { classes } = useStyles();
  const { currentUser, setCurrentUser } = useAuth();

  const [tasksCreated, setTasksCreated] = useState<any>([]);
  const [tasksCompleted, setTasksCompleted] = useState<any>([]);
  const [lastClaim, setLastClaim] = useState(
    currentUser?.user.lastClaim ? (currentUser?.user.lastClaim! as any).seconds : null
  );
  const [secondsLeft, setSecondsLeft] = useState(
    Math.floor(lastClaim! + currentUser!.company.claimPointsInterval! / 1000 - new Date().getTime() / 1000) > 0
      ? Math.floor(lastClaim! + currentUser!.company.claimPointsInterval! / 1000 - new Date().getTime() / 1000)
      : 0
  );

  // console.log("lastClaim", lastClaim);
  // console.log("lastClaimDate", new Date(lastClaim * 1000));
  // console.log("secondsLeft", secondsLeft);
  // console.log("\n\n\n");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "tasks"), where("userId", "==", currentUser!.userId)),
      async snapshot => {
        setTasksCreated(
          snapshot.docs.map(doc => {
            const taskData = doc.data();

            return {
              id: doc.id,
              title: taskData.title,
              completed: taskData.completed,
              deadline: new Date(taskData.deadline.seconds * 1000).toDateString(),
            };
          })
        );
      }
    );

    const unsubscribe2 = onSnapshot(
      query(collection(db, "tasks"), where("winnerId", "==", currentUser!.userId)),
      async snapshot => {
        setTasksCompleted(
          snapshot.docs.map(doc => {
            const taskData = doc.data();

            return {
              id: doc.id,
              title: taskData.title,
              completed: taskData.completed,
              deadline: new Date(taskData.deadline.seconds * 1000).toDateString(),
            };
          })
        );
      }
    );

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, []);

  const handleClaimPoints = async () => {
    try {
      const p = currentUser!.user.points + currentUser!.company.claimPoints!;
      const now = new Date();

      await setDoc(
        doc(db, "users", currentUser!.userId),
        { points: p, pointsCollected: currentUser!.user.pointsCollected + p, lastClaim: now },
        { merge: true }
      );

      setCurrentUser((curr: CurrentUser | null) => ({
        ...curr,
        user: { ...curr?.user, points: p, pointsCollected: currentUser!.user.pointsCollected + p, lastClaim: now },
      }));

      // console.log("handleClaimPoints");
      // console.log("lastClaim", Date.parse(now.toString()) / 1000);
      // console.log("lastClaimDate", now);
      // console.log(
      //   "secondsLeft",
      //   Math.floor(
      //     Date.parse(now.toString()) / 1000 + currentUser!.company.claimPointsInterval! / 1000 - now.getTime() / 1000
      //   )
      // );

      setLastClaim(Date.parse(now.toString()) / 1000);
      setSecondsLeft(
        Math.floor(
          Date.parse(now.toString()) / 1000 + currentUser!.company.claimPointsInterval! / 1000 - now.getTime() / 1000
        )
      );

      console.log("here");
      console.log(new Date(lastClaim * 1000 + currentUser!.company.claimPointsInterval!));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack spacing={50}>
      <Grid>
        <Grid.Col sm={12} md={4} miw="fit-content">
          <Card padding={30} h="100%">
            <Stack>
              <Flex justify="space-between" align="center" gap={20}>
                <Text size={24}>Points</Text>
                <Text size={32} fw={700}>
                  {currentUser?.user.points}
                </Text>
              </Flex>

              <Countdown
                date={new Date(lastClaim * 1000 + currentUser!.company.claimPointsInterval!)}
                renderer={({ hours, minutes, seconds }) => (
                  <Button
                    w="100%"
                    disabled={(lastClaim !== null && secondsLeft > 0) || currentUser?.company.claimPoints === null}
                    onClick={handleClaimPoints}
                    id="custom-disabled"
                  >
                    {secondsLeft > 0
                      ? `Available in ${hours.toString().padStart(2, "0")}:${minutes
                          .toString()
                          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                      : currentUser?.company.claimPoints === null
                      ? "Points not claimable now"
                      : "Claim"}
                  </Button>
                )}
              >
                <Button
                  w="100%"
                  disabled={currentUser?.company.claimPoints === null}
                  onClick={handleClaimPoints}
                  id="custom-disabled"
                >
                  {"Claim"}
                </Button>
              </Countdown>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col sm={12} md={4} miw="fit-content">
          <Card padding={30} h="100%">
            <Stack>
              <Flex justify="space-between" align="center" gap={20}>
                <Text size={24}>Tasks created</Text>
                <Text size={32} fw={700}>
                  {tasksCreated.length}
                </Text>
              </Flex>

              <Link to="/tasks">
                <Button id="custom-disabled" disabled={currentUser!.user.points === 0} w="100%" onClick={() => {}}>
                  {currentUser!.user.points === 0 ? "You have 0 points" : "Create task"}
                </Button>
              </Link>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col sm={12} md={4} h="100%" miw="fit-content">
          <Card padding={30}>
            <Stack>
              <Flex justify="space-between" align="center" gap={20}>
                <Text size={24}>Tasks completed</Text>
                <Text size={32} fw={700}>
                  {tasksCompleted.length}
                </Text>
              </Flex>

              <Link to="/tasks">
                <Button w="100%" onClick={() => {}}>
                  Let's complete some tasks
                </Button>
              </Link>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Box>
        <Title>My active tasks</Title>
        <CustomTable
          tableData={{
            header: [
              { name: "title", label: "Title" },
              { name: "deadline", label: "Deadline" },
            ],
            data: tasksCreated.filter((x: any) => !x.completed),
          }}
        />
      </Box>
    </Stack>
  );
};

export default Dashboard;
