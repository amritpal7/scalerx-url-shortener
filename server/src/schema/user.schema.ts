import { object, string } from "zod";

const userScehma = object({
  username: string({ required_error: "Username is required!" }).min(
    6,
    "Username must be 6 characters."
  ),
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
