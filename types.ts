export interface StockDataPoint {
  date: string;
  price: number;
}

export interface FinancialIndicators {
  pe: number;
  pbv: number;
  dividendYield: number;
  rsi: number;
  macd: string; // e.g., "Bullish" or "Bearish"
  volume: string;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  history: StockDataPoint[];
  indicators: FinancialIndicators;
  recentNews: string[];
}

export interface AIAnalysisResult {
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  reasoning: string;
  riskLevel: string;
  targetPrice: string;
}
