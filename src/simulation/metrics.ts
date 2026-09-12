import { ConfusionMatrixData, BatchResult } from '../types/simulation';

/**
 * Calculate confusion matrix and performance metrics
 */
export class MetricsCalculator {
  public calculateConfusionMatrix(
    batchResults: BatchResult[]
  ): ConfusionMatrixData {
    // Assume legitimate (no attack) is the negative class
    // and any attack is the positive class

    const legitResult = batchResults.find((r) => r.attack === 'none');
    const attackResults = batchResults.filter((r) => r.attack !== 'none');

    let tp = 0; // True Positive: attack detected as flagged
    let fp = 0; // False Positive: legitimate detected as flagged
    let tn = 0; // True Negative: legitimate detected as legitimate
    let fn = 0; // False Negative: attack detected as legitimate

    // Process legitimate results
    if (legitResult) {
      tn = legitResult.legitCount;
      fp = legitResult.flaggedCount;
    }

    // Process attack results
    for (const result of attackResults) {
      tp += result.flaggedCount;
      fn += result.legitCount;
    }

    // Calculate metrics
    const accuracy = (tp + tn) / (tp + tn + fp + fn);
    const precision = tp === 0 ? 0 : tp / (tp + fp);
    const recall = tp === 0 ? 0 : tp / (tp + fn);
    const f1Score =
      precision + recall === 0
        ? 0
        : (2 * (precision * recall)) / (precision + recall);

    return {
      tp,
      tn,
      fp,
      fn,
      accuracy: Math.max(0, Math.min(1, accuracy)),
      precision: Math.max(0, Math.min(1, precision)),
      recall: Math.max(0, Math.min(1, recall)),
      f1Score: Math.max(0, Math.min(1, f1Score)),
    };
  }
}

export const metricsCalculator = new MetricsCalculator();
