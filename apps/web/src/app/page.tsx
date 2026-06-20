"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Star,
  Bot,
  TrendingUp,
  Lock,
  BadgeCheck,
  ChevronRight,
  Sparkles,
  Target,
  BarChart3,
} from "lucide-react";
import {
  Button,
  Container,
  RevealOnScroll,
  StaggerContainer,
  CountUp,
  ScoreGauge,
  RbiAlignmentBadge,
  DpdpComplianceBadge,
  ScoreBandBadge,
} from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/seo";
import { StickyMobileCta } from "@/components/feature/StickyMobileCta";

// ── Chat messages for LeapAI demo ─────────────────────────────────────────────
const CHAT_MESSAGES = [
  { from: "user", text: "Which lender is best for me? I need ₹5L personal loan." },
  { from: "ai", text: "Based on your LeapScore of 742 and FOIR of 34%, HDFC Bank ranks #1 — 87% approval probability at 10.8% p.a." },
  { from: "user", text: "Why not ICICI?" },
  { from: "ai", text: "ICICI requires minimum 750 CIBIL. Your score is 742. I'm showing lenders where you have the highest chance of approval right now." },
] as const;

// ── Lender names for marquee ──────────────────────────────────────────────────
const LENDER_NAMES = [
  "HDFC Bank", "ICICI Bank", "SBI", "Kotak Mahindra", "Axis Bank",
  "Bajaj Finance", "Tata Capital", "L&T Finance", "HDB Financial", "Fullerton India",
  "Poonawalla Fincorp", "IndusInd Bank", "Yes Bank", "Federal Bank", "IDFC First",
  "Aditya Birla Finance", "Muthoot Finance", "Manappuram Finance", "Cholamandalam", "Hero FinCorp",
];

// ── Sample lender match cards ─────────────────────────────────────────────────
const MATCH_CARDS = [
  {
    rank: 1,
    lender: "HDFC Bank",
    abbr: "HDFC",
    color: "#004C97",
    approval: 87,
    rate: "10.8%",
    emi: "₹10,868",
    disbursal: "2 days",
    badge: "Best Match",
    why: "CIBIL 742 ≥ HDFC minimum 720. Employer TCS is Tier 1 listed. FOIR 34% well within 50% limit.",
  },
  {
    rank: 2,
    lender: "Kotak Mahindra Bank",
    abbr: "KMB",
    color: "#ED1C24",
    approval: 74,
    rate: "11.5%",
    emi: "₹11,122",
    disbursal: "3 days",
    badge: null,
    why: "Strong approval odds. Slightly higher rate but lower processing fee of 0.5%.",
  },
  {
    rank: 3,
    lender: "Bajaj Finance",
    abbr: "BFL",
    color: "#0033A0",
    approval: 68,
    rate: "13.0%",
    emi: "₹11,639",
    disbursal: "1 day",
    badge: "Fastest",
    why: "Fastest disbursal. Higher rate offset by instant processing for urgent needs.",
  },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    city: "Delhi",
    loanType: "Personal Loan",
    lender: "HDFC Bank",
    amount: "₹8L",
    saved: "₹1.4L",
    quote: "LeapMatch showed me exactly which lender would approve me and why. Got approved in 2 days with no rejection anxiety.",
    score: 748,
    stars: 5,
  },
  {
    name: "Priya Mehta",
    city: "Mumbai",
    loanType: "Home Loan",
    lender: "SBI",
    amount: "₹45L",
    saved: "₹3.8L",
    quote: "I had no idea what my credit score meant. LeapAI explained everything in plain language and got me the right lender.",
    score: 712,
    stars: 5,
  },
  {
    name: "Suresh Patil",
    city: "Pune",
    loanType: "Business Loan",
    lender: "Bajaj Finance",
    amount: "₹12L",
    saved: "₹2.1L",
    quote: "As self-employed, banks kept rejecting me. LeapMoney matched me to lenders who actually serve my profile.",
    score: 691,
    stars: 4,
  },
];

// ── Components ────────────────────────────────────────────────────────────────

function LeapAIDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (visibleCount >= CHAT_MESSAGES.length) {
      const t = setTimeout(() => setVisibleCount(0), 4000);
      return () => clearTimeout(t);
    }
    const delay = visibleCount === 0 ? 800 : CHAT_MESSAGES[visibleCount - 1]?.from === "user" ? 600 : 1200;
    const t = setTimeout(() => {
      if (CHAT_MESSAGES[visibleCount]?.from === "ai") setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setVisibleCount((v) => v + 1);
      }, 700);
    }, delay);
    return () => clearTimeout(t);
  }, [visibleCount]);

  return (
    <div className="rounded-xl border border-border-token-default bg-background-card shadow-3 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border-token-default bg-background-page px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-primary">
          <Bot size={14} className="text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="text-body-sm font-semibold text-foreground-primary">LeapAI Copilot</p>
          <p className="text-label-caps text-status-success">● Online</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4 min-h-[220px]">
        {CHAT_MESSAGES.slice(0, visibleCount).map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-body-sm ${msg.from === "user" ? "bg-blue-primary text-white rounded-br-sm" : "bg-background-page text-foreground-primary rounded-bl-sm"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-lg rounded-bl-sm bg-background-page px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground-tertiary animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-foreground-tertiary animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-foreground-tertiary animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-border-token-default bg-background-page px-4 py-3">
        <div className="flex items-center gap-2 rounded-md border border-border-token-default bg-background-card px-3 py-2">
          <span className="flex-1 text-body-sm text-foreground-tertiary">Ask LeapAI anything...</span>
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-primary" aria-hidden="true">
            <ArrowRight size={12} className="text-white" />
          </span>
        </div>
      </div>
    </div>
  );
}

function LenderMarquee() {
  const doubled = [...LENDER_NAMES, ...LENDER_NAMES];
  return (
    <div className="relative overflow-hidden" aria-hidden="true">
      <div
        className="flex gap-3"
        style={{ animation: "marquee 32s linear infinite", width: "max-content" }}
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            className="inline-flex h-8 items-center whitespace-nowrap rounded-md border border-border-token-default bg-background-card px-3 text-body-sm font-medium text-foreground-secondary shadow-1"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function MatchCard({ card, index }: { card: (typeof MATCH_CARDS)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <RevealOnScroll delayMs={index * 100}>
      <div className="rounded-xl border border-border-token-default bg-background-card p-4 shadow-1 flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-md text-body-sm font-bold text-white"
              style={{ background: card.color }}
              aria-hidden="true"
            >
              {card.abbr}
            </div>
            <div>
              <p className="text-body-md font-semibold text-foreground-primary">{card.lender}</p>
              <p className="text-body-sm text-foreground-tertiary">#{card.rank} match</p>
            </div>
          </div>
          {card.badge && (
            <span className="rounded-full bg-status-success/10 px-2 py-0.5 text-label-caps font-semibold text-status-success border border-status-success/20">
              {card.badge}
            </span>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-body-sm text-foreground-secondary">Approval probability</span>
            <span className="font-mono text-body-md font-bold text-foreground-primary">{card.approval}%</span>
          </div>
          <div className="h-2 rounded-full bg-background-page overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${card.approval}%`,
                background: card.approval >= 80 ? "#16A34A" : card.approval >= 65 ? "#D97706" : "#DC2626",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-lg bg-background-page p-3">
          <div>
            <p className="text-label-caps text-foreground-tertiary">Rate p.a.</p>
            <p className="font-mono text-body-md font-bold text-foreground-primary">{card.rate}</p>
          </div>
          <div>
            <p className="text-label-caps text-foreground-tertiary">EMI/mo</p>
            <p className="font-mono text-body-md font-bold text-foreground-primary">{card.emi}</p>
          </div>
          <div>
            <p className="text-label-caps text-foreground-tertiary">Disbursal</p>
            <p className="text-body-md font-semibold text-foreground-primary">{card.disbursal}</p>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-between text-body-sm text-blue-primary hover:underline"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span>Why this lender?</span>
          <ChevronRight
            size={14}
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 100ms" }}
          />
        </button>
        {open && (
          <p className="text-body-sm text-foreground-secondary border-t border-border-token-default pt-2">
            {card.why}
          </p>
        )}

        <div className="mt-auto">
          <Button variant="primary" size="sm" className="w-full">
            <Link href="/register" className="flex items-center justify-center gap-1 w-full">
              Apply at {card.lender} <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </RevealOnScroll>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <Header />

      <main>
        {/* S2 — HERO */}
        <section className="bg-background-card py-16 md:py-24" aria-labelledby="hero-heading">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div className="flex flex-col gap-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-primary/20 bg-blue-primary/5 px-3 py-1.5 text-body-sm font-semibold text-blue-primary">
                  <Sparkles size={13} aria-hidden="true" />
                  India&apos;s AI Loan Matching Platform
                </div>

                <h1 id="hero-heading" className="text-display-large font-bold text-foreground-primary leading-tight">
                  Find your best loan offer.{" "}
                  <span className="text-blue-primary">Not just a comparison.</span>
                </h1>

                <p className="text-body-lg text-foreground-secondary max-w-[520px]">
                  LeapMatch AI analyses 47 lenders in real time and shows you which ones will approve
                  your application — with the exact rate, EMI, and reason.
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    href="/register"
                    className="group flex flex-col gap-2 rounded-xl border-2 border-blue-primary bg-blue-primary p-4 text-white transition-[transform,box-shadow] duration-fast hover:-translate-y-0.5 hover:shadow-3"
                  >
                    <div className="flex items-center justify-between">
                      <Target size={20} aria-hidden="true" />
                      <ArrowRight size={16} className="transition-transform duration-fast group-hover:translate-x-1" />
                    </div>
                    <p className="text-body-md font-semibold">Check My LeapScore</p>
                    <p className="text-body-sm opacity-85">Free. No CIBIL impact. 60 seconds.</p>
                  </Link>

                  <Link
                    href="/leapmatch"
                    className="group flex flex-col gap-2 rounded-xl border-2 border-border-token-default bg-background-card p-4 text-foreground-primary transition-[transform,box-shadow] duration-fast hover:-translate-y-0.5 hover:shadow-3 hover:border-blue-primary/40"
                  >
                    <div className="flex items-center justify-between">
                      <BarChart3 size={20} className="text-blue-primary" aria-hidden="true" />
                      <ArrowRight size={16} className="text-foreground-tertiary transition-transform duration-fast group-hover:translate-x-1 group-hover:text-blue-primary" />
                    </div>
                    <p className="text-body-md font-semibold">See My Loan Matches</p>
                    <p className="text-body-sm text-foreground-secondary">Personalised lender ranking</p>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-body-sm text-foreground-tertiary">
                  {["No credit score impact", "RBI Registered LSP", "Data stored in India"].map((item) => (
                    <span key={item} className="flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-status-success" aria-hidden="true" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* LeapAI demo — hidden on mobile per spec */}
              <div className="hidden sm:block">
                <LeapAIDemo />
              </div>
            </div>
          </Container>
        </section>

        {/* S3 — TRUST BAR */}
        <section className="border-y border-border-token-default bg-background-page py-6" aria-label="Platform statistics">
          <Container>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6">
                {[
                  { value: 47, suffix: "+", label: "Lender Partners", grouped: false },
                  { value: 120000, suffix: "+", label: "Loans Matched", grouped: true },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      grouped={stat.grouped}
                      className="font-mono text-h1 font-bold text-foreground-primary"
                    />
                    <span className="text-body-sm text-foreground-tertiary">{stat.label}</span>
                  </div>
                ))}
                <div className="flex flex-col">
                  <span className="font-mono text-h1 font-bold text-foreground-primary">₹840Cr</span>
                  <span className="text-body-sm text-foreground-tertiary">Disbursed</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <RbiAlignmentBadge />
                <DpdpComplianceBadge />
              </div>
            </div>
            <LenderMarquee />
          </Container>
        </section>

        {/* S4 — LEAPSCORE PREVIEW */}
        <section className="bg-background-card py-16 md:py-24" aria-labelledby="leapscore-heading">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <RevealOnScroll>
                <div className="flex flex-col gap-6">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-premium/30 bg-premium/10 px-3 py-1.5 text-body-sm font-semibold text-amber-700">
                    <TrendingUp size={13} aria-hidden="true" />
                    LeapScore™ Intelligence
                  </div>
                  <h2 id="leapscore-heading" className="text-display-large font-bold text-foreground-primary">
                    Your credit score.{" "}
                    <span className="text-blue-primary">Explained in plain language.</span>
                  </h2>
                  <p className="text-body-lg text-foreground-secondary">
                    LeapScore combines CIBIL and Experian data with our AI model to give you a single,
                    actionable score — with a step-by-step improvement plan.
                  </p>
                  <ul className="flex flex-col gap-3">
                    {[
                      "Dual-bureau: CIBIL + Experian in one view",
                      "Score Simulator — see impact before you act",
                      "Personalised improvement roadmap",
                      "No hard pull — zero credit score impact",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-body-md text-foreground-secondary">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-status-success" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="primary">
                      <Link href="/register" className="flex items-center gap-2">
                        Check My Free Score <ArrowRight size={16} />
                      </Link>
                    </Button>
                    <Button variant="secondary">
                      <Link href="/leapscore">How LeapScore Works</Link>
                    </Button>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={120}>
                <div className="rounded-2xl border border-border-token-default bg-background-page p-6 shadow-2">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-body-md font-semibold text-foreground-secondary">Sample LeapScore™</p>
                    <ScoreBandBadge band="Good" />
                  </div>
                  <div className="flex justify-center">
                    <ScoreGauge score={74} size={160} />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { label: "CIBIL", value: "742" },
                      { label: "Experian", value: "738" },
                      { label: "FOIR", value: "34%" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg border border-border-token-default bg-background-card p-3 text-center">
                        <p className="font-mono text-h2 font-bold text-foreground-primary">{item.value}</p>
                        <p className="text-body-sm text-foreground-tertiary">{item.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-lg bg-blue-primary/5 border border-blue-primary/15 p-3">
                    <p className="text-body-sm font-semibold text-blue-primary">
                      💡 Reduce credit utilisation 38% → 25% to gain +18 points in 60 days.
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        {/* S5 — LEAPMATCH AI */}
        <section className="bg-background-page py-16 md:py-24" aria-labelledby="leapmatch-heading">
          <Container>
            <RevealOnScroll>
              <div className="mb-10 text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-primary/20 bg-blue-primary/5 px-3 py-1.5 text-body-sm font-semibold text-blue-primary">
                  <Zap size={13} aria-hidden="true" />
                  LeapMatch™ AI
                </div>
                <h2 id="leapmatch-heading" className="text-display-large font-bold text-foreground-primary">
                  Get matched.{" "}
                  <span className="text-blue-primary">Not just compared.</span>
                </h2>
                <p className="mx-auto mt-3 max-w-[560px] text-body-lg text-foreground-secondary">
                  We show you which lender will approve your application, at what rate, and exactly
                  why — before you apply anywhere.
                </p>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {MATCH_CARDS.map((card, i) => (
                <MatchCard key={card.lender} card={card} index={i} />
              ))}
            </div>

            <RevealOnScroll>
              <div className="mt-8 text-center">
                <Button variant="primary" size="lg">
                  <Link href="/register" className="flex items-center gap-2">
                    See My Personalised Matches <ArrowRight size={18} />
                  </Link>
                </Button>
                <p className="mt-2 text-body-sm text-foreground-tertiary">
                  Free. No application needed. Results in under 60 seconds.
                </p>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* S6 — HOW IT WORKS */}
        <section className="bg-background-card py-16 md:py-24" aria-labelledby="how-heading">
          <Container>
            <RevealOnScroll>
              <div className="mb-10 text-center">
                <h2 id="how-heading" className="text-display-large font-bold text-foreground-primary">
                  3 steps. 8 minutes.
                </h2>
                <p className="mt-2 text-body-lg text-foreground-secondary">
                  From checking your score to submitting your application.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  step: "01",
                  icon: <Target size={24} className="text-blue-primary" aria-hidden="true" />,
                  title: "Check Your LeapScore",
                  time: "60 seconds",
                  desc: "We pull your CIBIL and Experian data (soft pull — no score impact) and generate your LeapScore with a complete factor breakdown.",
                },
                {
                  step: "02",
                  icon: <Zap size={24} className="text-blue-primary" aria-hidden="true" />,
                  title: "Get AI-Matched",
                  time: "Instant",
                  desc: "LeapMatch AI scans 47 lenders in real time, ranks them by your approval probability, and shows you the top 3–5 with exact rates.",
                },
                {
                  step: "03",
                  icon: <CheckCircle2 size={24} className="text-blue-primary" aria-hidden="true" />,
                  title: "Apply Once",
                  time: "8 minutes",
                  desc: "Apply to your best match directly from LeapMoney. Pre-filled from your profile. Document upload in app. Real-time status tracking.",
                },
              ].map((item) => (
                <div key={item.step} className="relative rounded-xl border border-border-token-default bg-background-page p-6">
                  <div className="absolute -top-3 left-6 flex h-6 w-8 items-center justify-center rounded-full bg-blue-primary text-label-caps font-bold text-white">
                    {item.step}
                  </div>
                  <div className="mt-2 mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-primary/10">
                    {item.icon}
                  </div>
                  <p className="mb-1 text-h3 font-bold text-foreground-primary">{item.title}</p>
                  <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-status-success/10 px-2 py-0.5 text-body-sm font-semibold text-status-success">
                    <Clock size={11} aria-hidden="true" /> {item.time}
                  </p>
                  <p className="text-body-md text-foreground-secondary">{item.desc}</p>
                </div>
              ))}
            </StaggerContainer>
          </Container>
        </section>

        {/* S6b — LENDER PARTNER GRID */}
        <section className="bg-background-page py-16" aria-labelledby="lenders-heading">
          <Container>
            <RevealOnScroll>
              <div className="mb-8 text-center">
                <h2 id="lenders-heading" className="text-h1 font-bold text-foreground-primary">
                  47 Lenders. One Platform.
                </h2>
                <p className="mt-2 text-body-md text-foreground-secondary">
                  Every major Indian bank and NBFC — ranked by your approval odds.
                </p>
              </div>
            </RevealOnScroll>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {LENDER_NAMES.map((name) => (
                <span
                  key={name}
                  className="inline-flex h-9 items-center rounded-md border border-border-token-default bg-background-card px-3 text-body-sm font-medium text-foreground-secondary shadow-1 hover:border-blue-primary/30 hover:text-foreground-primary transition-colors duration-fast"
                >
                  {name}
                </span>
              ))}
              <span className="inline-flex h-9 items-center rounded-md border border-dashed border-border-token-default px-3 text-body-sm text-foreground-tertiary">
                +27 more
              </span>
            </div>
          </Container>
        </section>

        {/* S7 — LEAPAI COPILOT DARK */}
        <section className="bg-[#0B244E] py-16 md:py-24" aria-labelledby="ai-heading">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <RevealOnScroll>
                <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold">
                      <Bot size={14} className="text-[#0B244E]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-white">LeapAI Copilot</p>
                      <p className="text-label-caps text-status-success">● Available 24/7</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 p-4">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-lg rounded-br-sm bg-white/15 px-3 py-2 text-body-sm text-white">
                        Why did HDFC reject my application?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-lg rounded-bl-sm bg-white/5 border border-white/10 px-3 py-2 text-body-sm text-white/90">
                        <p>Based on your CIBIL report, HDFC declined because:</p>
                        <ul className="mt-1 list-disc pl-4 text-white/80 space-y-0.5">
                          <li>FOIR 52% exceeded their 50% limit</li>
                          <li>2 hard enquiries in last 30 days</li>
                        </ul>
                        <p className="mt-1 text-status-success font-semibold">
                          ✓ Kotak (55% FOIR limit) and Bajaj Finance approve similar profiles.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-white/10 px-4 py-3">
                    <p className="text-body-sm text-white/40">Every recommendation cites the exact reason — no black box.</p>
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delayMs={100}>
                <div className="flex flex-col gap-6">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-body-sm font-semibold text-gold">
                    <Bot size={13} aria-hidden="true" />
                    LeapAI Copilot
                  </div>
                  <h2 id="ai-heading" className="text-display-large font-bold text-white">
                    Your AI credit advisor.{" "}
                    <span className="text-gold">Available 24/7.</span>
                  </h2>
                  <p className="text-body-lg text-white/75">
                    Ask LeapAI anything about your credit profile, loan options, or rejection reasons.
                    Every answer cites the specific data behind it.
                  </p>
                  <ul className="flex flex-col gap-3">
                    {[
                      "Explains rejections in plain language",
                      "Compares lenders for your specific profile",
                      "Tracks application status in real time",
                      "Never claims to be human — always transparent",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-body-md text-white/80">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-status-success" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <Button variant="primary" size="lg">
                      <Link href="/register" className="flex items-center gap-2">
                        Talk to LeapAI <ArrowRight size={18} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </Container>
        </section>

        {/* S8 — TESTIMONIALS */}
        <section className="bg-background-card py-16 md:py-24" aria-labelledby="testimonials-heading">
          <Container>
            <RevealOnScroll>
              <div className="mb-10 text-center">
                <h2 id="testimonials-heading" className="text-display-large font-bold text-foreground-primary">
                  Real borrowers. Real results.
                </h2>
              </div>
            </RevealOnScroll>

            {/* CSS scroll-snap carousel — no JS library per spec */}
            <div
              className="flex snap-x snap-mandatory overflow-x-auto gap-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible"
              role="list"
              aria-label="Customer testimonials"
            >
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="flex-shrink-0 w-[85vw] snap-center md:w-auto rounded-xl border border-border-token-default bg-background-page p-5 flex flex-col gap-4"
                  role="listitem"
                >
                  <div className="flex gap-0.5" aria-label={`${t.stars} out of 5 stars`}>
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} size={14} className="fill-gold text-gold" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="text-body-md text-foreground-secondary leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="rounded-lg bg-status-success/10 border border-status-success/20 px-3 py-2">
                    <p className="font-mono text-h3 font-bold text-status-success">Saved {t.saved}</p>
                    <p className="text-body-sm text-foreground-secondary">vs. direct bank quote</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-border-token-default pt-3">
                    <div>
                      <p className="text-body-md font-semibold text-foreground-primary">{t.name}</p>
                      <p className="text-body-sm text-foreground-tertiary">{t.city} · {t.loanType} · {t.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-body-sm font-semibold text-foreground-secondary">{t.lender}</p>
                      <ScoreBandBadge band={t.score >= 750 ? "Excellent" : t.score >= 700 ? "Good" : "Fair"} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* S9 — SECURITY & COMPLIANCE */}
        <section className="bg-background-page py-16" aria-labelledby="security-heading">
          <Container>
            <RevealOnScroll>
              <div className="mb-8 text-center">
                <h2 id="security-heading" className="text-h1 font-bold text-foreground-primary">
                  Built for trust. Regulated for India.
                </h2>
              </div>
            </RevealOnScroll>
            <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <BadgeCheck size={22} className="text-status-success" aria-hidden="true" />,
                  title: "RBI Registered LSP",
                  desc: "Regulated under RBI Digital Lending Directions 2025. All disclosures mandatory.",
                },
                {
                  icon: <ShieldCheck size={22} className="text-blue-primary" aria-hidden="true" />,
                  title: "DPDP Act 2023 Compliant",
                  desc: "Granular consent. Right to erasure. Data stored exclusively in India (Mumbai).",
                },
                {
                  icon: <Lock size={22} className="text-purple-600" aria-hidden="true" />,
                  title: "AES-256 Encrypted",
                  desc: "Bank-grade encryption at rest and in transit. No third-party sharing without consent.",
                },
                {
                  icon: <TrendingUp size={22} className="text-gold" aria-hidden="true" />,
                  title: "Transparent Commission",
                  desc: "Lenders ranked by your benefit — not commission. Fee structure publicly disclosed.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-border-token-default bg-background-card p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-background-page">
                    {item.icon}
                  </div>
                  <p className="mb-1 text-body-md font-semibold text-foreground-primary">{item.title}</p>
                  <p className="text-body-sm text-foreground-secondary">{item.desc}</p>
                </div>
              ))}
            </StaggerContainer>
          </Container>
        </section>

        {/* S10 — FINAL CTA */}
        <section className="bg-[#0B244E] py-20" aria-labelledby="cta-heading">
          <Container>
            <RevealOnScroll>
              <div className="flex flex-col items-center gap-6 text-center">
                <h2 id="cta-heading" className="max-w-[600px] text-display-large font-bold text-white">
                  Find your best loan offer in 3 minutes.
                </h2>
                <p className="max-w-[440px] text-body-lg text-white/70">
                  Free LeapScore check. AI-matched lenders. No credit score impact.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="primary" size="lg">
                    <Link href="/register" className="flex items-center gap-2">
                      Check My Score Free <ArrowRight size={18} />
                    </Link>
                  </Button>
                  <Link
                    href="/leapmatch"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-body-md font-semibold text-white hover:bg-white/5 transition-colors duration-fast"
                  >
                    Talk to LeapAI <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-body-sm text-white/50">
                  <span>✓ Free — no credit card</span>
                  <span>✓ Soft pull only</span>
                  <span>✓ RBI Registered</span>
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </section>
      </main>

      {/* S11 — Footer */}
      <Footer />
      <StickyMobileCta label="Check My Score Free" href="/register" note="No credit score impact" />
    </>
  );
}
