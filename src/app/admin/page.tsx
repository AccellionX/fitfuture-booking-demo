"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const bookings = useAppStore((s) => s.bookings);
  const payments = useAppStore((s) => s.payments);
  const classes = useAppStore((s) => s.classes);
  const children = useAppStore((s) => s.children);
  const enrolments = useAppStore((s) => s.enrolments);
  const locations = useAppStore((s) => s.locations);
  const attendance = useAppStore((s) => s.attendance);

  const revenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const confirmed = bookings.filter((b) => b.status === "confirmed" || b.status === "completed");
  const fillRate =
    classes.length === 0
      ? 0
      : Math.round(
          (classes.reduce((s, c) => s + c.enrolled / c.capacity, 0) / classes.length) * 100
        );

  const revenueByDay = [...payments]
    .filter((p) => p.status === "paid")
    .reduce<Record<string, number>>((acc, p) => {
      const day = p.createdAt.slice(0, 10);
      acc[day] = (acc[day] || 0) + p.amount;
      return acc;
    }, {});
  const revenueSeries = Object.entries(revenueByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-10)
    .map(([date, amount]) => ({ date: date.slice(5), amount }));

  const byLocation = locations.map((l) => ({
    name: l.name.replace(" / ", "/"),
    bookings: bookings.filter((b) => {
      const cls = classes.find((c) => c.id === b.classId);
      return cls?.locationId === l.id && b.status !== "cancelled";
    }).length,
    capacity: classes
      .filter((c) => c.locationId === l.id)
      .reduce((s, c) => s + c.enrolled, 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Revenue & ops</p>
        <h1 className="font-display text-4xl text-white sm:text-5xl">Analytics</h1>
        <p className="mt-2 text-sm text-white/50">
          Demo metrics from seeded + live localStorage activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Gross revenue", value: formatCurrency(revenue) },
          { label: "Active bookings", value: String(confirmed.length) },
          { label: "Students", value: String(children.length) },
          { label: "Avg fill rate", value: `${fillRate}%` },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs uppercase tracking-[0.14em] text-white/40">{stat.label}</p>
            <p className="mt-2 font-display text-4xl text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="h-80">
          <CardHeader>
            <div>
              <CardTitle>Revenue trend</CardTitle>
              <CardDescription>Paid demo transactions</CardDescription>
            </div>
          </CardHeader>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B8FF3C" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#B8FF3C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#6b7380" fontSize={12} />
                <YAxis stroke="#6b7380" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#12151a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#B8FF3C"
                  fill="url(#rev)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="h-80">
          <CardHeader>
            <div>
              <CardTitle>Bookings by location</CardTitle>
              <CardDescription>Confirmed demand across Dubai sites</CardDescription>
            </div>
          </CardHeader>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byLocation}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7380" fontSize={11} />
                <YAxis stroke="#6b7380" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#12151a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="bookings" fill="#5AD1E8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardTitle>Programmes</CardTitle>
          <p className="mt-3 font-display text-4xl text-white">{enrolments.length}</p>
          <p className="text-sm text-white/45">
            {enrolments.filter((e) => e.status === "renewal-due").length} renewal-due
          </p>
        </Card>
        <Card>
          <CardTitle>Attendance marks</CardTitle>
          <p className="mt-3 font-display text-4xl text-white">{attendance.length}</p>
          <p className="text-sm text-white/45">
            {attendance.filter((a) => a.status === "present").length} present
          </p>
        </Card>
        <Card>
          <CardTitle>Class inventory</CardTitle>
          <p className="mt-3 font-display text-4xl text-white">{classes.length}</p>
          <p className="text-sm text-white/45">Upcoming + historical seeded sessions</p>
        </Card>
      </div>
    </div>
  );
}
