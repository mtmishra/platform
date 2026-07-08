// ── Conversation history windowing ────────────────────────────────────────
// Sprint 29 Phase 0. The context window must contain the LATEST N turns in
// chronological order. Query pattern: fetch newest-first (order desc +
// limit N — uses idx_ai_message_conversation efficiently), then restore
// chronology here. Fixes the Sprint-28 bug where ascending+limit returned
// the OLDEST N turns.

export interface HistoryTurn {
  role: string;
  content: string;
  /** ISO timestamp; used only for ordering guarantees in tests. */
  created_at?: string;
}

/**
 * Rows arrive newest-first (as queried); returns the same rows oldest-first,
 * capped at `limit` most-recent entries as a defensive re-cap.
 */
export function toChronologicalWindow<T extends HistoryTurn>(newestFirstRows: T[], limit: number): T[] {
  return newestFirstRows.slice(0, Math.max(0, limit)).reverse();
}
