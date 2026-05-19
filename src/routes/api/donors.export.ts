import { createFileRoute } from "@tanstack/react-router";
import ExcelJS from "exceljs";
import { getAdminSession } from "@/lib/admin-auth";
import { listDonations } from "@/lib/db";

export const Route = createFileRoute("/api/donors/export")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const key = url.searchParams.get("admin_key");
        const expected = process.env.ADMIN_EXPORT_KEY || "changeme";
        const session = getAdminSession(request);
        const hasSession = !!session;
        const hasLegacyKey = !!key && key === expected;

        if (!hasSession && !hasLegacyKey) {
          return new Response("Unauthorized", { status: 401 });
        }

        let data;
        try {
          data = await listDonations();
        } catch (error) {
          console.error(error);
          return new Response("Failed to load donors", { status: 500 });
        }

        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Donors");
        ws.columns = [
          { header: "S.No", key: "sno", width: 8 },
          { header: "Full Name", key: "full_name", width: 28 },
          { header: "Email", key: "email", width: 30 },
          { header: "Mobile", key: "mobile", width: 16 },
          { header: "Amount (₹)", key: "amount", width: 14 },
          { header: "Gotra/Message", key: "gotra_message", width: 30 },
          { header: "Payment ID", key: "payment_id", width: 28 },
          { header: "Payment Status", key: "payment_status", width: 18 },
          { header: "Date & Time", key: "created_at", width: 22 },
        ];
        ws.getRow(1).font = { bold: true };

        (data || []).forEach((d, i) => {
          ws.addRow({
            sno: i + 1,
            full_name: d.full_name,
            email: d.email,
            mobile: d.mobile,
            amount: Number(d.amount),
            gotra_message: d.gotra_message ?? "",
            payment_id: d.payment_id ?? "",
            payment_status: d.payment_status,
            created_at: new Date(d.created_at).toLocaleString("en-IN"),
          });
        });

        const buf = await wb.xlsx.writeBuffer();
        return new Response(buf as ArrayBuffer, {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="donors-${Date.now()}.xlsx"`,
          },
        });
      },
    },
  },
});
