import { GoogleGenAI, Type } from "@google/genai";
import { Stock, AIAnalysisResult } from '../types';

// Initialize Gemini Client
// NOTE: In a real app, strict error handling for missing API KEY is needed.
// For this demo, if no key is present, we might want to fail gracefully or show an error.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeStockWithGemini = async (stock: Stock): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    throw new Error("ไม่พบ API Key กรุณาตรวจสอบการตั้งค่า");
  }

  const prompt = `
    คุณเป็นผู้เชี่ยวชาญด้านการวิเคราะห์หุ้นไทยและการเงิน (Financial Analyst).
    ข้อมูลหุ้น: ${stock.symbol} (${stock.name})
    ราคาปัจจุบัน: ${stock.currentPrice} บาท
    การเปลี่ยนแปลง: ${stock.change} (${stock.percentChange}%)
    Sector: ${stock.sector}
    
    ข้อมูลทางเทคนิคและพื้นฐาน:
    - P/E Ratio: ${stock.indicators.pe}
    - RSI (14): ${stock.indicators.rsi}
    - MACD Signal: ${stock.indicators.macd}
    - Dividend Yield: ${stock.indicators.dividendYield}%
    
    ข่าวล่าสุด:
    ${stock.recentNews.map(n => `- ${n}`).join('\n')}

    กรุณาวิเคราะห์ข้อมูลข้างต้นแล้วให้คำแนะนำการลงทุน ตอบกลับเป็น JSON เท่านั้น ตาม Schema นี้:
    {
      "recommendation": "BUY" | "SELL" | "HOLD",
      "reasoning": "ข้อความอธิบายเหตุผลสั้นๆ กระชับ เป็นภาษาไทย ไม่เกิน 3 ประโยค",
      "riskLevel": "Low" | "Medium" | "High",
      "targetPrice": "ประเมินราคาเป้าหมายระยะสั้น (เป็นช่วงราคา)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING, enum: ["BUY", "SELL", "HOLD"] },
            reasoning: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            targetPrice: { type: Type.STRING },
          },
          required: ["recommendation", "reasoning", "riskLevel", "targetPrice"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("ไม่สามารถวิเคราะห์ข้อมูลได้ในขณะนี้");
  }
};
