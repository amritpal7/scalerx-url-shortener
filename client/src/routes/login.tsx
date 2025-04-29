import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../pages/Login";
export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LoginForm />;
}
