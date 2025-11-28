import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { MOCK_STOCKS } from './services/mockData';
import { analyzeStockWithGemini } from './services/aiService';
import { Stock, AIAnalysisResult } from './types';
import { StockChart } from './components/StockChart';
import { ArrowUpRight, ArrowDownRight, BrainCircuit, Activity, BarChart3, Newspaper, RefreshCcw } from 'lucide-react';

export default function App() {
  const [selectedStock, setSelectedStock] = useState<Stock>(MOCK_STOCKS[0]);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset analysis when stock changes
  useEffect(() => {
    setAnalysis(null);
    setError(null);
  }, [selectedStock]);

  const handleAnalyze = async () => {
    setIsLoadingAI(true);
    setError(null);
    try {
      const result = await analyzeStockWithGemini(selectedStock);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const isPositive = selectedStock.change >= 0;
  const priceColor = isPositive ? '#10b981' : '#ef4444'; // Emerald-500 or Red-500

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* Left Column: Stock List */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-700">รายชื่อหุ้น (Watchlist)</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2">
            {MOCK_STOCKS.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                className={`w-full text-left p-4 rounded-lg mb-2 transition-all duration-200 border ${
                  selectedStock.symbol === stock.symbol
                    ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300'
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900 block">{stock.symbol}</span>
                    <span className="text-xs text-slate-500">{stock.sector}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-medium text-slate-900">{stock.currentPrice.toFixed(2)}</span>
                    <span className={`text-xs font-medium flex items-center justify-end ${stock.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.percentChange.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center/Right Column: Details & AI */}
        <div className="lg:col-span-9 flex flex-col gap-6 overflow-y-auto h-[calc(100vh-140px)] pr-2">
          
          {/* Top Section: Price & Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold text-slate-900">{selectedStock.symbol}</h2>
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{selectedStock.sector}</span>
                </div>
                <p className="text-slate-500">{selectedStock.name}</p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <div className="text-4xl font-bold text-slate-900 flex items-center gap-2 justify-end">
                  {selectedStock.currentPrice.toFixed(2)}
                  <span className="text-lg text-slate-400 font-normal">THB</span>
                </div>
                <div className={`flex items-center justify-end gap-1 text-lg font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  {selectedStock.change > 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.percentChange.toFixed(2)}%)
                </div>
              </div>
            </div>

            {/* Chart */}
            <StockChart data={selectedStock.history} color={priceColor} />
            
            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
               <StatBox label="P/E Ratio" value={selectedStock.indicators.pe.toString()} icon={<Activity className="w-4 h-4" />} />
               <StatBox label="RSI (14)" value={selectedStock.indicators.rsi.toString()} icon={<Activity className="w-4 h-4" />} />
               <StatBox label="Div Yield" value={`${selectedStock.indicators.dividendYield}%`} icon={<BarChart3 className="w-4 h-4" />} />
               <StatBox label="Volume" value={selectedStock.indicators.volume} icon={<BarChart3 className="w-4 h-4" />} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            {/* Recent News */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
               <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2 mb-4">
                 <Newspaper className="w-5 h-5 text-blue-500" /> ข่าวสารล่าสุด
               </h3>
               <ul className="space-y-3">
                 {selectedStock.recentNews.map((news, idx) => (
                   <li key={idx} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg">
                      <div className="w-1.5 h-1.5 mt-2 rounded-full bg-slate-400 flex-shrink-0" />
                      <p className="text-sm text-slate-700 leading-relaxed">{news}</p>
                   </li>
                 ))}
               </ul>
            </div>

            {/* AI Analysis Section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden flex flex-col min-h-[300px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BrainCircuit className="w-6 h-6 text-emerald-400" /> AI Analyst (Gemini)
                </h3>
                {analysis && (
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      analysis.recommendation === 'BUY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' :
                      analysis.recommendation === 'SELL' ? 'bg-red-500/20 text-red-300 border border-red-500/50' :
                      'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                   }`}>
                      {analysis.recommendation}
                   </span>
                )}
              </div>

              <div className="flex-1 relative z-10 flex flex-col">
                {!analysis && !isLoadingAI && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                    <p className="text-slate-300 mb-6 text-sm">กดปุ่มด้านล่างเพื่อให้ AI วิเคราะห์ข้อมูลปัจจัยพื้นฐานและเทคนิคของ {selectedStock.symbol}</p>
                    <button 
                      onClick={handleAnalyze}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-6 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                    >
                      <BrainCircuit className="w-4 h-4" /> เริ่มวิเคราะห์
                    </button>
                    {error && <p className="text-red-400 text-xs mt-4 bg-red-900/20 p-2 rounded">{error}</p>}
                  </div>
                )}

                {isLoadingAI && (
                  <div className="flex-1 flex flex-col items-center justify-center py-6">
                    <RefreshCcw className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
                    <p className="text-slate-300 animate-pulse">กำลังประมวลผลข้อมูลตลาด...</p>
                  </div>
                )}

                {analysis && (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-300 flex-1">
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">เหตุผลประกอบ (Reasoning)</p>
                      <p className="text-sm leading-relaxed font-light">{analysis.reasoning}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-xs text-slate-400 mb-1">ความเสี่ยง (Risk)</p>
                          <p className="font-semibold text-emerald-300">{analysis.riskLevel}</p>
                       </div>
                       <div className="bg-white/5 rounded-lg p-3">
                           <p className="text-xs text-slate-400 mb-1">ราคาเป้าหมาย (Target)</p>
                           <p className="font-semibold text-emerald-300">{analysis.targetPrice}</p>
                        </div>
                    </div>
                    
                     <button 
                      onClick={handleAnalyze}
                      className="w-full mt-auto bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs py-2 px-4 rounded transition-colors"
                    >
                      วิเคราะห์อีกครั้ง
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const StatBox: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-center">
    <div className="flex items-center gap-2 text-slate-400 mb-1 text-xs uppercase tracking-wide">
      {icon} {label}
    </div>
    <div className="font-semibold text-slate-800 text-lg">{value}</div>
  </div>
);