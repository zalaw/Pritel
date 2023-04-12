import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  createStyles,
  Navbar,
  Text,
  Group,
  Code,
  getStylesRef,
  rem,
  Box,
  Drawer,
  ScrollArea,
  Divider,
  UnstyledButton,
  Center,
  Button,
  Collapse,
  Burger,
} from "@mantine/core";
import { MdDashboard, MdCloud, MdLogout } from "react-icons/md";
import { TbPointFilled } from "react-icons/tb";
import { AiOutlineFileText } from "react-icons/ai";
import { BiCustomize } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import Countdown from "react-countdown";

const useStyles = createStyles(theme => ({
  navbar: {
    backgroundColor: theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background,

    [theme.fn.smallerThan("sm")]: {
      position: "fixed",

      padding: 0,
    },
  },

  version: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
      0.1
    ),
    color: theme.white,
    fontWeight: 700,
  },

  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
      0.1
    )}`,
  },

  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.fn.lighten(
      theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
      0.1
    )}`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    cursor: "pointer",
    fontSize: theme.fontSizes.sm,
    color: theme.white,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
        0.1
      ),
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.white,
    opacity: 0.75,
    marginRight: theme.spacing.sm,
    fontSize: 24,
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background!,
        0.15
      ),
      [`& .${getStylesRef("icon")}`]: {
        opacity: 0.9,
      },
    },
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const data = [
  { adminOnly: true, link: "/admin", label: "Admin", icon: MdDashboard },
  { adminOnly: false, link: "/dashboard", label: "Dashboard", icon: MdDashboard },
  { adminOnly: false, link: "/tasks", label: "Tasks", icon: AiOutlineFileText },
  { adminOnly: false, link: "/rewards", label: "Rewards", icon: BiCustomize },
  { adminOnly: false, link: "/badges", label: "Badges", icon: BiCustomize },
];

// function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
//   const { classes, cx } = useStyles();
//   return (
//     <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
//       <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
//         <Icon size="1.2rem" stroke={1.5} />
//       </UnstyledButton>
//     </Tooltip>
//   );
// }

export default function Sidebar() {
  const { classes, cx, theme } = useStyles();
  const [active, setActive] = useState("Dashboard");
  const { logout } = useAuth();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleOnClick = (label: string) => {
    setActive(label);
  };

  useEffect(() => {
    const map: { [index: string]: string } = {
      "/admin": "Admin",
      "/dashboard": "Dashboard",
      "/tasks": "Tasks",
      "/badges": "Badges",
    };

    setActive(map[window.location.pathname]);
  }, []);

  const links = data.map(
    item =>
      Number(currentUser!.user.admin) >= Number(item.adminOnly) && (
        <Link
          key={item.label}
          className={cx(classes.link, { [classes.linkActive]: item.label === active })}
          to={item.link}
          onClick={e => handleOnClick(item.label)}
        >
          <item.icon className={classes.linkIcon} />
          <span>{item.label}</span>
        </Link>
      )
  );

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Box>
      <Navbar height="100%" width={{ xs: 300 }} p="md" className={`${classes.navbar} ${classes.hiddenMobile}`}>
        <Navbar.Section grow>
          <Group className={classes.header} position="apart">
            {/* <MantineLogo size={28} inverted /> */}
            <Text color="white" style={{ fontWeight: "bold" }}>
              <Link to="/">Pritel</Link>
            </Text>
          </Group>
          {links}
        </Navbar.Section>

        <Navbar.Section className={classes.footer}>
          <span className={classes.link} onClick={handleLogout}>
            <MdLogout className={classes.linkIcon} />
            <span>Logout</span>
          </span>
        </Navbar.Section>
      </Navbar>

      <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider my="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

          <a href="#" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              {/* <IconChevronDown size={16} color={theme.fn.primaryColor()} /> */}
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>

          <Divider my="sm" color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"} />

          <Group position="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
