import { useFormik } from "formik";
import { signInSchema } from "../schemas";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Paper, createStyles, TextInput, PasswordInput, Button, Title, rem } from "@mantine/core";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

const useStyles = createStyles(theme => ({
  wrapper: {
    minHeight: "100%",
    // backgroundSize: "30%",
    // backgroundRepeat: "no-repeat",
    // backgroundPosition: "70% 50%",
    // backgroundImage:
    //   "url(https://cdni.iconscout.com/illustration/premium/thumb/app-gamification-encouraging-customers-to-earn-rewards-audience-engaging-content-8114377-6529269.png?f=webp)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
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

export default function Signin() {
  const { classes } = useStyles();
  const { signin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values: IValues) => {
    try {
      await signin(values.email, values.password);
      navigate("/");
    } catch (err: FirebaseError | any) {
      if (["auth/wrong-password", "auth/user-not-found"].includes(err?.code)) toast.error("Invalid credentials");
    }
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
        <Title color="#228be6" order={2}>
          <Link to="/">Pritel</Link>
        </Title>

        <Title order={2} className={classes.title} ta="center" mt="md">
          Sign in
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

          <Button
            disabled={values.email.length === 0 || values.password.length === 0}
            fullWidth
            mt="xl"
            size="md"
            type="submit"
            loading={isSubmitting}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </div>
  );
}
