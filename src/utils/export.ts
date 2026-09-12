// ============================================================
// Export Utilities — CSV / JSON download
// ============================================================

import type { BatchResult, SimulationResult, HistoryEntry } from '../types/simulation';

/**
 * Trigger a file download in the browser
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export history entries as CSV
 */
export function exportHistoryCSV(entries: HistoryEntry[]): void {
  const headers = ['Timestamp', 'Theta (rad)', 'Theta (deg)', 'Basis', 'Shots', 'Attack', 'p-value', 'Mismatch Rate', 'Verdict'];
  const rows = entries.map(e => [
    new Date(e.timestamp).toISOString(),
    e.theta.toFixed(4),
    ((e.theta * 180) / Math.PI).toFixed(1),
    e.basis,
    e.shots,
    e.attack,
    e.pValue.toFixed(6),
    (e.mismatchRate * 100).toFixed(2) + '%',
    e.verdict,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadFile(csv, `quantum-sim-history-${Date.now()}.csv`, 'text/csv');
}

/**
 * Export history entries as JSON
 */
export function exportHistoryJSON(entries: HistoryEntry[]): void {
  const json = JSON.stringify(entries, null, 2);
  downloadFile(json, `quantum-sim-history-${Date.now()}.json`, 'application/json');
}

/**
 * Export batch results as CSV
 */
export function exportBatchCSV(batch: BatchResult): void {
  const lines: string[] = [];

  // Metrics
  lines.push('=== Batch Evaluation Metrics ===');
  lines.push(`Trials per condition,${batch.trialsPerCondition}`);
  lines.push(`Accuracy,${(batch.metrics.accuracy * 100).toFixed(2)}%`);
  lines.push(`Precision,${(batch.metrics.precision * 100).toFixed(2)}%`);
  lines.push(`Recall,${(batch.metrics.recall * 100).toFixed(2)}%`);
  lines.push(`F1 Score,${(batch.metrics.f1 * 100).toFixed(2)}%`);
  lines.push('');

  // Confusion Matrix
  lines.push('=== Confusion Matrix ===');
  lines.push(`True Positives,${batch.metrics.confusion.tp}`);
  lines.push(`True Negatives,${batch.metrics.confusion.tn}`);
  lines.push(`False Positives,${batch.metrics.confusion.fp}`);
  lines.push(`False Negatives,${batch.metrics.confusion.fn}`);
  lines.push('');

  // Detection Rates
  lines.push('=== Detection Rates ===');
  lines.push('Attack Type,Total Trials,Flagged Count,Flagged Rate');
  batch.detectionRates.forEach(d => {
    lines.push(`${d.label},${d.totalTrials},${d.flaggedCount},${(d.flaggedRate * 100).toFixed(2)}%`);
  });
  lines.push('');

  // Individual Results
  lines.push('=== Individual Trial Results ===');
  lines.push('Attack,Verdict,Expected Verdict');
  batch.allResults.forEach(r => {
    lines.push(`${r.attack},${r.verdict},${r.expectedVerdict}`);
  });

  downloadFile(lines.join('\n'), `quantum-sim-batch-${Date.now()}.csv`, 'text/csv');
}

/**
 * Export batch results as JSON
 */
export function exportBatchJSON(batch: BatchResult): void {
  const json = JSON.stringify(batch, null, 2);
  downloadFile(json, `quantum-sim-batch-${Date.now()}.json`, 'application/json');
}

/**
 * Export a single simulation result as JSON
 */
export function exportSimulationJSON(result: SimulationResult): void {
  const json = JSON.stringify(result, null, 2);
  downloadFile(json, `quantum-sim-result-${Date.now()}.json`, 'application/json');
}
