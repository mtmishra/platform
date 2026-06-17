"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Heading, Input, Paragraph } from "@leapmoney/ui";
import {
  createSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@leapmoney/supabase";
import { validateEmail } from "@/lib/validation";

type Stage = "email" | "otp";

export function LoginForm() {
  const router = useRouter();
  const configured = isSupabaseConfigured();

  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    if (!configured) {
      setError("Authentication isn't configured in this environment yet.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (otpError) throw otpError;
      setStage("otp");
    } catch {
      setError("Couldn't send the code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (code.trim().length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code.trim(),
        type: "email",
      });
      if (verifyError) throw verifyError;
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("That code didn't work. Check it and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-card-sm rounded-xl border border-border-token-default bg-background-card p-8 shadow-2">
      <Heading level={1} size="h1" className="mb-2">
        {stage === "email" ? "Sign in to LeapMoney" : "Enter your code"}
      </Heading>
      <Paragraph color="secondary" className="mb-6">
        {stage === "email"
          ? "We'll email you a 6-digit code to sign in or create your account."
          : `We sent a 6-digit code to ${email}.`}
      </Paragraph>

      {!configured && (
        <div className="mb-6 rounded-md border border-status-warning/30 bg-background-page p-3 text-body-sm text-status-warning">
          Demo mode: Supabase isn&apos;t configured, so sign-in is disabled. Set
          NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable it.
        </div>
      )}

      {stage === "email" ? (
        <form onSubmit={requestOtp} noValidate className="flex flex-col gap-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <Button type="submit" variant="primary" size="lg" loading={loading}>
            Send code
          </Button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} noValidate className="flex flex-col gap-4">
          <Input
            label="6-digit code"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            error={error}
            placeholder="123456"
            maxLength={6}
          />
          <Button type="submit" variant="primary" size="lg" loading={loading}>
            Verify &amp; continue
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => {
              setStage("email");
              setCode("");
              setError(undefined);
            }}
          >
            Use a different email
          </Button>
        </form>
      )}
    </div>
  );
}
