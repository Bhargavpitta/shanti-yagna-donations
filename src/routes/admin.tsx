import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Download,
  Flame,
  IndianRupee,
  LogOut,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Donation = {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  amount: number | string;
  gotra_message: string | null;
  payment_id: string | null;
  order_id: string | null;
  payment_status: string;
  created_at: string;
};

type SessionState =
  | { status: "loading" }
  | { status: "logged_out" }
  | { status: "logged_in"; username: string };

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Admin Dashboard | Sri Krishna Kalachakram Brahma Yagna" }],
  }),
});

function AdminPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionState>({ status: "loading" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    checkSession();
  }, []);

  const totalAmount = useMemo(
    () => donations.reduce((sum, item) => sum + Number(item.amount), 0),
    [donations],
  );
  const successCount = useMemo(
    () => donations.filter((item) => item.payment_status === "success").length,
    [donations],
  );

  async function checkSession() {
    try {
      const res = await fetch("/api/admin/session");
      if (!res.ok) {
        setSession({ status: "logged_out" });
        return;
      }

      const data = await res.json();
      setSession({ status: "logged_in", username: data.username });
      await loadDonations();
    } catch (error) {
      console.error(error);
      setSession({ status: "logged_out" });
    }
  }

  async function loadDonations() {
    setLoadingData(true);
    try {
      const res = await fetch("/api/admin/donations");
      if (res.status === 401) {
        setSession({ status: "logged_out" });
        setDonations([]);
        return;
      }
      if (!res.ok) throw new Error("Failed to load donations");

      const data = await res.json();
      setDonations(data.donations ?? []);
      setSession({ status: "logged_in", username: data.username });
    } catch (error) {
      console.error(error);
      toast.error("Could not load donation records.");
    } finally {
      setLoadingData(false);
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      setPassword("");
      setSession({ status: "logged_in", username: data.username });
      await loadDonations();
      toast.success("Welcome to the admin dashboard.");
    } catch (error) {
      console.error(error);
      toast.error("Could not sign in right now.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setDonations([]);
    setSession({ status: "logged_out" });
    toast.success("Logged out.");
    navigate({ to: "/" });
  }

  if (session.status === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AdminBackdrop />
        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <Card className="w-full max-w-md border-[var(--gold)]/40 bg-card/90 shadow-divine">
            <CardHeader>
              <CardTitle className="font-display text-2xl text-deep-red">
                Loading Dashboard
              </CardTitle>
              <CardDescription>
                Checking admin session and preparing donor records.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (session.status === "logged_out") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AdminBackdrop />
        <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
          <Card className="w-full max-w-xl overflow-hidden border-[var(--gold)]/40 shadow-divine">
            <div className="gradient-saffron px-8 py-7 text-white">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em]">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin Access
              </p>
              <h1 className="mt-4 font-display text-3xl font-bold">
                Donor Dashboard
              </h1>
              <p className="mt-2 max-w-lg text-sm text-white/85">
                Sign in to view donation records, verify donor details, and download the Excel report.
              </p>
            </div>

            <CardContent className="bg-card p-8">
              <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <Input
                    id="admin-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full bg-saffron text-white hover:opacity-90"
                  size="lg"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {loggingIn ? "Signing In..." : "Login to Dashboard"}
                </Button>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  
                  <Link to="/" className="text-deep-red hover:text-saffron">
                    Back to donation page
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminBackdrop />

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--gold)]/35 bg-card/85 p-6 shadow-divine backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-deep-red/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-deep-red">
              <Sparkles className="h-3.5 w-3.5" /> Sacred Giving Ledger
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold text-deep-red">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Signed in as <span className="font-semibold text-deep-red">{session.username}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-saffron text-white hover:opacity-90"
            >
              <a href="/api/donors/export" target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" />
                Download Excel
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-[var(--deep-red)] text-deep-red hover:bg-deep-red hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <StatsCard
            title="Total Donors"
            value={donations.length.toLocaleString("en-IN")}
            note="All submitted donation records"
            icon={<Users className="h-5 w-5 text-saffron" />}
          />
          <StatsCard
            title="Successful Payments"
            value={successCount.toLocaleString("en-IN")}
            note="Rows verified by Razorpay signature"
            icon={<ShieldCheck className="h-5 w-5 text-saffron" />}
          />
          <StatsCard
            title="Total Amount"
            value={`₹${totalAmount.toLocaleString("en-IN")}`}
            note="Sum of all donation rows"
            icon={<IndianRupee className="h-5 w-5 text-saffron" />}
          />
        </div>

        <Card className="mt-8 border-[var(--gold)]/40 bg-card/90 shadow-divine">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle className="font-display text-2xl text-deep-red">
                Donor Records
              </CardTitle>
              <CardDescription>
                View donor details, payment IDs, sankalpa notes, and export the full ledger.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="border-[var(--gold)]/60 text-deep-red hover:bg-cream"
              onClick={loadDonations}
              disabled={loadingData}
            >
              {loadingData ? "Refreshing..." : "Refresh Data"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-[var(--gold)]/35 bg-white/80">
              <Table>
                <TableHeader className="bg-cream/80">
                  <TableRow>
                    <TableHead className="px-4 py-3">Donor</TableHead>
                    <TableHead className="px-4 py-3">Contact</TableHead>
                    <TableHead className="px-4 py-3">Amount</TableHead>
                    <TableHead className="px-4 py-3">Gotra / Message</TableHead>
                    <TableHead className="px-4 py-3">Payment</TableHead>
                    <TableHead className="px-4 py-3">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                        {loadingData
                          ? "Loading donor records..."
                          : "No donations found yet."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="px-4 py-4">
                          <div className="font-semibold text-deep-red">{donation.full_name}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Order: {donation.order_id || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div>{donation.email}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{donation.mobile}</div>
                        </TableCell>
                        <TableCell className="px-4 py-4 font-semibold text-saffron">
                          ₹{Number(donation.amount).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm">
                          {donation.gotra_message || "—"}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="font-medium capitalize">{donation.payment_status}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Payment ID: {donation.payment_id || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                          {new Date(donation.created_at).toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(circle at top left, color-mix(in oklab, var(--gold) 32%, transparent) 0%, transparent 36%), linear-gradient(180deg, color-mix(in oklab, var(--cream) 94%, white) 0%, var(--cream) 48%, color-mix(in oklab, var(--gold) 18%, var(--cream)) 100%)",
        }}
      />
      <div className="absolute right-8 top-8 -z-10 rounded-full gradient-saffron p-4 text-white shadow-divine">
        <Flame className="h-7 w-7" />
      </div>
    </>
  );
}

function StatsCard({
  title,
  value,
  note,
  icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: ReactNode;
}) {
  return (
    <Card className="border-[var(--gold)]/40 bg-card/90 shadow-divine">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardDescription>{title}</CardDescription>
            <CardTitle className="mt-2 font-display text-3xl text-deep-red">
              {value}
            </CardTitle>
          </div>
          <div className="rounded-2xl bg-cream p-3">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}
