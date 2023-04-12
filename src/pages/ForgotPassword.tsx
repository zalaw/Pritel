import { FormikHelpers, useFormik } from "formik";
import { forgotPasswordSchema } from "../schemas";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Paper, createStyles, TextInput, Button, Title, Text, rem } from "@mantine/core";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";

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
    borderRight: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3]}`,
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

interface FormValues {
  email: string;
}

const initialValues: FormValues = {
  email: "",
};

export default function ForgotPassword() {
  const { classes } = useStyles();
  const { forgotPassword } = useAuth();

  const onSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      // const userCredential = await signin(values.email, values.password);

      // if (!userCredential.user.emailVerified) {
      //   await logout();
      //   toast.error("This email is not verified! Check your inbox (or spam) for further information");
      // } else {
      //   toast.success("Successfully signed in!");
      //   navigate("/");
      // }

      await forgotPassword(values.email);

      toast.success(
        "Email sent successfully! If there's a match, you should receive further instructions in the inbox (or spam)"
      );

      resetForm();
    } catch (err: FirebaseError | any) {
      if (["auth/user-not-found"].includes(err.code)) {
        toast.success(
          "Email sent successfully! If there's a match, you should receive further instructions in the inbox (or spam)"
        );

        resetForm();
      } else toast.error("Unknown error. Try again later");
    } finally {
      // resetForm();
    }
  };

  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit,
  });

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={40}>
        <Title order={2} className={classes.title} ta="center" mt="md">
          Forgot password?
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

          <Button disabled={values.email.length === 0} fullWidth mt="xl" size="md" type="submit" loading={isSubmitting}>
            Sent reset link
          </Button>
        </form>

        <Text ta="center" mt="sm">
          Back to{" "}
          <Link to="/signin" color="##228be6">
            <Text span color="#228be6">
              <b>Sign in</b>
            </Text>
          </Link>
        </Text>
      </Paper>
    </div>
  );
}
