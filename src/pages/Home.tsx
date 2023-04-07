import { createStyles, Title, Text, Button, Container, rem } from "@mantine/core";
import { Dots } from "../components/Dots";
import { Link } from "react-router-dom";
import { FeaturesSection } from "../components/FeaturesSection";

const useStyles = createStyles(theme => ({
  wrapper: {
    position: "relative",
    paddingTop: rem(180),
    paddingBottom: rem(180),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(80),
      paddingBottom: rem(80),
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  dots: {
    position: "absolute",
    color: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],

    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",
    gap: "2rem",

    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      flexDirection: "column",
    },
  },

  control: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan("xs")]: {
      height: rem(42),
      width: "100%",
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

export function Home() {
  const { classes } = useStyles();

  return (
    <>
      <Container className={classes.wrapper} size={1400}>
        <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
        <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

        <div className={classes.inner}>
          <Title className={classes.title}>
            <Text component="span" className={classes.highlight} inherit>
              Pritel
            </Text>
            , gamify your workplace
          </Title>

          <Container p={0} size={600}>
            <Text size="lg" color="dimmed" className={classes.description}>
              See how gamification can transform your workplace into a fun and rewarding environment!
            </Text>
          </Container>

          <div className={classes.controls}>
            <Link to="/enroll">
              <Button className={classes.control} size="md" variant="default" color="gray">
                Enroll
              </Button>
            </Link>
            <Link to="/signin">
              <Button className={classes.control} size="md">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      <FeaturesSection title="Integrate effortlessly with your company" />

      {/* <FeaturesSection title="Integrate effortlessly with your company" /> */}
    </>
  );
}
