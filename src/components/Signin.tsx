import { useFormik } from "formik";
import { signInSchema } from "../schemas";
import { MdWarning } from "react-icons/md";
import { simulateLoading } from "../dev/helpers";
import { Paper, createStyles, TextInput, PasswordInput, Button, Title, rem } from "@mantine/core";

const useStyles = createStyles(theme => ({
  wrapper: {
    minHeight: "100%",
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "2rem",
    borderRight: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]}`,
    minHeight: "100%",
    maxWidth: rem(400),

    [theme.fn.smallerThan("xs")]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  invalid: {
    backgroundColor: theme.colorScheme === "dark" ? theme.fn.rgba(theme.colors.red[8], 0.15) : theme.colors.red[0],
  },

  icon: {
    color: theme.colors.red[theme.colorScheme === "dark" ? 7 : 6],
  },
}));

interface IValues {
  email: string;
  password: string;
}

export default function Signup() {
  const { classes } = useStyles();

  const onSubmit = async (values: IValues) => {
    await simulateLoading(100, 1000);
    console.log(values);
  };

  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: signInSchema,
    onSubmit,
  });

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={40}>
        <Title order={2} className={classes.title} ta="center" mt="md">
          Welcome back to Pritel!
        </Title>

        <form onSubmit={handleSubmit} autoComplete="off">
          <TextInput
            id="email"
            error={touched.email && errors.email}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
          />
          <PasswordInput
            id="password"
            error={touched.password && errors.password}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
          />

          <Button fullWidth mt="xl" size="md" type="submit" loading={isSubmitting}>
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
}
