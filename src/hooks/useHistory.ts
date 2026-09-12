import { useState, useEffect, useCallback } from 'react';
import { SimulationResult, HistoryEntry, Verdict } from '../types/simulation';

const HISTORY_KEY = 'quantum-sim-history';
const MAX_HISTORY = 20;

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveHistory = (newHistory: HistoryEntry[]) => {
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const addEntry = useCallback((result: SimulationResult) => {
    let pValue = 0;
    let mismatchRate = 0;
    if (result.basisResults && result.basisResults.length > 0) {
      pValue = result.basisResults[0].detector.pValue;
      mismatchRate = result.basisResults[0].detector.mismatchRate;
    }

    const entry: HistoryEntry = {
      id: result.id,
      timestamp: result.timestamp,
      theta: result.config.theta,
      basis: result.config.basis,
      shots: result.config.shots,
      attack: result.config.attack,
      pValue,
      mismatchRate,
      verdict: result.verdict
    };

    saveHistory(prev => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, []);

  return { history, addEntry, clearHistory };
}
