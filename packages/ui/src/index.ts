export { Button } from "./components/button";
export type { ButtonProps } from "./components/button";

export { Input } from "./components/input";
export type { InputProps } from "./components/input";

export { Textarea } from "./components/textarea";
export type { TextareaProps } from "./components/textarea";

export { Card, CardHeader, CardBody } from "./components/card";
export type { CardProps, CardHeaderProps, CardBodyProps } from "./components/card";

export { Container } from "./components/container";
export type { ContainerProps } from "./components/container";

export { Section } from "./components/section";
export type { SectionProps } from "./components/section";

export { Heading, Paragraph, Label } from "./components/typography";
export type { HeadingProps, ParagraphProps, LabelProps } from "./components/typography";

// ── V3.0 Design Foundations (Sprint 19) ───────────────────────────────────────

// Trust Layer
export { TrustBar, SecurityBadge, BureauBadge, ComplianceBadge, RatingBadge } from "./components/trust";
export type { TrustBarProps, SecurityBadgeProps, BureauBadgeProps, ComplianceBadgeProps, RatingBadgeProps } from "./components/trust";

// Badge System
export { StatusBadge, ScoreBandBadge, RiskBadge, ConfidenceBadge, BestMatchBadge } from "./components/badges";
export type { StatusBadgeProps, ScoreBandBadgeProps, RiskBadgeProps, ConfidenceBadgeProps, BestMatchBadgeProps, StatusKind, ScoreBand, RiskLevel, Confidence } from "./components/badges";

// Motion System
export { CountUp, NumberTicker, RevealOnScroll, StaggerContainer, AnimatedCard } from "./components/motion";
export type { CountUpProps, RevealOnScrollProps, StaggerContainerProps, AnimatedCardProps } from "./components/motion";

// Chart System
export { ScoreGauge, TrendChart, DistributionChart, FOIRMeter, MatchStrengthChart } from "./components/charts";
export type { ScoreGaugeProps, TrendChartProps, DistributionChartProps, DistributionRow, FOIRMeterProps, MatchStrengthChartProps } from "./components/charts";

// Empty / Loading / Skeleton States
export { EmptyState, LoadingState, SkeletonState, SkeletonBlock } from "./components/states";
export type { EmptyStateProps, LoadingStateProps, SkeletonStateProps, SkeletonBlockProps } from "./components/states";

// Hero Number System
export { HeroNumber, LeapScoreNumber, ApprovalOddsNumber, PreApprovedAmount, KpiValue } from "./components/hero-number";
export type { HeroNumberProps, LeapScoreNumberProps, ApprovalOddsNumberProps, PreApprovedAmountProps, KpiValueProps } from "./components/hero-number";
