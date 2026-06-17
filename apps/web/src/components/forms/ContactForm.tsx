"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button, Input, Textarea, Heading, Paragraph } from "@leapmoney/ui";
import { trackFormSubmit, track } from "@leapmoney/analytics";
import {
  isFormValid,
  validateEmail,
  validateMessage,
  validateName,
} from "@/lib/validation";

const FORM_ID = "contact_form";
type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);

  function onFirstInteraction() {
    if (!started) {
      setStarted(true);
      track({ name: "form_start", properties: { form_id: FORM_ID } });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
    };
    setErrors(nextErrors);
    if (!isFormValid(nextErrors)) {
      trackFormSubmit(FORM_ID, false);
      return;
    }

    setStatus("submitting");
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      trackFormSubmit(FORM_ID, true);
      setStatus("success");
    } catch {
      setStatus("error");
      trackFormSubmit(FORM_ID, false);
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-status-success/30 bg-background-card p-6">
        <CheckCircle2 size={28} className="text-status-success" />
        <Heading level={3} size="h2">Message sent</Heading>
        <Paragraph color="secondary">
          Thanks for reaching out, {name.split(" ")[0]}. Our team will get back to
          you at {email} within 1–2 business days.
        </Paragraph>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={onFirstInteraction}
      noValidate
      className="flex flex-col gap-4 rounded-lg border border-border-token-default bg-background-card p-6"
      aria-label="Contact us"
    >
      <Input
        label="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoComplete="name"
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <Textarea
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        error={errors.message}
        rows={5}
      />

      {status === "error" && (
        <p className="text-body-sm text-status-danger" role="alert">
          Something went wrong. Please try again.
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" loading={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
