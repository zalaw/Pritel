import { createStyles, ThemeIcon, Progress, Text, Group, Badge, Paper, rem } from "@mantine/core";
import { IconType } from "react-icons";

const ICON_SIZE = rem(60);

const useStyles = createStyles(theme => ({
  card: {
    position: "relative",
    overflow: "visible",
    padding: theme.spacing.xl,
    paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
  },

  icon: {
    position: "absolute",
    top: `calc(-${ICON_SIZE} / 3)`,
    left: `calc(50% - ${ICON_SIZE} / 2)`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

interface BadgeCardProps {
  icon: IconType;
  title: string;
  subtitle: string;
  current: number;
  total: number;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ icon: Icon, title, subtitle, current, total }) => {
  const { classes } = useStyles();

  return (
    <Paper radius="md" withBorder className={classes.card} mt={`calc(${ICON_SIZE} / 3)`}>
      <ThemeIcon
        color={current / total >= 1 ? "blue" : "gray"}
        className={classes.icon}
        size={ICON_SIZE}
        radius={ICON_SIZE}
      >
        <Icon size="1.5rem" />
      </ThemeIcon>

      <Text ta="center" fw={700} className={classes.title}>
        {title}
      </Text>
      <Text c="dimmed" ta="center" fz="sm">
        {subtitle}
      </Text>

      <Group position="apart" mt="xs">
        <Text fz="sm" color="dimmed">
          Progress
        </Text>
        <Text fz="sm" color="dimmed">
          {(current / total) * 100 >= 100 ? 100 : ((current / total) * 100).toFixed(2)}%
        </Text>
      </Group>

      <Progress
        color={current / total >= 1 ? "blue" : "rgb(120, 120, 120)"}
        value={(current / total) * 100 >= 100 ? 100 : Number(((current / total) * 100).toFixed(2))}
        mt={5}
      />

      <Group position="apart" mt="md">
        <Text fz="sm">
          {(current / total) * 100 >= 100 ? total : current} / {total}
        </Text>
      </Group>
    </Paper>
  );
};

export default BadgeCard;
