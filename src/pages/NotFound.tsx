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
    // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 362 145" {...props}>
    //   <path
    //     fill={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
    //     d="M62.6 142c-2.133 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2L58.2 4c.8-1.333 2.067-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .667.533 1 1.267 1 2.2v21.2c0 .933-.333 1.733-1 2.4-.667.533-1.467.8-2.4.8H93v20.8c0 2.133-1.067 3.2-3.2 3.2H62.6zM33 90.4h26.4V51.2L33 90.4zM181.67 144.6c-7.333 0-14.333-1.333-21-4-6.666-2.667-12.866-6.733-18.6-12.2-5.733-5.467-10.266-13-13.6-22.6-3.333-9.6-5-20.667-5-33.2 0-12.533 1.667-23.6 5-33.2 3.334-9.6 7.867-17.133 13.6-22.6 5.734-5.467 11.934-9.533 18.6-12.2 6.667-2.8 13.667-4.2 21-4.2 7.467 0 14.534 1.4 21.2 4.2 6.667 2.667 12.8 6.733 18.4 12.2 5.734 5.467 10.267 13 13.6 22.6 3.334 9.6 5 20.667 5 33.2 0 12.533-1.666 23.6-5 33.2-3.333 9.6-7.866 17.133-13.6 22.6-5.6 5.467-11.733 9.533-18.4 12.2-6.666 2.667-13.733 4-21.2 4zm0-31c9.067 0 15.6-3.733 19.6-11.2 4.134-7.6 6.2-17.533 6.2-29.8s-2.066-22.2-6.2-29.8c-4.133-7.6-10.666-11.4-19.6-11.4-8.933 0-15.466 3.8-19.6 11.4-4 7.6-6 17.533-6 29.8s2 22.2 6 29.8c4.134 7.467 10.667 11.2 19.6 11.2zM316.116 142c-2.134 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2l56.6-84.6c.8-1.333 2.066-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .666.533 1 1.267 1 2.2v21.2c0 .933-.334 1.733-1 2.4-.667.533-1.467.8-2.4.8h-11.2v20.8c0 2.133-1.067 3.2-3.2 3.2h-27.2zm-29.6-51.6h26.4V51.2l-26.4 39.2z"
    //   />
    // </svg>
    <svg
      style={{ width: "100%" }}
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="166.000000pt"
      height="80.000000pt"
      viewBox="0 0 166.000000 80.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(0.000000,80.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
        <path
          fill={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
          d="M743 731 c-87 -40 -133 -154 -133 -329 0 -196 42 -294 142 -337 78
-32 178 -9 230 53 49 58 63 122 63 282 0 160 -14 224 -63 282 -54 64 -157 86
-239 49z m139 -132 c48 -64 45 -354 -4 -406 -30 -32 -74 -28 -102 10 -19 25
-21 45 -24 169 -4 162 0 195 29 233 27 34 74 31 101 -6z"
        />
        <path
          fill={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
          d="M207 531 l-147 -209 0 -61 0 -61 140 0 140 0 0 -70 0 -70 60 0 60 0
0 70 0 70 45 0 45 0 0 60 0 60 -45 0 -45 0 0 210 0 210 -53 0 -53 0 -147 -209z
m130 -208 c-3 -2 -38 -3 -80 -1 l-75 3 77 110 76 110 3 -109 c1 -60 1 -110 -1
-113z"
        />
        <path
          fill={theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0]}
          d="M1267 531 l-147 -209 0 -61 0 -61 140 0 140 0 0 -70 0 -70 60 0 60 0
0 70 0 70 45 0 45 0 0 60 0 60 -45 0 -45 0 0 210 0 210 -53 0 -53 0 -147 -209z
m130 -208 c-3 -2 -38 -3 -80 -1 l-75 3 77 110 76 110 3 -109 c1 -60 1 -110 -1
-113z"
        />
      </g>
    </svg>
  );
}

export function NotFound() {
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text color="dimmed" size="lg" align="center" className={classes.description}>
            Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to
            another URL. If you think this is an error contact support.
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
