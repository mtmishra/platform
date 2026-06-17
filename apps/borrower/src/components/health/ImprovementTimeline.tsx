import React from "react";
import { Check } from "lucide-react";
import type { ImprovementAction, ImprovementPlan } from "@leapmoney/credit";

const DIFFICULTY_TONE: Record<ImprovementAction["difficulty"], string> = {
  easy: "text-status-success",
  medium: "text-status-warning",
  hard: "text-status-danger",
};

function ActionRow({ action }: { action: ImprovementAction }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-interactive-primary/10 text-interactive-primary">
        <Check size={12} />
      </span>
      <div className="flex flex-col">
        <span className="text-body-md font-medium text-foreground-primary">{action.action}</span>
        <span className="text-body-sm text-foreground-tertiary">
          <span className="font-mono text-status-success">+{action.estimated_point_gain} pts</span>
          {" · "}
          <span className={DIFFICULTY_TONE[action.difficulty]}>{action.difficulty}</span>
        </span>
      </div>
    </li>
  );
}

function Column({ title, actions }: { title: string; actions: ImprovementAction[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-interactive-primary px-2.5 py-0.5 text-label-caps font-semibold uppercase tracking-wider text-foreground-on-dark">
          {title}
        </span>
      </div>
      {actions.length === 0 ? (
        <p className="text-body-sm text-foreground-tertiary">No actions needed in this window — keep it up.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {actions.map((a) => (
            <ActionRow key={a.action} action={a} />
          ))}
        </ul>
      )}
    </div>
  );
}

/** 30 / 60 / 90-day improvement plan as three timeline columns. */
export function ImprovementTimeline({ plan }: { plan: ImprovementPlan }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Column title="Next 30 days" actions={plan.thirty_day} />
      <Column title="Next 60 days" actions={plan.sixty_day} />
      <Column title="Next 90 days" actions={plan.ninety_day} />
    </div>
  );
}
