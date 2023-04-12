// import { createStyles, getStylesRef, rem } from "@mantine/styles";
// import Sidebar from "./Sidebar";
// import { Outlet } from "react-router-dom";
// import { ScrollArea } from "@mantine/core";

// const useStyles = createStyles(theme => ({
//   wrapper: {
//     display: "flex",
//     flex: "1 1 auto",
//     width: "100%",
//     position: "relative",

//     [theme.fn.smallerThan("sm")]: {
//       flexDirection: "column",
//       gap: 20,
//       padding: 20,
//     },
//   },

//   hiddenMobile: {
//     [theme.fn.smallerThan("sm")]: {
//       display: "none",
//       flexDirection: "column",
//     },
//   },

//   hiddenDesktop: {
//     [theme.fn.largerThan("sm")]: {
//       display: "none",
//     },
//   },
// }));

// export default function Layout() {
//   const { classes } = useStyles();

//   return (
//     <div className={classes.wrapper}>
//       <Sidebar />
//       <div style={{ maxHeight: "100vh", width: "100%", overflowY: "auto" }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Stack,
} from "@mantine/core";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppShellDemo() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          width: "100%",
          background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="xs"
      asideOffsetBreakpoint="xs"
      navbar={
        // <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
        //   <Text>Application navbar</Text>
        // </Navbar>
        <Sidebar />
      }
      // header={
      //   <Header height={{ base: 50, md: 70 }} p="md">
      //     <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      //       <MediaQuery largerThan="sm" styles={{ display: "none" }}>
      //         <Burger
      //           opened={opened}
      //           onClick={() => setOpened(o => !o)}
      //           size="sm"
      //           color={theme.colors.gray[6]}
      //           mr="xl"
      //         />
      //       </MediaQuery>

      //       <Text>Application header</Text>
      //     </div>
      //   </Header>
      // }
    >
      <Stack spacing={80} style={{ padding: "2rem" }}>
        <Outlet />
      </Stack>
    </AppShell>
  );
}
