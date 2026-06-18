"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Button,
  Container,
  Heading,
  Label,
  Paragraph,
  Section,
  ScoreGauge,
  ApprovalGauge,
  FOIRMeter,
  MatchStrengthMeter,
  TrendCharts,
  TrustBar,
  RevealOnScroll,
  StatusBadge,
  RatingBadge,
} from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/seo";
import { StickyMobileCta } from "@/components/feature/StickyMobileCta";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Sliders,
  Info,
  Sparkles,
  Landmark,
  FileCheck,
  Users,
  Settings,
  Scale,
  Lock,
} from "lucide-react";

// Helper for EMI Calculation: Standard Amortization Formula
const calculateEmi = (p: number, annualRate: number, months: number): number => {
  const r = annualRate / 12 / 100;
  if (r === 0) return p / months;
  return (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
};

export default function HomePage() {
  // ── 1. Interactive State for Score/Eligibility Dashboard ────────────────
  const [cibil, setCibil] = useState(720);
  const [income, setIncome] = useState(65000);
  const [utilisation, setUtilisation] = useState(38);
  const [emi, setEmi] = useState(12000);

  // ── Deterministic Score Engine Calculations (Based on Phase 3 Spec) ────
  // 1. Bureau Score (BS) contribution: max 13.5 pts
  const bs = (cibil - 300) / 600;
  const bsContribution = bs * 13.5;

  // 2. Utilisation Penalty (UP) contribution: max 6 pts
  const up = 1 - utilisation / 100 + (utilisation < 30 ? 0.05 : 0);
  const upClamped = Math.max(0, Math.min(1, up));
  const upContribution = upClamped * 6.0;

  // 3. DPD (assumed 0 DPD for slider ease): max 6 pts
  const dpContribution = 6.0;

  // 4. Enquiries (assumed <=2 for soft-pull rule): max 3 pts
  const epContribution = 3.0;

  // 5. Credit Age (assumed average 5 yrs): max 1.5 pts
  const caContribution = 1.5;

  const creditHealthTotal = bsContribution + upContribution + dpContribution + epContribution + caContribution;

  // Income Base (IB) contribution: max 20 pts
  const ib = Math.min(income / 100000, 1.0);
  const ibContribution = ib * 10;
  const stContribution = 10; // stable salary assumption
  const incomeStabilityTotal = ibContribution + stContribution;

  // FOIR contribution: max 20 pts
  const foirRatio = income > 0 ? Math.round((emi / income) * 100) : 0;
  let foirNormalised = 0;
  if (foirRatio <= 20) foirNormalised = 1.0;
  else if (foirRatio <= 35) foirNormalised = 0.8;
  else if (foirRatio <= 50) foirNormalised = 0.55;
  else if (foirRatio <= 65) foirNormalised = 0.3;
  else if (foirRatio <= 75) foirNormalised = 0.1;
  const foirTotal = foirNormalised * 20;

  // Constants for other scoring variables
  const bankingTotal = 11.5; // average bank balance + credits
  const employmentTotal = 8;  // listed private co + 3yr tenure
  const readinessTotal = 4.5; // KYC documents uploaded

  // Final Composite LeapScore (0-100)
  const dynamicScore = Math.round(
    creditHealthTotal +
    incomeStabilityTotal +
    foirTotal +
    bankingTotal +
    employmentTotal +
    readinessTotal
  );

  // Dynamic APE (Approval Probability Engine) values based on LeapScore
  const hdfcApe = Math.round(Math.max(10, Math.min(98, dynamicScore - 2)));
  const iciciApe = Math.round(Math.max(10, Math.min(98, dynamicScore - 8)));

  // Dynamic Interest Rates (Higher score = lower risk = better rate)
  const hdfcRate = Math.round((10.25 + (100 - dynamicScore) * 0.08) * 100) / 100;
  const iciciRate = Math.round((10.50 + (100 - dynamicScore) * 0.09) * 100) / 100;

  // EMI & TCB calculations (for a 5 Lakh loan over 36 months)
  const loanAmount = 500000;
  const tenureMonths = 36;
  const processingFee = 5000;
  const insuranceFee = 2500;

  const hdfcEmi = Math.round(calculateEmi(loanAmount, hdfcRate, tenureMonths));
  const iciciEmi = Math.round(calculateEmi(loanAmount, iciciRate, tenureMonths));

  const hdfcTcb = (hdfcEmi * tenureMonths) - loanAmount + processingFee + insuranceFee;
  const iciciTcb = (iciciEmi * tenureMonths) - loanAmount + processingFee + insuranceFee;

  const tcbDiff = Math.abs(hdfcTcb - iciciTcb);

  return (
    <>
      <Header />
      <JsonLd data={organizationSchema()} />

      <main className="overflow-hidden bg-background-page">
        {/* ── SECTION 1: HERO SECTION (Outcome-Focused & Interactive Previews) ── */}
        <Section background="feature" className="relative py-16 lg:py-28 text-foreground-on-dark bg-navy-deep">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-navy-deep to-navy-deep opacity-80" />
          <Container className="relative z-10">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6 flex flex-col items-start text-left">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-primary/20 px-3 py-1 text-label-caps font-bold tracking-wider text-blue-400">
                  <Sparkles size={12} /> POWERED BY LEAPMATCH™ AI
                </div>
                <Heading level={1} size="display-hero" className="mb-6 leading-tight tracking-tight text-white">
                  Know your approval chances <span className="text-blue-400">before</span> you apply.
                </Heading>
                <Paragraph size="lg" className="mb-8 text-gray-300 max-w-xl">
                  LeapMoney isn't a loan directory. We map your CIBIL score, bank statements, and debt obligations against live bank rules to predict exactly who will approve you. Soft credit pull, zero score impact.
                </Paragraph>
                <div className="mb-8 flex flex-wrap gap-4">
                  <Button variant="secondary" size="lg" className="shadow-lg hover:scale-102 transition-transform">
                    <Link href="/register">Get Your LeapScore™</Link>
                  </Button>
                  <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                    <a href="#how-it-works" className="flex items-center gap-2">
                      How it works <ArrowRight size={16} />
                    </a>
                  </Button>
                </div>
                <TrustBar variant="default" className="text-gray-400 border-t border-white/10 pt-6 w-full" />
              </div>

              {/* Dynamic Live Widget Preview */}
              <div className="lg:col-span-6 flex flex-col gap-4 w-full">
                <RevealOnScroll className="w-full">
                  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-3">
                    <p className="text-label-caps text-blue-400 font-bold mb-4">LIVE OUTCOME SIMULATION</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                      <div className="flex flex-col items-center">
                        <ScoreGauge score={dynamicScore} size={150} />
                        <span className="text-body-sm text-gray-400 mt-2">Dynamic LeapScore™</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                          <p className="text-body-sm text-gray-400 font-medium">HDFC Bank Personal Loan</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-body-md font-bold text-white">₹5 Lakhs · 36 mos</span>
                            <span className="text-body-sm text-status-success font-semibold">🟢 {hdfcApe}% Odds</span>
                          </div>
                        </div>
                        <div className="rounded-lg bg-white/5 p-3 border border-white/10">
                          <p className="text-body-sm text-gray-400 font-medium">ICICI Bank Personal Loan</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-body-md font-bold text-white">₹5 Lakhs · 36 mos</span>
                            <span className="text-body-sm text-status-warning font-semibold">🟡 {iciciApe}% Odds</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center italic">
                          Adjust parameters in the calculator below to shift outcomes live.
                        </p>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </Container>
        </Section>

        {/* ── SECTION 2: HOW LEAPMONEY WORKS (5 Linear Steps) ────────────────── */}
        <Section id="how-it-works" background="card" className="py-16 border-y border-border-token-default bg-background-card">
          <Container>
            <div className="text-center mb-12">
              <Label caps className="mb-3 block text-interactive-primary">The LeapMatch™ Journey</Label>
              <Heading level={2} size="h1" className="text-foreground-primary">
                From Profile to Disbursement in 5 Confident Steps
              </Heading>
              <Paragraph className="mt-3 max-w-xl mx-auto text-foreground-secondary">
                No spray-and-pray applications. Our systematic, RBI-aligned flow keeps your credit rating protected.
              </Paragraph>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { step: "01", title: "Create Profile", desc: "Declare your income, employment status, and requirements in 2 minutes." },
                { step: "02", title: "Get LeapScore™", desc: "Our engine performs a soft bureau pull and parses monthly statement balance trends." },
                { step: "03", title: "See Approval Probability", desc: "The APE checks your parameters against actual bank limits to output odds." },
                { step: "04", title: "Compare TCB", desc: "Compare matches ranked by Total Cost of Borrowing, including fees and insurance." },
                { step: "05", title: "Apply Confidently", desc: "Submit a verified, complete application package with high approval probability." }
              ].map((s, idx) => (
                <RevealOnScroll key={s.step} delayMs={idx * 80} className="relative flex flex-col gap-3 p-5 rounded-lg bg-background-page border border-border-token-default hover:shadow-2 transition-shadow">
                  <span className="text-display-large font-mono font-bold text-interactive-primary opacity-25">
                    {s.step}
                  </span>
                  <Heading level={3} size="h2" className="text-foreground-primary">{s.title}</Heading>
                  <Paragraph size="sm" color="secondary" className="leading-relaxed">{s.desc}</Paragraph>
                </RevealOnScroll>
              ))}
            </div>
          </Container>
        </Section>

        {/* ── SECTION 3: LEAPSCORE SECTION (Interactive Score Builder & Weights) ── */}
        <Section background="page" className="py-16 lg:py-24 bg-background-page">
          <Container>
            <div className="text-center mb-12">
              <Label caps className="mb-3 block text-interactive-primary">PROPRIETARY SCORE ENGINE</Label>
              <Heading level={2} size="h1" className="text-foreground-primary">
                Interactive Score Card Builder
              </Heading>
              <Paragraph className="mt-3 max-w-xl mx-auto text-foreground-secondary">
                Indian lenders check more than a bureau number. Drag the sliders to see how your LeapScore™ behaves under standard underwriting guidelines.
              </Paragraph>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sliders Panel */}
              <div className="lg:col-span-7 rounded-xl border border-border-token-default bg-background-card p-6 shadow-2">
                <div className="flex items-center gap-2 mb-6 border-b border-border-token-default pb-4">
                  <Sliders className="text-interactive-primary" size={20} />
                  <Heading level={3} size="h2" className="text-foreground-primary">Adjust Profile Signals</Heading>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Slider 1: CIBIL */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-body-sm font-semibold">
                      <span className="text-foreground-secondary">Bureau Score (CIBIL / Experian)</span>
                      <span className="text-interactive-primary font-mono">{cibil}</span>
                    </div>
                    <input
                      type="range"
                      min="300"
                      max="900"
                      value={cibil}
                      onChange={(e) => setCibil(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200-lm rounded-lg appearance-none cursor-pointer accent-blue-primary"
                    />
                    <div className="flex justify-between text-[10px] text-foreground-tertiary">
                      <span>Thin File (300)</span>
                      <span>Average (700)</span>
                      <span>Excellent (900)</span>
                    </div>
                  </div>

                  {/* Slider 2: Income */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-body-sm font-semibold">
                      <span className="text-foreground-secondary">Net Monthly Income (NMI)</span>
                      <span className="text-interactive-primary font-mono">₹{income.toLocaleString("en-IN")}</span>
                    </div>
                    <input
                      type="range"
                      min="20000"
                      max="150000"
                      step="5000"
                      value={income}
                      onChange={(e) => setIncome(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200-lm rounded-lg appearance-none cursor-pointer accent-blue-primary"
                    />
                    <div className="flex justify-between text-[10px] text-foreground-tertiary">
                      <span>₹20,000</span>
                      <span>₹75,000</span>
                      <span>₹1,50,000+</span>
                    </div>
                  </div>

                  {/* Slider 3: Card Utilisation */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-body-sm font-semibold">
                      <span className="text-foreground-secondary">Credit Card Utilisation Ratio</span>
                      <span className="text-interactive-primary font-mono">{utilisation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={utilisation}
                      onChange={(e) => setUtilisation(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200-lm rounded-lg appearance-none cursor-pointer accent-blue-primary"
                    />
                    <div className="flex justify-between text-[10px] text-foreground-tertiary">
                      <span>Ideal (&lt;30%)</span>
                      <span>Moderate (50%)</span>
                      <span>High Risk (100%)</span>
                    </div>
                  </div>

                  {/* Slider 4: Monthly EMIs */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-body-sm font-semibold">
                      <span className="text-foreground-secondary">Existing Monthly EMIs</span>
                      <span className="text-interactive-primary font-mono">₹{emi.toLocaleString("en-IN")}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={emi}
                      onChange={(e) => setEmi(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200-lm rounded-lg appearance-none cursor-pointer accent-blue-primary"
                    />
                    <div className="flex justify-between text-[10px] text-foreground-tertiary">
                      <span>No Obligations (₹0)</span>
                      <span>₹20,000</span>
                      <span>High obligations (₹50,000)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LeapScore Circle & Breakdown Panel */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="rounded-xl border border-border-token-default bg-background-card p-6 shadow-2 flex flex-col items-center">
                  <ScoreGauge score={dynamicScore} size={180} />
                  
                  <div className="mt-4 w-full border-t border-border-token-default pt-4">
                    <p className="text-body-sm font-bold text-foreground-secondary mb-2 text-center">Score Factor Contributions</p>
                    <div className="grid grid-cols-2 gap-3 text-body-sm text-foreground-secondary">
                      <div className="flex justify-between">
                        <span>Bureau Health:</span>
                        <span className="font-mono font-semibold">{(creditHealthTotal).toFixed(1)}/30</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Income Base:</span>
                        <span className="font-mono font-semibold">{(incomeStabilityTotal).toFixed(1)}/20</span>
                      </div>
                      <div className="flex justify-between">
                        <span>FOIR Score:</span>
                        <span className="font-mono font-semibold">{(foirTotal).toFixed(1)}/20</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Banking Behaviour:</span>
                        <span className="font-mono font-semibold">11.5/15</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Improvement Insights */}
                  <div className="mt-6 w-full rounded-lg bg-teal-accent/10 p-4 border border-teal-accent/20">
                    <p className="flex items-center gap-1.5 text-body-sm font-bold text-teal-800">
                      <Sparkles size={14} /> AI Improvement Opportunity
                    </p>
                    <p className="text-body-sm text-teal-900 mt-1">
                      {utilisation > 30 
                        ? `Reducing your card utilisation to 28% would lift your score by +${Math.round(6 - (1 - 28/100)*6)} points.` 
                        : foirRatio > 35 
                        ? "Reducing monthly EMIs from existing loans would comfort your FOIR and lift your score by +5 points."
                        : "Your credit signals are strong. Keep card balances low and salary credit timing stable to maintain this band."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* ── SECTION 4: LEAPMATCH SECTION (Recommended Lenders & Approval Probability) ── */}
        <Section background="card" className="py-16 border-y border-border-token-default bg-background-card">
          <Container>
            <div className="text-center mb-12">
              <Label caps className="mb-3 block text-interactive-primary">LeapMatch™ Recommendations</Label>
              <Heading level={2} size="h1" className="text-foreground-primary">
                Predictive Approval Odds
              </Heading>
              <Paragraph className="mt-3 max-w-xl mx-auto text-foreground-secondary">
                Below are real-time pre-approvals calibrated from your interactive parameters. Completeness builds higher confidence.
              </Paragraph>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: HDFC Bank */}
              <div className="rounded-xl border-2 border-premium/30 bg-background-page p-6 shadow-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-premium text-foreground-primary text-label-caps font-bold px-3 py-1 rounded-bl-lg">
                  #1 BEST MATCH
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-interactive-primary/10 rounded-full flex items-center justify-center font-bold text-interactive-primary text-body-lg">
                    H
                  </div>
                  <div>
                    <Heading level={3} size="h2" className="text-foreground-primary">HDFC Bank Personal Loan</Heading>
                    <RatingBadge rating={4.3} count={1247} className="mt-1" />
                  </div>
                </div>

                <div className="border-t border-border-token-default py-4">
                  <p className="text-label-caps text-foreground-tertiary mb-2 font-bold">APPROVAL LIKELIHOOD</p>
                  <ApprovalGauge probability={hdfcApe} />
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-border-token-default py-4">
                  <div>
                    <span className="text-[10px] text-foreground-tertiary uppercase font-bold">Rate</span>
                    <p className="text-body-md font-bold text-foreground-primary mt-1">{hdfcRate}% p.a.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-foreground-tertiary uppercase font-bold">Est. EMI</span>
                    <p className="text-body-md font-bold text-foreground-primary mt-1">₹{hdfcEmi.toLocaleString("en-IN")}/mo</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-foreground-tertiary uppercase font-bold">TCB Cost</span>
                    <p className="text-body-md font-bold text-status-success mt-1">₹{hdfcTcb.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <MatchStrengthMeter
                  level={dynamicScore >= 80 ? "HIGH" : dynamicScore >= 65 ? "MEDIUM" : "LOW"}
                  className="mt-2"
                />

                <Button variant="primary" className="w-full mt-6">
                  Apply for Loan Offer
                </Button>
              </div>

              {/* Card 2: ICICI Bank */}
              <div className="rounded-xl border border-border-token-default bg-background-card p-6 shadow-1 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-interactive-primary/10 rounded-full flex items-center justify-center font-bold text-interactive-primary text-body-lg">
                    I
                  </div>
                  <div>
                    <Heading level={3} size="h2" className="text-foreground-primary">ICICI Bank Personal Loan</Heading>
                    <RatingBadge rating={4.1} count={892} className="mt-1" />
                  </div>
                </div>

                <div className="border-t border-border-token-default py-4">
                  <p className="text-label-caps text-foreground-tertiary mb-2 font-bold">APPROVAL LIKELIHOOD</p>
                  <ApprovalGauge probability={iciciApe} />
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-border-token-default py-4">
                  <div>
                    <span className="text-[10px] text-foreground-tertiary uppercase font-bold">Rate</span>
                    <p className="text-body-md font-bold text-foreground-primary mt-1">{iciciRate}% p.a.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-foreground-tertiary uppercase font-bold">Est. EMI</span>
                    <p className="text-body-md font-bold text-foreground-primary mt-1">₹{iciciEmi.toLocaleString("en-IN")}/mo</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-foreground-tertiary uppercase font-bold">TCB Cost</span>
                    <p className="text-body-md font-bold text-foreground-secondary mt-1">₹{iciciTcb.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <MatchStrengthMeter
                  level={dynamicScore >= 80 ? "HIGH" : dynamicScore >= 65 ? "MEDIUM" : "LOW"}
                  className="mt-2"
                />

                <Button variant="secondary" className="w-full mt-6">
                  Apply for Loan Offer
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* ── SECTION 5: AI BANK COMPARISON (True Cost of Borrowing Lead Metric) ── */}
        <Section background="page" className="py-16 bg-background-page">
          <Container>
            <div className="text-center mb-12">
              <Label caps className="mb-3 block text-interactive-primary">AI Bank Comparison</Label>
              <Heading level={2} size="h1" className="text-foreground-primary">
                Compare the Total Cost of Borrowing (TCB)
              </Heading>
              <Paragraph className="mt-3 max-w-xl mx-auto text-foreground-secondary">
                Interest rate alone is misleading. Check TCB to see all processing fees, insurance charges, and compound impact side-by-side.
              </Paragraph>
            </div>

            <div className="rounded-xl border border-border-token-default bg-background-card overflow-hidden shadow-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-body-md">
                  <thead>
                    <tr className="border-b border-border-token-default bg-background-page">
                      <th className="p-4 font-semibold text-foreground-secondary">Personal Loan (₹5 Lakhs · 36 mos)</th>
                      <th className="p-4 font-bold text-foreground-primary">HDFC Bank</th>
                      <th className="p-4 font-bold text-foreground-primary">ICICI Bank</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-token-default/50">
                      <td className="p-4 text-foreground-secondary">Approval Likelihood</td>
                      <td className="p-4 font-semibold text-status-success">🟢 {hdfcApe}% (High odds)</td>
                      <td className="p-4 font-semibold text-status-warning">🟡 {iciciApe}% (Medium odds)</td>
                    </tr>
                    <tr className="border-b border-border-token-default/50">
                      <td className="p-4 text-foreground-secondary">Interest Rate Range</td>
                      <td className="p-4 font-mono">{hdfcRate}% p.a.</td>
                      <td className="p-4 font-mono">{iciciRate}% p.a.</td>
                    </tr>
                    <tr className="border-b border-border-token-default/50">
                      <td className="p-4 text-foreground-secondary">Estimated EMI</td>
                      <td className="p-4 font-mono font-semibold text-status-success">₹{hdfcEmi.toLocaleString("en-IN")}/mo</td>
                      <td className="p-4 font-mono font-semibold">₹{iciciEmi.toLocaleString("en-IN")}/mo</td>
                    </tr>
                    <tr className="border-b border-border-token-default bg-blue-primary/5">
                      <td className="p-4 font-semibold text-foreground-primary">Total Cost of Borrowing (TCB)</td>
                      <td className="p-4 font-mono font-bold text-status-success">₹{hdfcTcb.toLocaleString("en-IN")} (LOWER)</td>
                      <td className="p-4 font-mono font-semibold text-status-danger">₹{iciciTcb.toLocaleString("en-IN")} (+₹{tcbDiff.toLocaleString("en-IN")})</td>
                    </tr>
                    <tr className="border-b border-border-token-default/50 text-body-sm text-foreground-tertiary">
                      <td className="p-4 pl-6">— Interest component</td>
                      <td className="p-4 font-mono">₹{((hdfcEmi * tenureMonths) - loanAmount).toLocaleString("en-IN")}</td>
                      <td className="p-4 font-mono">₹{((iciciEmi * tenureMonths) - loanAmount).toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="border-b border-border-token-default/50 text-body-sm text-foreground-tertiary">
                      <td className="p-4 pl-6">— Processing fee (1%)</td>
                      <td className="p-4 font-mono">₹{processingFee.toLocaleString("en-IN")}</td>
                      <td className="p-4 font-mono">₹{processingFee.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="border-b border-border-token-default/50 text-body-sm text-foreground-tertiary">
                      <td className="p-4 pl-6">— Mandatory Insurance</td>
                      <td className="p-4 font-mono">₹{insuranceFee.toLocaleString("en-IN")}</td>
                      <td className="p-4 font-mono">₹{insuranceFee.toLocaleString("en-IN")}</td>
                    </tr>
                    <tr className="border-b border-border-token-default/50">
                      <td className="p-4 text-foreground-secondary">Disbursement SLA</td>
                      <td className="p-4">3–5 working days</td>
                      <td className="p-4 font-semibold text-status-success">⚡ 2–4 working days (FASTER)</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-foreground-secondary">Document Readiness</td>
                      <td className="p-4">4 / 5 components ready</td>
                      <td className="p-4 font-semibold text-status-success">✓ 5 / 5 components ready</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* AI comparison narrative summary card */}
              <div className="bg-background-page p-5 border-t border-border-token-default">
                <div className="flex gap-2">
                  <Info className="text-interactive-primary shrink-0" size={18} />
                  <p className="text-body-sm text-foreground-secondary">
                    <span className="font-semibold text-foreground-primary">AI Advisory Verdict:</span> HDFC Bank is your best value option, saving you <span className="font-semibold text-status-success">₹{tcbDiff.toLocaleString("en-IN")}</span> over {tenureMonths} months despite a minor {Math.abs(hdfcApe - iciciApe)}% approval likelihood gap. However, if disbursement speed is critical, ICICI Bank typically clears underwriting 1 working day faster.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* ── SECTION 6: CREDIT HEALTH DASHBOARD (Portfolio Metrics) ────────────────── */}
        <Section background="card" className="py-16 border-y border-border-token-default bg-background-card">
          <Container>
            <div className="text-center mb-12">
              <Label caps className="mb-3 block text-interactive-primary">User Health Profile</Label>
              <Heading level={2} size="h1" className="text-foreground-primary">
                Your Credit Health Portfolio
              </Heading>
              <Paragraph className="mt-3 max-w-xl mx-auto text-foreground-secondary">
                LeapMoney checks more than a single rating. Track 7 distinct credit parameters in a clean B2C interface.
              </Paragraph>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Side: Score History Trend */}
              <div className="lg:col-span-5 rounded-xl border border-border-token-default bg-background-page p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-body-sm font-semibold text-foreground-secondary">Score Delta History</p>
                    <p className="text-display-large font-bold text-foreground-primary mt-1">+12 points</p>
                  </div>
                  <div className="rounded-full bg-status-success/10 text-status-success font-bold text-label-caps px-3 py-1">
                    IMPROVED
                  </div>
                </div>
                <TrendCharts
                  data={[710, 715, 730, 725, 735, 742]}
                  labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
                  color="#16A34A"
                  height={130}
                />
              </div>

              {/* Right Side: The 5 Health Modules Stack */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {/* Module 1: Utilisation */}
                <div className="rounded-lg border border-border-token-default p-4 bg-background-card flex justify-between items-center">
                  <div className="flex flex-col gap-1 w-full max-w-md">
                    <span className="text-body-sm font-bold text-foreground-primary">Credit Utilisation</span>
                    <FOIRMeter foir={utilisation} showLabels={false} />
                  </div>
                  <span className={`font-mono text-body-md font-semibold ${utilisation < 30 ? "text-status-success" : "text-status-warning"}`}>
                    {utilisation}%
                  </span>
                </div>

                {/* Module 2: Debt-to-Income */}
                <div className="rounded-lg border border-border-token-default p-4 bg-background-card flex justify-between items-center">
                  <div className="flex flex-col gap-1 w-full max-w-md">
                    <span className="text-body-sm font-bold text-foreground-primary">Fixed Obligation (FOIR)</span>
                    <FOIRMeter foir={foirRatio} showLabels={false} />
                  </div>
                  <span className="font-mono text-body-md font-semibold text-status-success">
                    {foirRatio}%
                  </span>
                </div>

                {/* Module 3: Payment History */}
                <div className="rounded-lg border border-border-token-default p-4 bg-background-card flex justify-between items-center">
                  <div>
                    <span className="text-body-sm font-bold text-foreground-primary block">Payment History (DPD)</span>
                    <span className="text-body-sm text-foreground-tertiary">0 delayed payments in 12 months</span>
                  </div>
                  <span className="text-body-sm font-bold text-status-success bg-status-success/10 px-2 py-0.5 rounded">
                    EXCELLENT
                  </span>
                </div>

                {/* Module 4: Credit Age */}
                <div className="rounded-lg border border-border-token-default p-4 bg-background-card flex justify-between items-center">
                  <div>
                    <span className="text-body-sm font-bold text-foreground-primary block">Credit Age</span>
                    <span className="text-body-sm text-foreground-tertiary">Average active credit age is 4.8 years</span>
                  </div>
                  <span className="text-body-sm font-bold text-status-success bg-status-success/10 px-2 py-0.5 rounded">
                    STRONG
                  </span>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* ── SECTION 7: DSA SUITE SECTION (B2B Agent Workspace) ────────────────── */}
        <Section background="page" className="py-16 bg-background-page">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 flex flex-col items-start">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-status-warning/10 px-3 py-1 text-label-caps font-bold tracking-wider text-status-warning">
                  <Users size={12} /> B2B DSA AGENT SYSTEM
                </div>
                <Heading level={2} size="h1" className="text-foreground-primary mb-6">
                  Empowering DSAs with LeapMoney Suite
                </Heading>
                <Paragraph className="text-foreground-secondary mb-6 leading-relaxed">
                  Direct Selling Agents can pre-screen client profiles, trigger soft credit matches on the road, track commission statuses transparently, and upload verification files instantly.
                </Paragraph>
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex gap-2">
                    <CheckCircle className="text-status-success shrink-0" size={18} />
                    <span className="text-body-sm font-medium text-foreground-secondary">Lead Pipeline Kanban &amp; Status Logs</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="text-status-success shrink-0" size={18} />
                    <span className="text-body-sm font-medium text-foreground-secondary">Live Commission Tracker (Pending, Approved, Paid)</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="text-status-success shrink-0" size={18} />
                    <span className="text-body-sm font-medium text-foreground-secondary">Document Collection Hub via WhatsApp links</span>
                  </div>
                </div>
                <Button variant="primary" className="mt-8">
                  <Link href="/dsa">Explore DSA Suite</Link>
                </Button>
              </div>

              {/* Mock DSA Dashboard Widget */}
              <div className="lg:col-span-7 rounded-xl border border-border-token-default bg-background-card p-6 shadow-2">
                <div className="flex justify-between items-center mb-6 border-b border-border-token-default pb-4">
                  <span className="text-body-sm font-bold text-foreground-primary">DSA Workspace · Agent #408</span>
                  <span className="text-label-caps bg-interactive-primary/10 text-interactive-primary font-bold px-2 py-0.5 rounded">
                    ACTIVE SPREAD
                  </span>
                </div>

                {/* Metric Cards Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-background-page p-3 rounded border border-border-token-default">
                    <span className="text-[10px] text-foreground-tertiary uppercase font-bold">Pending Comm</span>
                    <p className="text-body-md font-bold text-foreground-secondary mt-1">₹1,45,000</p>
                  </div>
                  <div className="bg-background-page p-3 rounded border border-border-token-default">
                    <span className="text-[10px] text-foreground-tertiary uppercase font-bold">Approved Comm</span>
                    <p className="text-body-md font-bold text-interactive-primary mt-1">₹85,000</p>
                  </div>
                  <div className="bg-background-page p-3 rounded border border-border-token-default">
                    <span className="text-[10px] text-foreground-tertiary uppercase font-bold">Paid MTD</span>
                    <p className="text-body-md font-bold text-status-success mt-1">₹3,12,000</p>
                  </div>
                </div>

                {/* Lead Pipeline simulation list */}
                <div className="flex flex-col gap-2">
                  <span className="text-body-sm font-bold text-foreground-secondary mb-1 block">Active Client Pipeline</span>
                  <div className="flex justify-between items-center p-3 rounded bg-background-page border border-border-token-default">
                    <span className="text-body-sm font-semibold text-foreground-primary">Rajesh Kumar</span>
                    <span className="text-body-sm text-foreground-tertiary">₹10L MSME Loan</span>
                    <StatusBadge status="under_review" />
                  </div>
                  <div className="flex justify-between items-center p-3 rounded bg-background-page border border-border-token-default">
                    <span className="text-body-sm font-semibold text-foreground-primary">Sunita Sharma</span>
                    <span className="text-body-sm text-foreground-tertiary">₹5L Personal Loan</span>
                    <StatusBadge status="approved" />
                  </div>
                  <div className="flex justify-between items-center p-3 rounded bg-background-page border border-border-token-default">
                    <span className="text-body-sm font-semibold text-foreground-primary">Amit Patel</span>
                    <span className="text-body-sm text-foreground-tertiary">₹45L LAP Loan</span>
                    <StatusBadge status="disbursed" />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* ── SECTION 8: LENDER PORTAL SECTION (B2B Underwriting Analytics) ───────── */}
        <Section background="card" className="py-16 border-y border-border-token-default bg-background-card">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Mock Underwriter Dashboard Widget */}
              <div className="lg:col-span-7 rounded-xl border border-border-token-default bg-background-page p-6 shadow-2 order-last lg:order-first">
                <div className="flex justify-between items-center mb-6 border-b border-border-token-default pb-4">
                  <span className="text-body-sm font-bold text-foreground-primary">Lender Portal · Underwriting Analytics</span>
                  <Settings className="text-foreground-tertiary cursor-pointer" size={18} />
                </div>

                {/* Underwriter chart list */}
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between text-body-sm font-semibold text-foreground-secondary mb-1">
                      <span>Applicant Quality Distribution (LeapScore bands)</span>
                      <span className="text-status-success">Stable</span>
                    </div>
                    {/* Horizontal distribution bars */}
                    <div className="flex h-6 rounded overflow-hidden">
                      <div className="bg-status-success w-[64%] h-full flex items-center justify-center text-[10px] text-white font-bold" title="Band 5 (Loan Ready): 64%">
                        Band 5 (64%)
                      </div>
                      <div className="bg-status-info w-[28%] h-full flex items-center justify-center text-[10px] text-white font-bold" title="Band 4 (Strong): 28%">
                        Band 4 (28%)
                      </div>
                      <div className="bg-status-warning w-[8%] h-full flex items-center justify-center text-[10px] text-white font-bold" title="Band 3 (Improvable): 8%">
                        B3 (8%)
                      </div>
                    </div>
                  </div>

                  {/* Funnel simulation */}
                  <div className="flex flex-col gap-2">
                    <span className="text-body-sm font-bold text-foreground-secondary block">Lender Approval Funnel MTD</span>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-background-card p-2 rounded border border-border-token-default">
                        <span className="text-[10px] text-foreground-tertiary font-bold block">Leads</span>
                        <span className="text-body-sm font-bold text-foreground-primary mt-1">10,000</span>
                      </div>
                      <div className="bg-background-card p-2 rounded border border-border-token-default">
                        <span className="text-[10px] text-foreground-tertiary font-bold block">Screened</span>
                        <span className="text-body-sm font-bold text-foreground-primary mt-1">9,800</span>
                      </div>
                      <div className="bg-background-card p-2 rounded border border-border-token-default">
                        <span className="text-[10px] text-foreground-tertiary font-bold block">Approved</span>
                        <span className="text-body-sm font-bold text-interactive-primary mt-1">7,200</span>
                      </div>
                      <div className="bg-background-card p-2 rounded border border-border-token-default">
                        <span className="text-[10px] text-foreground-tertiary font-bold block">Disbursed</span>
                        <span className="text-body-sm font-bold text-status-success mt-1">6,400</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div className="lg:col-span-5 flex flex-col items-start">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-interactive-primary/10 px-3 py-1 text-label-caps font-bold tracking-wider text-interactive-primary">
                  <Landmark size={12} /> B2B SUPPLY-SIDE LENDER PORTAL
                </div>
                <Heading level={2} size="h1" className="text-foreground-primary mb-6">
                  Institutional Underwriting &amp; Lead Analytics
                </Heading>
                <Paragraph className="text-foreground-secondary mb-6 leading-relaxed">
                  Lenders configure parameters visually, view lead distribution details, and connect through instant, authenticated webhooks to accept pre-verified borrower portfolios.
                </Paragraph>
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex gap-2">
                    <CheckCircle className="text-status-success shrink-0" size={18} />
                    <span className="text-body-sm font-medium text-foreground-secondary">Product &amp; Rate Configuration Engine</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="text-status-success shrink-0" size={18} />
                    <span className="text-body-sm font-medium text-foreground-secondary">Data minimisation application inbox review</span>
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="text-status-success shrink-0" size={18} />
                    <span className="text-body-sm font-medium text-foreground-secondary">Secure webhook event logs and keys dashboard</span>
                  </div>
                </div>
                <Button variant="primary" className="mt-8">
                  <Link href="/lenders">Partner with Us</Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* ── SECTION 9: TRUST & COMPLIANCE (Explicit Consent & RBI Badges) ──────── */}
        <Section background="page" className="py-16 bg-background-page">
          <Container>
            <div className="text-center mb-12">
              <Label caps className="mb-3 block text-interactive-primary">RBI &amp; DPDP compliance</Label>
              <Heading level={2} size="h1" className="text-foreground-primary">
                Built on Trust and Regulatory Alignment
              </Heading>
              <Paragraph className="mt-3 max-w-xl mx-auto text-foreground-secondary">
                Operating a digital loan marketplace in India requires strict adherence to security and consumer guidelines. We build transparency into every transaction.
              </Paragraph>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: <Scale size={24} className="text-interactive-primary" />, title: "RBI-Aligned Marketplace", body: "Explicit rating rules, fee transparency, and direct communication logs with regulated entities only." },
                { icon: <ShieldCheck size={24} className="text-interactive-primary" />, title: "DPDP Consent Log", body: "Every bureau pull and application creates an immutable consent record in our secure audit trail." },
                { icon: <Lock size={24} className="text-interactive-primary" />, title: "Data Protection", body: "No directory sales. Your data is stored locally in AWS Mumbai and used strictly for your matches." },
                { icon: <FileCheck className="text-interactive-primary" size={24} />, title: "GRO Grievance Redressal", body: "Full compliance with RBI GRO appointment policies. Clear escalation matrix on compliance pages." }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3 p-5 rounded-lg border border-border-token-default bg-background-card">
                  {item.icon}
                  <Heading level={3} size="h3" className="text-foreground-primary">{item.title}</Heading>
                  <Paragraph size="sm" color="secondary" className="leading-relaxed">{item.body}</Paragraph>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <TrustBar variant="regulatory" align="center" className="bg-background-card p-4 rounded-xl border border-border-token-default" />
            </div>
          </Container>
        </Section>

        {/* ── SECTION 10: FINAL CTA (Check Score CTA Action) ────────────────── */}
        <Section background="feature" className="py-20 text-foreground-on-dark bg-navy-deep relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/30 via-navy-deep to-navy-deep opacity-80" />
          <Container className="relative z-10">
            <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
              <Label caps className="text-blue-400 font-bold">READY TO COMMENCE?</Label>
              <Heading level={2} size="display-large" className="text-white">
                Get Your LeapScore™
              </Heading>
              <Paragraph size="lg" className="text-gray-300">
                Join 50,000+ Indian borrowers who check their pre-qualified lender matches and approval chances in under 2 minutes. Free and secure.
              </Paragraph>
              <Button variant="secondary" size="lg" className="px-8 mt-4 hover:scale-102 transition-transform">
                <Link href="/register">Check Eligibility Free</Link>
              </Button>
            </div>
          </Container>
        </Section>
      </main>

      <StickyMobileCta label="Check your LeapScore™" href="/register" note="Free · Soft Pull · RBI Compliant" />
      <Footer />
    </>
  );
}
