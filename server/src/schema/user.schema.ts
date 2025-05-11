import { object, string } from "zod";

const userScehma = object({
  email: string({
    required_error: "Email is required!",
  }).email("Not a valid email address."),
  username: string().optional(),
  password: string({
    required_error: "Password is required!",
  }).min(8, "password must be 8 characters"),
  confirmPassword: string({
    required_error: "Password confirmation required.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords not matched!",
  path: ["passwordConfirmation"],
});

export default userScehma;
