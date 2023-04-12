import * as yup from "yup";

const companyRules = /.{3,32}/;
const usernameRules = /^[A-Za-z0-9-. ]{2,32}$/;
const passwordRules = /^[A-Za-z0-9!@#$%^&*]{8,20}/;

export const enrollSchema = yup.object().shape({
  company: yup
    .string()
    .min(3, "Company name should be 3-32 characters")
    .max(32, "Company name should be 3-32 characters")
    .matches(companyRules, {
      message: "Company name should be 3-32 characters",
    })
    .required("This field is required"),
  username: yup
    .string()
    .min(2, "Username should be 2-32 characters and shouldn't include any special characters")
    .max(32, "Username should be 2-32 characters and shouldn't include any special characters")
    .matches(usernameRules, {
      message: "Username should be 2-32 characters and shouldn't include any special characters",
    })
    .required("This field is required"),
  email: yup.string().email("Email should be valid").required("This field is required"),
  password: yup
    .string()
    .min(8, "Password should be at 8-20 characters")
    .max(20, "Password should be at 8-20 characters")
    .matches(passwordRules, { message: "Password should be at 8-20 characters" })
    .required("This field is required"),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("This field is required"),
});

export const signInSchema = yup.object().shape({
  email: yup.string().email("Email should be valid").required("This field is required"),
  password: yup.string().required("This field is required"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Email should be valid").required("This field is required"),
});

export const createTaskSchema = yup.object().shape({
  title: yup
    .string()
    .min(10, "Title should be at 10-50 characters")
    .max(50, "Title should be at 10-50 characters")
    .required("This field is required"),
  description: yup
    .string()
    .min(10, "Description should be at 10-500 characters")
    .max(500, "Description should be at 10-500 characters")
    .required("This field is required"),
  deadline: yup.date().required("This field is required"),
  reward: yup.number().min(1).required("This field is required"),
});

export const createRewardSchema = yup.object().shape({
  title: yup
    .string()
    .min(10, "Title should be at 10-50 characters")
    .max(50, "Title should be at 10-50 characters")
    .required("This field is required"),
  description: yup
    .string()
    .min(10, "Description should be at 10-500 characters")
    .max(500, "Description should be at 10-500 characters"),
});
