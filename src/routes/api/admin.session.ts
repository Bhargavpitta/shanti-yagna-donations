import { createFileRoute } from "@tanstack/react-router";
import { getAdminSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/api/admin/session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = getAdminSession(request);
        if (!session) {
          return Response.json({ authenticated: false }, { status: 401 });
        }

        return Response.json({
          authenticated: true,
          username: session.username,
        });
      },
    },
  },
});
