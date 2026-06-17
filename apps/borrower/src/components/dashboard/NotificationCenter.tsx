import React from "react";
import { Bell, AlertCircle, Sparkles, TrendingUp } from "lucide-react";

type AlertTone = "warning" | "info" | "success";

interface Alert {
  id: string;
  icon: React.ReactNode;
  tone: AlertTone;
  title: string;
  body: string;
  when: string;
}

const TONE: Record<AlertTone, string> = {
  warning: "text-status-warning",
  info: "text-interactive-primary",
  success: "text-status-success",
};

// Mock alerts for Sprint 11 — replace with real events once the monitoring agent ships.
const ALERTS: Alert[] = [
  {
    id: "utilization",
    icon: <AlertCircle size={16} />,
    tone: "warning",
    title: "Utilization alert",
    body: "Your credit-card utilization rose to 18%. Keeping it under 10% could add ~15 points.",
    when: "2h ago",
  },
  {
    id: "match",
    icon: <Sparkles size={16} />,
    tone: "info",
    title: "New match available",
    body: "HDFC Bank now shows 87% approval odds for your ₹10L personal loan.",
    when: "1d ago",
  },
  {
    id: "score",
    icon: <TrendingUp size={16} />,
    tone: "success",
    title: "Score improvement",
    body: "Your LeapScore rose 6 points this month. On-time payments are working.",
    when: "3d ago",
  },
];

export function NotificationCenter() {
  return (
    <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <div className="mb-4 flex items-center gap-2">
        <Bell size={16} className="text-foreground-secondary" />
        <h3 className="text-h3 font-semibold text-foreground-primary">Alerts</h3>
        <span className="ml-auto rounded-full bg-interactive-primary px-2 py-0.5 text-label-caps font-semibold text-foreground-on-dark">
          {ALERTS.length}
        </span>
      </div>
      <ul className="flex flex-col divide-y divide-border-token-default">
        {ALERTS.map((a) => (
          <li key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <span className={`mt-0.5 flex-shrink-0 ${TONE[a.tone]}`}>{a.icon}</span>
            <div className="flex flex-col">
              <span className="flex items-center gap-2 text-body-md font-medium text-foreground-primary">
                {a.title}
                <span className="text-body-sm font-normal text-foreground-tertiary">· {a.when}</span>
              </span>
              <span className="text-body-sm text-foreground-secondary">{a.body}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
