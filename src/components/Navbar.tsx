import { createStyles, Header, Group, Button, Text, Divider, Box, Burger, Drawer, rem, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const useStyles = createStyles(theme => ({
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  navbarButton: {
    [theme.fn.smallerThan("xs")]: {
      fontSize: 12,
    },
  },

  hiddenMobile: {},

  hiddenDesktop: {},
}));

export function Navbar() {
  const { currentUser, userLoading, logout } = useAuth();
  const { classes } = useStyles();

  console.log(currentUser);

  return (
    <Box className={classes.navbar}>
      <Header height={60} px={20}>
        <Group position="apart" sx={{ height: "100%" }}>
          <Text color="#1971c2" size={24}>
            <Link to="/">
              <b>Pritel</b>
            </Link>
          </Text>

          {userLoading ? (
            <Loader className={classes.hiddenMobile} size="sm" />
          ) : currentUser ? (
            <Group className={classes.hiddenMobile}>
              <Link to="/dashboard">
                <Button className={classes.navbarButton}>Go to dashboard</Button>
              </Link>
              <Text className={classes.navbarButton} size="sm" style={{ cursor: "pointer" }} onClick={() => logout()}>
                Logout
              </Text>
            </Group>
          ) : (
            <Group className={classes.hiddenMobile}>
              <Link to="/enroll">
                <Button className={classes.navbarButton} variant="default">
                  Enroll
                </Button>
              </Link>
              <Link to="/signin">
                <Button className={classes.navbarButton}>Sign in</Button>
              </Link>
            </Group>
          )}
        </Group>
      </Header>
    </Box>
  );
}
