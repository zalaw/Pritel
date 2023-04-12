import { useState, useEffect } from "react";
import {
  Card,
  Grid,
  createStyles,
  Button,
  Stack,
  Text,
  Flex,
  Title,
  Chip,
  Badge,
  Loader,
  Container,
} from "@mantine/core";
import { useAuth, CurrentUser } from "../contexts/AuthContext";
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import BadgeCard from "../components/BadgeCard";
import { FaTasks, FaTrophy, FaGift } from "react-icons/fa";
import { MdPlaylistAddCheck, MdStar, MdCardGiftcard } from "react-icons/md";
import { IoMdClipboard, IoMdGift } from "react-icons/io";
import { AiOutlineBulb, AiOutlineCheck } from "react-icons/ai";
import { HiOutlineSparkles } from "react-icons/hi";
import { RiTaskLine, RiMedalLine, RiGiftLine } from "react-icons/ri";
import { BsCheck } from "react-icons/bs";
import { GiRabbit, GiMedal } from "react-icons/gi";
import { FiTarget } from "react-icons/fi";
import { BiGift } from "react-icons/bi";

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
  },

  badgesContainer: {},
}));

const Badges = () => {
  const { classes } = useStyles();
  const { currentUser, setCurrentUser } = useAuth();

  const [tasksCreated, setTasksCreated] = useState<any>([]);
  const [tasksCompleted, setTasksCompleted] = useState<any>([]);

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

  const badges = [
    {
      label: "Tasks creation badges",
      data: [
        {
          icon: FaTasks,
          title: "Task Apprentice",
          subtitle: "The Task Idea Generator",
          current: tasksCreated.length,
          total: 5,
        },
        {
          icon: MdPlaylistAddCheck,
          title: "Task Enthusiast",
          subtitle: "The Proactive Planner",
          current: tasksCreated.length,
          total: 25,
        },
        {
          icon: IoMdClipboard,
          title: "Task Mastermind",
          subtitle: "The Strategic Task Creator",
          current: tasksCreated.length,
          total: 100,
        },
        {
          icon: AiOutlineBulb,
          title: "Task Virtuoso",
          subtitle: "The Prolific Task Initiator",
          current: tasksCreated.length,
          total: 250,
        },
        {
          icon: HiOutlineSparkles,
          title: "Task Dynamo",
          subtitle: "The Task Generation Prodigy",
          current: tasksCreated.length,
          total: 500,
        },
      ],
    },
    {
      label: "Tasks completion badges",
      data: [
        {
          icon: RiTaskLine,
          title: "Task Tackler",
          subtitle: "The Diligent Task Finisher",
          current: tasksCompleted.length,
          total: 5,
        },
        {
          icon: BsCheck,
          title: "Task Crusher",
          subtitle: "The Persistent Task Accomplisher",
          current: tasksCompleted.length,
          total: 25,
        },
        {
          icon: GiRabbit,
          title: "Task Champion",
          subtitle: "The Consistent Task Executor",
          current: tasksCompleted.length,
          total: 100,
        },
        {
          icon: MdPlaylistAddCheck,
          title: "Task Maestro",
          subtitle: "The Accomplishment Virtuoso",
          current: tasksCompleted.length,
          total: 250,
        },
        {
          icon: AiOutlineCheck,
          title: "Task Overlord",
          subtitle: "The Unstoppable Productivity Dynamo",
          current: tasksCompleted.length,
          total: 500,
        },
      ],
    },
    {
      label: "Points collection badges",
      data: [
        {
          icon: FiTarget,
          title: "Point Seeker",
          subtitle: "The Goal-Driven Achievement Hunter",
          current: currentUser!.user.pointsCollected,
          total: (currentUser!.company.claimPoints || 1) * 5,
        },
        {
          icon: GiMedal,
          title: "Point Collector",
          subtitle: "The Avid Points Accumulator",
          current: currentUser!.user.pointsCollected,
          total: (currentUser!.company.claimPoints || 1) * 10,
        },
        {
          icon: MdStar,
          title: "Point Enthusiast",
          subtitle: "The Focused Points Pursuer",
          current: currentUser!.user.pointsCollected,
          total: (currentUser!.company.claimPoints || 1) * 25,
        },
        {
          icon: RiMedalLine,
          title: "Point Maven",
          subtitle: "The Points Gathering Expert",
          current: currentUser!.user.pointsCollected,
          total: (currentUser!.company.claimPoints || 1) * 50,
        },
        {
          icon: FaTrophy,
          title: "Point Champion",
          subtitle: "The Accomplished Points Earner",
          current: currentUser!.user.pointsCollected,
          total: (currentUser!.company.claimPoints || 1) * 100,
        },
      ],
    },
    {
      label: "Points spending badges",
      data: [
        {
          icon: IoMdGift,
          title: "Reward Enthusiast",
          subtitle: "The Savvy Points Redeemer",
          current: currentUser!.user.pointsSpent,
          total: (currentUser!.company.claimPoints || 1) * 5,
        },
        {
          icon: RiGiftLine,
          title: "Reward Aficionado",
          subtitle: "The Points Redemption Expert",
          current: currentUser!.user.pointsSpent,
          total: (currentUser!.company.claimPoints || 1) * 10,
        },
        {
          icon: FaGift,
          title: "Reward Guru",
          subtitle: "The Discerning Points Spender",
          current: currentUser!.user.pointsSpent,
          total: (currentUser!.company.claimPoints || 1) * 25,
        },
        {
          icon: BiGift,
          title: "Reward Connoisseur",
          subtitle: "The Astute Points Exchanger",
          current: currentUser!.user.pointsSpent!,
          total: (currentUser!.company.claimPoints || 1) * 50,
        },
        {
          icon: MdCardGiftcard,
          title: "Reward Maestro",
          subtitle: "The Prized Possession Prodigy",
          current: currentUser!.user.pointsSpent,
          total: (currentUser!.company.claimPoints || 1) * 100,
        },
      ],
    },
  ];

  return (
    <>
      {badges.map(entry => {
        return (
          <div key={entry.label}>
            <Title>{entry.label}</Title>
            <div className="badges-row">
              {entry.data.map(badge => {
                return (
                  // <Grid.Col sm={12} md={4}>
                  <div key={badge.title} style={{ minWidth: "20rem" }}>
                    <BadgeCard {...badge} />
                  </div>
                  // </Grid.Col>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Badges;
