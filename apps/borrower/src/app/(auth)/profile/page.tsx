"use client";

import React from "react";
import { Card, Heading, Label, Paragraph } from "@leapmoney/ui";
import { Pencil, Check, X } from "lucide-react";

function Field({
  label,
  value,
  editable,
  onSave,
}: {
  label: string;
  value: string | null | undefined;
  editable?: boolean;
  onSave?: (v: string) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value ?? "");

  const save = () => {
    onSave?.(draft);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-1 border-b border-border-token-default py-3 last:border-b-0">
      <Label caps>{label}</Label>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
            className="flex-1 rounded-md border border-border-token-default bg-background-card px-3 py-1.5 text-body-md text-foreground-primary outline-none focus:border-interactive-primary"
          />
          <button onClick={save} className="rounded-md bg-interactive-primary p-1.5 text-foreground-on-dark hover:bg-interactive-hover">
            <Check size={14} />
          </button>
          <button onClick={() => setEditing(false)} className="rounded-md border border-border-token-default p-1.5 text-foreground-secondary hover:bg-background-page">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <span className="text-body-lg text-foreground-primary">
            {value && value.length > 0
              ? value
              : <span className="text-foreground-tertiary">Not set</span>}
          </span>
          {editable && (
            <button
              onClick={() => { setDraft(value ?? ""); setEditing(true); }}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-body-sm text-foreground-tertiary hover:bg-background-page hover:text-interactive-primary"
            >
              <Pencil size={13} /> Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const [name, setName] = React.useState("Demo User");
  const [phone, setPhone] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  const handleSave = (field: string) => (value: string) => {
    if (field === "name") setName(value);
    if (field === "phone") setPhone(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto flex max-w-card-md flex-col gap-6">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Your profile</Heading>
        <Paragraph color="secondary">
          Manage your account details. Changes are saved instantly.
        </Paragraph>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-body-sm text-green-700">
          <Check size={15} /> Saved successfully
        </div>
      )}

      <Card className="flex flex-col">
        <Field label="Email" value="demo@leapmoney.net" />
        <Field label="Full name" value={name} editable onSave={handleSave("name")} />
        <Field label="Phone (WhatsApp)" value={phone || undefined} editable onSave={handleSave("phone")} />
        <Field label="Role" value="borrower" />
        <Field label="Profile completed" value="Yes" />
        <Field label="Onboarding step" value="complete" />
      </Card>

      <p className="text-body-sm text-foreground-tertiary">
        To update your email, contact support at support@leapmoney.net
      </p>
    </div>
  );
}
