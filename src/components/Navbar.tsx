import { createStyles, Header, Group, Button, Text, Divider, Box, Burger, Drawer, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const useStyles = createStyles(theme => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("xs")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
    }),
  },

  hiddenMobile: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },
}));

export function Navbar() {
  const { currentUser } = useAuth();
  const { classes, theme } = useStyles();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <Box>
      <Header height={60} px={40}>
        <Group position="apart" sx={{ height: "100%" }}>
          <Text color="#1971c2" size={24}>
            <Link to="/">
              <b>Pritel</b>
            </Link>
          </Text>
          {/* <MantineLogo size={30} /> */}

          <Group sx={{ height: "100%" }} spacing={0} className={classes.hiddenMobile}>
            <a href="#" className={classes.link}>
              Home
            </a>
            <a href="#" className={classes.link}>
              Learn
            </a>
            <a href="#" className={classes.link}>
              Academy
            </a>
          </Group>

          {currentUser ? (
            <Group className={classes.hiddenMobile}>
              <Link to="/dashboard">
                <Button>Go to dashboard</Button>
              </Link>
            </Group>
          ) : (
            <Group className={classes.hiddenMobile}>
              <Link to="/enroll">
                <Button variant="default">Enroll</Button>
              </Link>
              <Link to="/signin">
                <Button>Sign in</Button>
              </Link>
            </Group>
          )}

          <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <Box>
          <Divider mb="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

          <a href="#" className={classes.link}>
            Home
          </a>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>

          <Divider my="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

          <Group position="center" grow px="md">
            <Link to="/enroll">
              <Button w="100%" variant="default">
                Enroll
              </Button>
            </Link>
            <Link to="/signin">
              <Button w="100%">Sign in</Button>
            </Link>
          </Group>
        </Box>
      </Drawer>
    </Box>
  );
}
