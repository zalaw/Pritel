import { FC, ReactNode } from "react";
import { ThemeIcon, Text, Title, Container, SimpleGrid, createStyles, rem } from "@mantine/core";
import { AiOutlineFileText, AiOutlineFileDone } from "react-icons/ai";
import { BiCustomize, BiBadge } from "react-icons/bi";
import { MdOutlineAnalytics } from "react-icons/md";
import { TbPointFilled } from "react-icons/tb";

export const MOCKDATA = [
  {
    icon: AiOutlineFileText,
    title: "Task creation",
    description:
      "Employees can create tasks and assign points to them, making it easy to track progress and measure results.",
  },
  {
    icon: AiOutlineFileDone,
    title: "Task completion",
    description: "Once a task is complete, users receive points that can be redeemed for rewards.",
  },
  {
    icon: TbPointFilled,
    title: "Point redemption",
    description: "Points can be redeemed for a variety of rewards, including gift cards, merchandise, and experiences.",
  },
  {
    icon: BiBadge,
    title: "Badge system",
    description:
      "Users can earn badges for completing certain tasks or achieving specific milestones, adding an element of fun and competition to the workplace.",
  },
  {
    icon: BiCustomize,
    title: "Customizable rewards",
    description:
      "Companies can customize rewards to align with their brand and culture, making the program more personalized and engaging for their employees.",
  },
  {
    icon: MdOutlineAnalytics,
    title: "Reporting and analytics",
    description:
      "The app provides reporting and analytics, allowing companies to track performance, measure results, and identify areas for improvement.",
  },
];

interface FeatureProps {
  icon: FC<any>;
  title: ReactNode;
  description: ReactNode;
}

export function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div>
      <ThemeIcon variant="light" size={50} radius={50}>
        <Icon size="1.5rem" stroke={1.5} />
      </ThemeIcon>
      <Text mt="sm" mb={7}>
        {title}
      </Text>
      <Text size="sm" color="dimmed" sx={{ lineHeight: 1.6 }}>
        {description}
      </Text>
    </div>
  );
}

const useStyles = createStyles(theme => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 1)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    marginBottom: theme.spacing.md,
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("sm")]: {
      textAlign: "left",
    },
  },
}));

interface FeaturesGridProps {
  title: ReactNode;
  data?: FeatureProps[];
}

export function FeaturesSection({ title, data = MOCKDATA }: FeaturesGridProps) {
  const { classes } = useStyles();
  const features = data.map((feature, index) => <Feature {...feature} key={index} />);

  return (
    <Container className={classes.wrapper}>
      <Title className={classes.title}>{title}</Title>

      <SimpleGrid
        mt={50}
        cols={3}
        spacing={40}
        breakpoints={[
          { maxWidth: 850, cols: 2, spacing: "xl" },
          { maxWidth: 500, cols: 1, spacing: "xl" },
        ]}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}

// import { createStyles, Text, SimpleGrid, Container, Title, rem } from "@mantine/core";
// import { AiOutlineFileText, AiOutlineFileDone } from "react-icons/ai";
// import { BiCustomize, BiBadge } from "react-icons/bi";
// import { MdOutlineAnalytics } from "react-icons/md";
// import { TbPointFilled } from "react-icons/tb";

// const useStyles = createStyles(theme => ({
//   feature: {
//     position: "relative",
//     paddingTop: theme.spacing.xl,
//     paddingLeft: theme.spacing.xl,
//   },

//   overlay: {
//     position: "absolute",
//     height: rem(100),
//     width: rem(160),
//     top: 0,
//     left: 0,
//     backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
//     zIndex: 1,
//   },

//   content: {
//     position: "relative",
//     zIndex: 2,
//   },

//   icon: {
//     color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
//   },

//   title: {
//     color: theme.colorScheme === "dark" ? theme.white : theme.black,
//   },

//   sectionTitle: {
//     fontFamily: `Greycliff CF, ${theme.fontFamily}`,
//     fontWeight: 900,
//     marginBottom: theme.spacing.md,
//     textAlign: "center",

//     [theme.fn.smallerThan("sm")]: {
//       fontSize: rem(28),
//       textAlign: "left",
//     },
//   },
// }));

// interface FeatureProps extends React.ComponentPropsWithoutRef<"div"> {
//   icon: React.FC<any>;
//   title: string;
//   description: string;
// }

// function Feature({ icon: Icon, title, description, className, ...others }: FeatureProps) {
//   const { classes, cx } = useStyles();

//   return (
//     <div className={cx(classes.feature, className)} {...others}>
//       <div className={classes.overlay} />

//       <div className={classes.content}>
//         <Icon size={rem(28)} className={classes.icon} stroke={1.5} />
//         <Text fw={700} fz="lg" mb="xs" mt={5} className={classes.title}>
//           {title}
//         </Text>
//         <Text c="dimmed" fz="sm">
//           {description}
//         </Text>
//       </div>
//     </div>
//   );
// }

// export const MOCKDATA = [
//   {
//     icon: AiOutlineFileText,
//     title: "Task creation",
//     description:
//       "Employees can create tasks and assign points to them, making it easy to track progress and measure results.",
//   },
//   {
//     icon: AiOutlineFileDone,
//     title: "Task completion",
//     description: "Once a task is complete, users receive points that can be redeemed for rewards.",
//   },
//   {
//     icon: TbPointFilled,
//     title: "Point redemption",
//     description: "Points can be redeemed for a variety of rewards, including gift cards, merchandise, and experiences.",
//   },
//   {
//     icon: BiBadge,
//     title: "Badge system",
//     description:
//       "Users can earn badges for completing certain tasks or achieving specific milestones, adding an element of fun and competition to the workplace.",
//   },
//   {
//     icon: BiCustomize,
//     title: "Customizable rewards",
//     description:
//       "Companies can customize rewards to align with their brand and culture, making the program more personalized and engaging for their employees.",
//   },
//   {
//     icon: MdOutlineAnalytics,
//     title: "Reporting and analytics",
//     description:
//       "The app provides reporting and analytics, allowing companies to track performance, measure results, and identify areas for improvement.",
//   },
// ];

// interface FeaturesSectionProps {
//   title: string;
// }

// export function FeaturesSection({ title }: FeaturesSectionProps) {
//   const { classes } = useStyles();

//   const items = MOCKDATA.map(item => <Feature {...item} key={item.title} />);

//   return (
//     <Container py={80} size="lg">
//       <Title className={classes.sectionTitle}>{title}</Title>

//       <SimpleGrid
//         cols={3}
//         breakpoints={[
//           { maxWidth: "sm", cols: 2 },
//           { maxWidth: "xs", cols: 1 },
//         ]}
//         spacing={50}
//       >
//         {items}
//       </SimpleGrid>
//     </Container>
//   );
// }
