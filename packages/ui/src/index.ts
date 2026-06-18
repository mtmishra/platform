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
export {
  SecurityBadge,
  BureauBadge,
  ComplianceBadge,
  RatingBadge,
  TrustBar,
  RbiAlignmentBadge,
  DpdpComplianceBadge,
  ConsentProtectedBadge,
  BankLevelSecurityBadge,
  EncryptionBadge
} from "./components/trust";
export type {
  TrustBarProps,
  SecurityBadgeProps,
  BureauBadgeProps,
  ComplianceBadgeProps,
  RatingBadgeProps
} from "./components/trust";

// Badge System
export { StatusBadge, ScoreBandBadge, RiskBadge, ConfidenceBadge, BestMatchBadge } from "./components/badges";
export type {
  StatusBadgeProps,
  ScoreBandBadgeProps,
  RiskBadgeProps,
  ConfidenceBadgeProps,
  BestMatchBadgeProps,
  StatusKind,
  ScoreBand,
  RiskLevel,
  Confidence
} from "./components/badges";

// Motion System
export { CountUp, NumberTicker, RevealOnScroll, StaggerContainer, AnimatedCard } from "./components/motion";
export type {
  CountUpProps,
  RevealOnScrollProps,
  StaggerContainerProps,
  AnimatedCardProps
} from "./components/motion";

// Chart System (Legacy V3.0 compatible exports)
export { TrendChart, DistributionChart, MatchStrengthChart } from "./components/charts";
export type {
  TrendChartProps,
  DistributionChartProps,
  DistributionRow,
  MatchStrengthChartProps
} from "./components/charts";

// Empty / Loading / Skeleton States
export { LoadingState, SkeletonState, SkeletonBlock } from "./components/states";
export type {
  LoadingStateProps,
  SkeletonStateProps,
  SkeletonBlockProps
} from "./components/states";

// Hero Number System
export { HeroNumber, LeapScoreNumber, ApprovalOddsNumber, PreApprovedAmount, KpiValue } from "./components/hero-number";
export type {
  HeroNumberProps,
  LeapScoreNumberProps,
  ApprovalOddsNumberProps,
  PreApprovedAmountProps,
  KpiValueProps
} from "./components/hero-number";

// ── Score & Match Primitives (V4.0) ──────────────────────────────────────────
export { ScoreGauge, getBandInfo } from "./components/ScoreGauge";
export type { ScoreGaugeProps } from "./components/ScoreGauge";

export { ApprovalGauge } from "./components/ApprovalGauge";
export type { ApprovalGaugeProps } from "./components/ApprovalGauge";

export { FOIRMeter } from "./components/FOIRMeter";
export type { FOIRMeterProps } from "./components/FOIRMeter";

export { MatchStrengthMeter } from "./components/MatchStrengthMeter";
export type { MatchStrengthMeterProps, ConfidenceLevel } from "./components/MatchStrengthMeter";

export { TrendCharts } from "./components/TrendCharts";
export type { TrendChartsProps } from "./components/TrendCharts";

export { Skeleton, CardSkeleton, ScoreSkeleton, TableSkeleton } from "./components/LoadingSkeletons";

// ── Premium Visual & Card System (V4.0) ──────────────────────────────────────
export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps, EmptyStateVariant } from "./components/EmptyState";

export { SectionHeader } from "./components/SectionHeader";
export type { SectionHeaderProps } from "./components/SectionHeader";

export { PremiumCard, MetricCardV2, MetricCardV2 as StatCardV2, AnalyticsCard, DashboardCard } from "./components/PremiumCards";
export type {
  PremiumCardProps,
  MetricCardV2Props,
  AnalyticsCardProps,
  DashboardCardProps
} from "./components/PremiumCards";

// ── V4.0 Data Visualization System ───────────────────────────────────────────
export { ScoreTrendChart } from "./components/ScoreTrendChart";
export type { ScoreTrendChartProps } from "./components/ScoreTrendChart";

export { ApprovalTrendChart } from "./components/ApprovalTrendChart";
export type { ApprovalTrendChartProps } from "./components/ApprovalTrendChart";

export { PortfolioChart } from "./components/PortfolioChart";
export type { PortfolioChartProps, PortfolioSegment } from "./components/PortfolioChart";

export { RevenueChart } from "./components/RevenueChart";
export type { RevenueChartProps, RevenueDataPoint } from "./components/RevenueChart";

export { FunnelChart } from "./components/FunnelChart";
export type { FunnelChartProps, FunnelStage } from "./components/FunnelChart";

export { GaugeShowcase } from "./components/GaugeLibrary";
export type { GaugeShowcaseProps } from "./components/GaugeLibrary";

// ── V4.0 Product Cards ───────────────────────────────────────────────────────
export { LeapScoreCard } from "./components/LeapScoreCard";
export type { LeapScoreCardProps, LeapScoreFactor } from "./components/LeapScoreCard";

export { LeapMatchCard } from "./components/LeapMatchCard";
export type { LeapMatchCardProps, DocumentCheck } from "./components/LeapMatchCard";

export { CreditHealthCard } from "./components/CreditHealthCard";
export type { CreditHealthCardProps, HealthMetric } from "./components/CreditHealthCard";

export { CashFlowCard } from "./components/CashFlowCard";
export type { CashFlowCardProps } from "./components/CashFlowCard";

export { FinancialAnalysisCard } from "./components/FinancialAnalysisCard";
export type {
  FinancialAnalysisCardProps,
  FinancialFinding,
  FinancialRecommendation
} from "./components/FinancialAnalysisCard";
