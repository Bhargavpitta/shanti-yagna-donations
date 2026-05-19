import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  createAdminSessionCookie,
  validateAdminCredentials,
} from "@/lib/admin-auth";

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const parsed = loginSchema.safeParse(body);

          if (!parsed.success) {
            return Response.json({ error: "Invalid login input" }, { status: 400 });
          }

          const { username, password } = parsed.data;
          if (!validateAdminCredentials(username, password)) {
            return Response.json({ error: "Invalid username or password" }, { status: 401 });
          }

          return Response.json(
            { ok: true, username },
            {
              headers: {
                "Set-Cookie": createAdminSessionCookie(username),
              },
            },
          );
        } catch (error) {
          console.error(error);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
      },
    },
  },
});
