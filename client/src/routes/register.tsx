import { createFileRoute } from "@tanstack/react-router";
import RegisterForm from "../pages/Register";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RegisterForm />;
}
