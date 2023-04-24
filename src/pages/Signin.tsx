import { useEffect } from "react";
import { FormikHelpers, useFormik } from "formik";
import { signInSchema } from "../schemas";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { Paper, createStyles, TextInput, PasswordInput, Button, Title, Text, rem } from "@mantine/core";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";

const useStyles = createStyles(theme => ({
  wrapper: {
    height: "100%",
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
    borderRight: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3]}`,
    height: "100%",
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

interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: "",
  password: "",
};

export default function Signin() {
  const { classes } = useStyles();
  const { userLoading, currentUser, signin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  console.log("userLoading in Signin", userLoading);
  console.log("currentUser in Signin", currentUser);

  useEffect(() => {
    console.log("useEffect");
    if (currentUser) navigate("/");
  }, [currentUser, navigate]);

  const onSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      const userCredential = await signin(values.email, values.password);

      // if (!userCredential.user.emailVerified) {
      // await logout();
      // toast.error("This email is not verified! Check your inbox (or spam) for further information");
      // } else {
      toast.success("Successfully signed in!");
      navigate(from, { replace: true });
      // }

      resetForm();
    } catch (err: FirebaseError | any) {
      if (["auth/wrong-password", "auth/user-not-found"].includes(err?.code)) toast.error("Invalid credentials");
      else if (err.code === "auth/user-disabled") toast.error("This account is disabled 😳");
      else toast.error("Unknown error. Try again later");
      values.password = "";
    } finally {
      // resetForm();
    }
  };

  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: signInSchema,
    onSubmit,
  });

  if (userLoading) return null;

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={40}>
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

        <Text ta="center" mt="sm">
          Forgot password?{" "}
          <Link to="/forgotpassword" color="##228be6">
            <Text span color="#228be6">
              <b>Reset</b>
            </Text>
          </Link>
        </Text>
      </Paper>
    </div>
  );
}
