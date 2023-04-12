import { createStyles, useMantineTheme, Container, Title, Text, Button, Group, rem } from "@mantine/core";
import { Link } from "react-router-dom";

const useStyles = createStyles(theme => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  inner: {
    position: "relative",
  },

  image: {
    ...theme.fn.cover(),
    opacity: 0.75,
  },

  content: {
    position: "relative",
    zIndex: 1,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(540),
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}));

export function Illustration(props: React.ComponentPropsWithoutRef<"svg">) {
  const theme = useMantineTheme();
  return (
    <svg
      style={{ width: "100%" }}
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="165.000000pt"
      height="80.000000pt"
      viewBox="0 0 165.000000 80.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(0.000000,80.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
        <path
          fill={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
          d="M803 731 c-87 -40 -133 -154 -133 -329 0 -196 42 -294 142 -337 78
-32 178 -9 230 53 49 58 63 122 63 282 0 160 -14 224 -63 282 -54 64 -157 86
-239 49z m139 -132 c48 -64 45 -354 -4 -406 -30 -32 -74 -28 -102 10 -19 25
-21 45 -24 169 -4 162 0 195 29 233 27 34 74 31 101 -6z"
        />
        <path
          fill={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
          d="M1430 741 c0 -20 -87 -105 -137 -133 l-53 -30 0 -64 0 -64 43 21 c23
12 59 35 80 51 l37 30 0 -246 0 -246 70 0 70 0 0 345 0 345 -55 0 c-30 0 -55
-4 -55 -9z"
        />
        <path
          fill={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
          d="M267 531 l-147 -209 0 -61 0 -61 140 0 140 0 0 -70 0 -70 60 0 60 0
0 70 0 70 45 0 45 0 0 60 0 60 -45 0 -45 0 0 210 0 210 -53 0 -53 0 -147 -209z
m130 -208 c-3 -2 -38 -3 -80 -1 l-75 3 77 110 76 110 3 -109 c1 -60 1 -110 -1
-113z"
        />
      </g>
    </svg>
  );
}

export function Unauthorized() {
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Access is denied</Title>
          <Text color="dimmed" size="lg" align="center" className={classes.description}>
            You don't have permission to view this page
          </Text>
          <Group position="center">
            <Link to="/">
              <Button size="md">Take me back to home page</Button>
            </Link>
          </Group>
        </div>
      </div>
    </Container>
  );
}
