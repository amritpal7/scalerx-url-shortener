import { createFileRoute } from "@tanstack/react-router";
import GenerateUrls from "../pages/GenerateUrls";

export const Route = createFileRoute("/GenerateUrls")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GenerateUrls />;
}
