import React, { useState, useEffect } from 'react';
import {
  Send,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  RotateCcw,
  User,
  Stethoscope,
} from 'lucide-react';
import { FarmerAccount } from '../types/agriculture';
import { FruitLogo } from './FruitLogo';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

interface AiAssistantTabProps {
  currentFarmer?: FarmerAccount;
  initialQuestion?: string;
  onGoToDiagnosis?: () => void;
}

export const AiAssistantTab: React.FC<AiAssistantTabProps> = ({
  currentFarmer,
  initialQuestion,
  onGoToDiagnosis,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Kính chào ${currentFarmer ? `bác ${currentFarmer.name}` : 'bác chủ vườn'}! Tôi là Trợ lý Kỹ thuật Canh tác AI Trái ngọt Bắc Ninh. Tôi có thể hỗ trợ bác về: quy trình VietGAP, kỹ thuật hãm lộc đông cho vải thiều, điều tiết phân bón kali nuôi quả cho cam Canh & bưởi Diễn, hoặc chẩn đoán phác đồ sinh học cho sâu bệnh thực địa. Bác cần tôi hỗ trợ việc gì cho vườn đồi nhà mình hôm nay?`,
      time: '08:00',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialQuestion) {
      handleSend(initialQuestion);
    }
  }, [initialQuestion]);

  const samplePrompts = [
    'Cách hãm lộc đông cho cây vải thiều khi trời ấm?',
    'Công thức bón đón trái cho cam Canh vụ Tết?',
    'Phòng trừ bọ xít hại vải bằng biện pháp sinh học?',
    'Tiêu chuẩn cấp mã số vùng trồng xuất khẩu?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          currentFarmer,
        }),
      });

      const data = await response.json();

      let replyText = '';
      if (data.success && data.reply) {
        replyText = data.reply;
      } else {
        replyText = getLocalAgronomyResponse(text);
      }

      const botMessage: Message = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const fallbackReply = getLocalAgronomyResponse(text);
      const botMessage: Message = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalAgronomyResponse = (text: string) => {
    const lower = text.toLowerCase();

    // 1. CÂY CAM ĐƯỜNG CANH / CÂY CÓ MÚI (BƯỞI DIỄN)
    if (lower.includes('cam') || lower.includes('canh') || lower.includes('bưởi') || lower.includes('citrus')) {
      if (lower.includes('bệnh') || lower.includes('vàng lá') || lower.includes('lá') || lower.includes('thối') || lower.includes('héo') || lower.includes('rụng')) {
        return `🍊 **Tư Vấn Khuyến Nông: Xử Lý Bệnh Hại Lá Cây Cam Đường Canh Tại Phường Chũ, TP. Bắc Ninh:**

Kính chào Bác! Với hiện tượng lá cây cam đường Canh bị bệnh biến màu vàng, Trạm Bảo vệ Thực vật khuyến cáo phân biệt 2 bệnh trọng điểm:

1. ⚠️ **Bệnh Vàng Lá Gân Xanh (Greening / Huanglongbing - HLB):**
- **Dấu hiệu:** Phiến lá bị vàng lốm đốm loang lổ, gân lá vẫn giữ màu xanh lục. Lá non mọc dựng đứng nhọn như tai thỏ, lá nhỏ và giòn.
- **Tác nhân:** Vi khuẩn Liberibacter do rầy chổng cánh chích hút truyền bệnh.
- **Biện pháp VietGAP:**
  + Nuôi thả kiến vàng hoặc phun dầu khoáng SK-Enspray 99EC diệt triệt để rầy chổng cánh khi nhú lộc non.
  + Phun phân bón lá vi lượng Chelate (Kẽm, Magie, Bo) để phục hồi sắc tố diệp lục.
  + Cây bị quá nặng (>30% cành tai thỏ) cần đào gốc rắc vôi bột để bảo vệ toàn vườn.

2. 💧 **Bệnh Vàng Lá Thối Rễ (Do ngập úng & nấm Phytophthora):**
- **Dấu hiệu:** Lá vàng đều toàn bộ, rễ tơ thối nâu đen tuột vỏ, có mùi chua.
- **Biện pháp:** Đào rãnh thoát nước, tưới nấm đối kháng Trichoderma + Humic kích rễ, dừng bón đạm vô cơ.

Bác có thể sang tab **"Chẩn đoán bệnh"** để tải ảnh lá cam thực địa nhận diện phác đồ tự động nhé!`;
      }

      return `🍊 **Quy trình Bón Nuôi Quả & Tăng Độ Ngọt Cho Cam Đường Canh & Bưởi Diễn:**

1. **Mục tiêu:** Tăng độ đường Brix lên > 14°, vỏ mỏng đỏ au, không bị khô xơ và chống nứt quả.
2. **Công thức bón đợt này:**
   - **Phân bón gốc:** Mỗi gốc bón 200 - 300g Kali sulphate (K2SO4 - phân Kali trắng), kết hợp 2-3kg phân hữu cơ hoai mục hoặc phân trùn quế vi sinh.
   - **Phun qua lá:** Phun bổ sung Bo + Canxi chelate cùng chế phẩm Kali hữu cơ sinh học để giúp thành tế bào vỏ quả dẻo dai, chống hiện tượng nứt vỏ khi gặp mưa đột ngột.
3. **Chế độ nước:** Duy trì độ ẩm đất ổn định 55 - 60%. Tránh để đất quá khô rồi tưới đẫm nước sẽ làm rạn vỏ múi.`;
    }

    // 2. CÂY VẢI THIỀU
    if (lower.includes('lộc đông') || lower.includes('vải')) {
      return `🌿 **Kỹ thuật Hãm Lộc Đông Thúc Đẩy Phân Hóa Mầm Hoa Vải Thiều Chũ:**

1. **Thời điểm áp dụng:** Từ giữa tháng 10 đến cuối tháng 11 âm lịch khi cây chuẩn bị bước vào giai đoạn ngủ đông.
2. **Biện pháp hãm lộc:**
   - **Khoanh vỏ (xiết cành):** Dùng cưa khoanh mịn 1 vòng khép kín quanh cành cấp 1 hoặc cấp 2 (chiều sâu chạm lớp gỗ, không làm nát vỏ). Cách này ngăn dinh dưỡng hữu cơ chuyển xuống rễ, tích lũy đường bột tạo mầm hoa.
   - **Hạn chế nước và phân đạm:** Tuyệt đối dừng bón đạm hóa học và phân chuồng tươi trong giai đoạn này. Giữ vườn khô ráo, không tưới ẩm.
   - **Xử lý nếu lộc non đã nhú đỏ:** Nếu lộc đông đã nhú < 5cm, bà con có thể phun chế phẩm hãm lộc sinh học nồng độ nhẹ (Ethephon hoặc Paclobutrazol theo liều hướng dẫn của Chi cục BVTV TP. Bắc Ninh) vào ngày trời râm mát.`;
    }

    if (lower.includes('bọ xít') || lower.includes('sâu') || lower.includes('bệnh') || lower.includes('thán thư')) {
      return `🪲 **Phòng Trừ Sâu Bệnh Hại Cây Ăn Quả Bằng Giải Pháp Sinh Học VietGAP:**

1. **Vệ sinh vườn đồi:** Thu gom tàn dư lá bệnh và quả thối rụng mang ra khỏi vườn rắc vôi bột tiêu hủy.
2. **Biện pháp sinh học:**
   - Phun chế phẩm vi sinh đối kháng Trichoderma hoặc Nano Bạc sinh học.
   - Treo bẫy bả chua ngọt hoặc bẫy Pheromone dẫn dụ sâu đục quả.
   - Bảo tồn thiên địch tự nhiên như kiến vàng, bọ rùa và ong ký sinh.
3. **Chẩn đoán hình ảnh:** Nếu phát hiện vết bệnh bất thường, bác có thể chuyển sang tab **"Chẩn đoán bệnh cây trồng"** để chụp ảnh nhận diện phác đồ chi tiết.`;
    }

    return `🌱 **Tư Vấn Khuyến Nông Phường Chũ, TP. Bắc Ninh:**

Về câu hỏi "*${text}*", đội ngũ kỹ sư khuyến nông địa phương khuyến cáo:
- Đảm bảo thực hành nghiêm ngặt tiêu chuẩn VietGAP để nâng cao chất lượng và thương hiệu trái cây Chũ - Bắc Ninh.
- Thường xuyên kiểm tra độ ẩm đất đồi dốc tại trang trại qua trạm quan trắc địa phương.
- Nếu cây có dấu hiệu suy kiệt hoặc nhiễm nấm bệnh, bác có thể dùng tính năng **Chẩn đoán bệnh cây trồng** bằng camera thực địa để nhận diện phác đồ sinh học ngay lập tức.`;
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[740px] font-['Times_New_Roman',Times,serif]">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md">
            <FruitLogo fruit="lychee" className="text-2xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">
                Trợ Lý Kỹ Thuật Canh Tác AI Phường Chũ, TP. Bắc Ninh
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Mô hình Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Tư vấn kỹ thuật VietGAP, hãm lộc, nuôi quả ngọt, phân bón & thổ nhưỡng đồi sỏi son
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onGoToDiagnosis && (
            <button
              onClick={onGoToDiagnosis}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chẩn đoán bệnh</span>
            </button>
          )}

          <button
            onClick={() =>
              setMessages([
                {
                  id: 'welcome',
                  sender: 'assistant',
                  text: 'Hội thoại đã được làm mới. Bác cần tư vấn kỹ thuật gì cho các lô vườn hôm nay?',
                  time: '08:00',
                },
              ])
            }
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Làm mới hội thoại"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <FruitLogo fruit="orange" className="text-xl" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                  : 'bg-slate-50 text-slate-900 border border-slate-200/80 shadow-2xs font-normal whitespace-pre-line'
              }`}
            >
              {msg.text}
              <span
                className={`block text-[10px] mt-1.5 font-medium ${
                  msg.sender === 'user' ? 'text-emerald-200 text-right' : 'text-slate-400'
                }`}
              >
                {msg.time}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-xs mt-1">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
              <FruitLogo fruit="pomelo" className="text-xl" />
            </div>
            <div className="bg-slate-50 text-slate-500 rounded-2xl p-3.5 text-xs border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>Kỹ sư AI đang soạn câu trả lời kỹ thuật...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Gợi ý:
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-xs px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 shrink-0 transition-colors cursor-pointer shadow-2xs font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Message Box */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-card flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập câu hỏi về kỹ thuật canh tác, phân bón, sâu bệnh hại..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent focus:outline-hidden text-slate-800 font-medium"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
          className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-all shadow-xs cursor-pointer flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
