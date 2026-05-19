import { createFileRoute } from "@tanstack/react-router";
import { listDonations } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/api/admin/donations")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = requireAdminSession(request);
        if (session instanceof Response) return session;

        try {
          const donations = await listDonations();
          return Response.json({
            ok: true,
            username: session.username,
            donations,
          });
        } catch (error) {
          console.error(error);
          return Response.json({ error: "Failed to load donors" }, { status: 500 });
        }
      },
    },
  },
});
