import React from "react";
import { ThemeIcon, UnstyledButton, Group, Text, Divider } from "@mantine/core";
import {
  MdOutlineAdminPanelSettings,
  MdQueryStats,
  MdOutlineDashboard,
  MdInsertDriveFile,
  MdShoppingBasket,
  MdLogout,
} from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

interface MainLinkProps {
  url: string | null;
  icon: React.ReactNode;
  label: string;
}

interface NavbarLinksProps {
  handleOnClick: () => void;
}

function MainLink({ url, icon, label }: MainLinkProps) {
  return url ? (
    <UnstyledButton
      component={NavLink}
      to={url}
      sx={theme => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,

        "&:hover": {
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group spacing="xs">
        <ThemeIcon>{icon}</ThemeIcon>

        <Text fw={500} size="sm">
          {label}
        </Text>
      </Group>
    </UnstyledButton>
  ) : (
    <UnstyledButton
      sx={theme => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,

        "&:hover": {
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group spacing="xs">
        <ThemeIcon>{icon}</ThemeIcon>

        <Text fw={500} size="sm">
          {label}
        </Text>
      </Group>
    </UnstyledButton>
  );
}

const adminLinks = [
  {
    url: "/admin-dashboard",
    icon: <MdOutlineAdminPanelSettings size="1rem" />,
    label: "Admin Dashboard",
  },
  { url: "/statistics", icon: <MdQueryStats size="1rem" />, label: "Statistics" },
];
const userLinks = [
  { url: "/dashboard", icon: <MdOutlineDashboard size="1rem" />, label: "Dashboard" },
  { url: "/tasks", icon: <MdInsertDriveFile size="1rem" />, label: "Tasks" },
  { url: "/rewards", icon: <MdShoppingBasket size="1rem" />, label: "Rewards" },
  { url: "/badges", icon: <HiOutlineBadgeCheck size="1rem" />, label: "Badges" },
];

export function NavbarLinks({ handleOnClick }: NavbarLinksProps) {
  const { currentUser, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully!");
  };

  return (
    <div>
      {currentUser!.user.admin && (
        <>
          {adminLinks.map(link => (
            <div key={link.label} onClick={handleOnClick}>
              <MainLink {...link} key={link.label} />
            </div>
          ))}
          <Divider my="lg" />
        </>
      )}

      {userLinks.map(link => (
        <div key={link.label} onClick={handleOnClick}>
          <MainLink {...link} />
        </div>
      ))}

      <Divider my="lg" />

      <div onClick={handleLogout}>
        <MainLink url={null} icon={<MdLogout size="1rem" />} label="Logout" />
      </div>
    </div>
  );
}
