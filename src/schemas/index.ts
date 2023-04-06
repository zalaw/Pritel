import * as yup from "yup";

export const signInSchema = yup.object().shape({
  email: yup.string().email("Email should be valid").required("This field is required"),
  password: yup.string().required("This field is required"),
});
