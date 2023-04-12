import { useState } from "react";
import { FormikHelpers, useFormik } from "formik";
import { enrollSchema } from "../schemas";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  createStyles,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Checkbox,
  rem,
  Anchor,
  Modal,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import ToS from "../components/ToS";
import { useDisclosure } from "@mantine/hooks";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db, secondaryAuth, secondaryDB } from "../firebase";

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
  company: string;
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const initialValues: FormValues = {
  company: "",
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
};

export default function Enroll() {
  const { classes } = useStyles();
  const { enroll, updateDisplayName, sendVerificationEmail, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const [checked, setChecked] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const handleClickToS = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    open();
  };

  const onSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    try {
      const { user } = await enroll(values.email, values.password, secondaryAuth);

      console.log(user);

      await updateDisplayName(values.username, secondaryAuth);

      console.log("done here");

      const company = await addDoc(collection(secondaryDB, "companies"), {
        admin: doc(db, `users/${user.uid}`),
        adminId: user.uid,
        claimPoints: null,
        claimPointsInterval: null,
        name: values.company,
        totalEmployees: 1,
        rewards: [],
      });

      await setDoc(doc(secondaryDB, "users", user.uid), {
        admin: true,
        company: doc(db, `companies/${company.id}`),
        companyId: company.id,
        displayName: values.username,
        lastClaim: null,
        photoName: null,
        photoURL: null,
        points: 0,
        email: user.email,
        pointsCollected: 0,
        pointsSpent: 0,
      });

      // await sendVerificationEmail(secondaryAuth);
      await logout(secondaryAuth);

      toast.success("Account created successfully! Verify your email before signin in");
    } catch (err: FirebaseError | any) {
      console.log(err);
      if (err.code === "auth/email-already-in-use") toast.error("Email already in use");
      else toast.error("Unknown error. Try again later");
    } finally {
      setChecked(false);
      resetForm();
    }
  };

  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema: enrollSchema,
    onSubmit,
  });

  return (
    <div className={classes.wrapper}>
      <Modal
        overlayProps={{
          color: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
        centered
        opened={opened}
        onClose={close}
        title="Term of Service"
      >
        <ToS />
      </Modal>

      <Paper className={classes.form} radius={0} p={40}>
        <Title order={2} className={classes.title} ta="center" mt="md">
          Enroll
        </Title>

        <Text size="sm">This page is dedicated to employers</Text>

        <form onSubmit={handleSubmit} autoComplete="off">
          <TextInput
            id="company"
            error={touched.company && errors.company}
            value={values.company}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Company"
            placeholder="Babajee PTE. LTD."
            size="md"
          />
          <TextInput
            id="username"
            error={touched.username && errors.username}
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Username"
            placeholder="John Doe"
            mt="md"
            size="md"
          />
          <TextInput
            id="email"
            error={touched.email && errors.email}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Email address"
            placeholder="hello@gmail.com"
            mt="md"
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
          <PasswordInput
            id="repeatPassword"
            error={touched.repeatPassword && errors.repeatPassword}
            value={values.repeatPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            label="Repeat Password"
            placeholder="Repeat your password"
            mt="md"
            size="md"
          />

          <Checkbox
            checked={checked}
            onChange={e => setChecked(e.currentTarget.checked)}
            label={
              <>
                I accept <Anchor onClick={handleClickToS}>Terms of Service</Anchor>
              </>
            }
            mt="xl"
            size="md"
          />

          <Button
            disabled={
              values.company.length === 0 ||
              values.username.length === 0 ||
              values.email.length === 0 ||
              values.password.length === 0 ||
              values.repeatPassword.length === 0 ||
              !checked
            }
            fullWidth
            mt="xl"
            size="md"
            type="submit"
            loading={isSubmitting}
          >
            Enroll
          </Button>
        </form>

        <Text ta="center" mt="sm">
          Already enrolled?{" "}
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
