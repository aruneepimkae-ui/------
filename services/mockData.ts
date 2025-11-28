import { Stock } from '../types';

const generateHistory = (startPrice: number, days: number = 30): { date: string; price: number }[] => {
  const data = [];
  let price = startPrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk
    const change = (Math.random() - 0.5) * (startPrice * 0.05);
    price += change;
    
    data.push({
      date: date.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' }),
      price: parseFloat(price.toFixed(2))
    });
  }
  return data;
};

export const MOCK_STOCKS: Stock[] = [
  {
    symbol: 'PTT',
    name: 'PTT Public Company Limited',
    sector: 'Energy',
    currentPrice: 34.50,
    change: 0.25,
    percentChange: 0.73,
    history: generateHistory(33.0),
    indicators: {
      pe: 10.5,
      pbv: 0.9,
      dividendYield: 5.2,
      rsi: 62,
      macd: 'Bullish',
      volume: '45M'
    },
    recentNews: [
      "ราคาน้ำมันโลกปรับตัวสูงขึ้น หนุนหุ้นกลุ่มพลังงาน",
      "PTT ประกาศแผนการลงทุนพลังงานสะอาดเพิ่ม"
    ]
  },
  {
    symbol: 'AOT',
    name: 'Airports of Thailand',
    sector: 'Transportation',
    currentPrice: 62.75,
    change: -0.50,
    percentChange: -0.79,
    history: generateHistory(64.0),
    indicators: {
      pe: 45.2,
      pbv: 5.8,
      dividendYield: 1.1,
      rsi: 45,
      macd: 'Neutral',
      volume: '12M'
    },
    recentNews: [
      "ยอดนักท่องเที่ยวจีนฟื้นตัวช้ากว่าคาด",
      "AOT เตรียมเปิดอาคารผู้โดยสารใหม่"
    ]
  },
  {
    symbol: 'KBANK',
    name: 'Kasikornbank',
    sector: 'Banking',
    currentPrice: 128.00,
    change: 1.50,
    percentChange: 1.19,
    history: generateHistory(125.0),
    indicators: {
      pe: 8.4,
      pbv: 0.65,
      dividendYield: 4.8,
      rsi: 71,
      macd: 'Bullish',
      volume: '8M'
    },
    recentNews: [
      "ดอกเบี้ยนโยบายทรงตัว หนุน NIM แบงก์",
      "KBANK รุกตลาดสินเชื่อดิจิทัล"
    ]
  },
  {
    symbol: 'DELTA',
    name: 'Delta Electronics (Thailand)',
    sector: 'Electronic Components',
    currentPrice: 78.25,
    change: -2.25,
    percentChange: -2.80,
    history: generateHistory(85.0),
    indicators: {
      pe: 65.4,
      pbv: 12.1,
      dividendYield: 0.5,
      rsi: 30,
      macd: 'Bearish',
      volume: '3M'
    },
    recentNews: [
      "ความกังวลเศรษฐกิจสหรัฐฯ กดดันหุ้นกลุ่มอิเล็กฯ",
      "DELTA ยอดขาย EV Car ยังเติบโตดี"
    ]
  },
  {
    symbol: 'CPALL',
    name: 'CP All Public Company Limited',
    sector: 'Commerce',
    currentPrice: 57.50,
    change: 0.00,
    percentChange: 0.00,
    history: generateHistory(56.0),
    indicators: {
      pe: 28.1,
      pbv: 4.5,
      dividendYield: 2.3,
      rsi: 55,
      macd: 'Neutral',
      volume: '15M'
    },
    recentNews: [
      "มาตรการ Digital Wallet กระตุ้นการจับจ่าย",
      "CPALL ขยายสาขา 7-11 ในกัมพูชาต่อเนื่อง"
    ]
  }
];
