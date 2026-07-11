"use client";

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { revenueSeries } from "@/data/adminMock";

export function RevenueChart() {
  return (
    <div className="rounded-card border border-line bg-paper p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Revenue · last 7 days</h3>
        <span className="text-xs text-muted">EGP</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={revenueSeries} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#111111" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#111111" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b6b6b" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b6b6b" }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #eaeaea", fontSize: 12 }}
            cursor={{ stroke: "#eaeaea" }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#111111" strokeWidth={2} fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
