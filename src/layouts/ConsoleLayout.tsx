import { useState, ReactNode } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Flex,
  Stack,
  UnstyledButton,
  Title,
} from "@mantine/core";
import { NavbarLinks } from "../components/NavbarLinks";
import AvatarUser from "../components/AvatarUser";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ConsoleLayoutProps {
  children: ReactNode;
}

export default function ConsoleLayout({ children }: ConsoleLayoutProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const { userLoading } = useAuth();

  if (userLoading) return null;

  return (
    <AppShell
      styles={{
        main: {
          overflow: "hidden",
          background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      layout="alt"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 250, lg: 300 }}>
          <Navbar.Section p="md">
            <Flex align={"center"} justify={"space-between"}>
              <Link to="/">
                <Title order={2} px={"0.625rem"}>
                  Pritel
                </Title>
              </Link>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger opened={opened} onClick={() => setOpened(o => !o)} size="sm" color={theme.colors.gray[6]} />
              </MediaQuery>
            </Flex>
          </Navbar.Section>

          <Navbar.Section grow p="md">
            <NavbarLinks handleOnClick={() => setOpened(false)} />
          </Navbar.Section>

          <Navbar.Section p="md">
            <UnstyledButton>
              <AvatarUser />
            </UnstyledButton>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
          <Header height={{ base: 50, sm: 0 }} p="md">
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened(o => !o)}
                  size="md"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Text>Application header</Text>
            </div>
          </Header>
        </MediaQuery>
      }
    >
      <Stack spacing={50} p={"2rem"}>
        {children}
      </Stack>
    </AppShell>
  );
}
