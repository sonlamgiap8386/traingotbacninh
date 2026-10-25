/**
 * ExpertChatTab – Kết Nối Chuyên Gia Nông Nghiệp
 * Tư vấn kỹ thuật canh tác VietGAP trực tiếp với cán bộ khuyến nông
 * Phường Chũ, TP. Bắc Ninh
 */
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Phone,
  MessageCircle,
  Star,
  CheckCircle2,
  Clock,
  Send,
  Award,
  Search,
  Wifi,
  WifiOff,
  User,
  Calendar,
  Zap,
  ExternalLink,
  ArrowLeft,
  Info,
  BookOpen,
  AlertCircle,
  ChevronRight,
  Shield,
  TrendingUp,
  Leaf,
  XCircle,
} from 'lucide-react';
import { AgriExpert, ExpertMessage, FarmerAccount } from '../types/agriculture';
import { AGRI_EXPERTS } from '../data/expertsData';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────────────

interface ExpertChatTabProps {
  currentFarmer?: FarmerAccount;
}

type ViewMode = 'list' | 'profile' | 'chat';

const BADGE_CONFIG: Record<
  AgriExpert['badge'],
  { pill: string; bar: string; ring: string; icon: string }
> = {
  'Cán bộ Khuyến nông': {
    pill: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-100',
    bar: 'from-emerald-500 to-emerald-700',
    ring: 'ring-emerald-500/30',
    icon: '🌾',
  },
  'Chuyên gia Cấp tỉnh': {
    pill: 'bg-blue-50 text-blue-800 border-blue-200 ring-blue-100',
    bar: 'from-blue-500 to-blue-700',
    ring: 'ring-blue-500/30',
    icon: '🏛️',
  },
  'Đầu ngành Quốc gia': {
    pill: 'bg-violet-50 text-violet-800 border-violet-200 ring-violet-100',
    bar: 'from-violet-600 to-violet-900',
    ring: 'ring-violet-500/30',
    icon: '🇻🇳',
  },
  'Nhà nghiên cứu': {
    pill: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-100',
    bar: 'from-amber-500 to-amber-700',
    ring: 'ring-amber-500/30',
    icon: '🔬',
  },
};

const QUICK_TOPICS = [
  { label: 'Nhện đỏ hại lá', emoji: '🕷️' },
  { label: 'Vàng lá gân xanh', emoji: '🍂' },
  { label: 'Kỹ thuật bón phân', emoji: '🌿' },
  { label: 'Hãm lộc đông vải', emoji: '🌸' },
  { label: 'Mã vùng trồng', emoji: '📋' },
];

// ─────────────────────────────────────────────────────────────────────────────
// AI / Fallback reply engine
// ─────────────────────────────────────────────────────────────────────────────

async function fetchExpertReply(
  expertId: string,
  prompt: string,
  farmer?: FarmerAccount
): Promise<string> {
  try {
    // Reuse the supported chat endpoint so expert messages do not make a
    // failed request before falling back to the local reply engine.
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expertId, prompt, currentFarmer: farmer }),
    });
    const data = await res.json();
    if (data.success && data.reply) return data.reply;
  } catch {
    /* fallback */
  }
  return buildFallbackReply(expertId, prompt);
}

function buildFallbackReply(expertId: string, prompt: string): string {
  const expert = AGRI_EXPERTS.find((e) => e.id === expertId);
  const lower = prompt.toLowerCase();
  const name = expert?.name ?? 'Chuyên gia';
  const title = expert?.title ?? '';

  if (lower.includes('nhện') || lower.includes('bạc lá') || lower.includes('rám')) {
    return `Kính chào Bác! Tôi là ${name} – ${title}.\n\nVề triệu chứng **Nhện đỏ** Bác mô tả, đây là vấn đề rất phổ biến trong thời tiết hanh khô:\n\n🔍 **Nhận biết chính xác:**\n• Mặt dưới lá có tơ nhện mỏng\n• Lá bạc trắng lấm tấm từ mặt trên\n• Vỏ quả bị rám xám sần sùi\n\n✅ **Phác đồ sinh học (Ưu tiên):**\n• Phun dầu khoáng SK-Enspray 99EC pha 0,5% vào buổi sáng sớm\n• Bảo tồn bọ rùa và nhện bắt mồi – tránh thuốc phổ rộng\n• Tưới nước áp lực cao phun mặt dưới lá để rửa trôi nhện\n\n⚠️ **Nếu mật độ > 5 con/lá:** Luân phiên Abamectin → Diafenthiuron, PHI 7 ngày.\n\nBác cần hướng dẫn thêm bước nào không ạ?`;
  }
  if (lower.includes('vàng lá') || lower.includes('greening') || lower.includes('hlb')) {
    return `Chào Bác! Tôi là ${name}.\n\n**Bệnh Vàng lá gân xanh (Greening/HLB)** là bệnh nguy hiểm nhất trên cây có múi hiện nay.\n\n🔍 **Dấu hiệu đặc trưng HLB:**\n• Lá vàng lốm đốm không đều, **gân lá vẫn xanh**\n• Lá non mọc dựng đứng nhọn như tai thỏ\n• Quả méo mó, hạt thối đen\n\n🚨 **Quan trọng:** HLB **không có thuốc chữa**, chỉ phòng ngừa bằng diệt rầy chổng cánh!\n\n✅ **Phác đồ xử lý:**\n1. Nuôi thả kiến vàng để săn rầy chổng cánh tự nhiên\n2. Phun dầu Neem + Imidacloprid khi nhú lộc non (3 đợt/năm)\n3. Cây nhiễm nặng: Đào bỏ, rắc vôi bột, trồng giống sạch bệnh có chứng nhận\n\nBác cho biết tỷ lệ cây nhiễm khoảng bao nhiêu %?`;
  }
  if (lower.includes('vải') || lower.includes('lộc đông') || lower.includes('hãm lộc')) {
    return `Kính chào Bác! Tôi là ${name} – ${title}.\n\n**Kỹ thuật hãm lộc đông** cho vải thiều Chũ trong thời điểm se lạnh:\n\n📋 **Nguyên tắc:** Tạo stress khô–lạnh để cây phân hóa mầm hoa, tránh bật lộc non trái vụ.\n\n✅ **Quy trình 4 bước chuẩn:**\n1. **Xiết cành (Khoanh vỏ):** Cưa mịn khoanh 1 vòng quanh cành cấp 1-2, sâu đến tầng gỗ, rộng 3-5mm\n2. **Dừng tưới đẫm:** Chỉ tưới duy trì ẩm tối thiểu khi lá héo nhẹ buổi trưa\n3. **Ngừng bón đạm tuyệt đối:** Không NPK, không ure\n4. **Phun KNO₃ 1%:** Khi thời tiết ấm đột ngột >22°C để kích thích phân hóa mầm hoa\n\n⏰ **Thời điểm lý tưởng tại Bắc Ninh:** Giữa tháng 11 – cuối tháng 12, nhiệt độ đêm <15°C.\n\nVườn Bác hiện đang ở giai đoạn nào?`;
  }
  if (lower.includes('phân bón') || lower.includes('bón phân') || lower.includes('dinh dưỡng')) {
    return `Chào Bác! Tôi là ${name}.\n\n**Dinh dưỡng và phân bón** cho cây ăn quả đặc sản:\n\n🌿 **Nguyên tắc VietGAP:**\n• Ưu tiên hữu cơ vi sinh (trùn quế, phân chuồng ủ hoai) 60-70% tổng lượng\n• Bổ sung vi lượng Chelate (Zn, Mg, Fe, Mn) qua lá theo giai đoạn sinh trưởng\n• Không bón đạm ure tươi trực tiếp vào vùng rễ\n\n📊 **Lịch bón chuẩn cho Cam Canh:**\n• **Sau thu hoạch:** NPK 13-13-13 + Phân chuồng hoai 5 tấn/ha → Phục hồi cây\n• **Thúc lộc xuân:** Đạm sinh học + Lân vi sinh → Kích thích lá mới\n• **Nuôi quả:** K₂SO₄ tăng dần → Tăng độ ngọt brix và bóng vỏ\n\nBác cần tư vấn giai đoạn nào? Diện tích bao nhiêu ha?`;
  }
  return `Kính chào Bác! Tôi là **${name}** – ${title}.\n\nCảm ơn Bác đã tin tưởng liên hệ. Tôi đã ghi nhận câu hỏi: "*${prompt}*"\n\nTôi sẽ phản hồi chi tiết sớm nhất. Trong khi chờ:\n📞 Gọi trực tiếp: ${expert?.phone ?? ''}\n💬 Nhắn Zalo: ${expert?.zalo ?? expert?.phone ?? ''}\n\nTôi cam kết hỗ trợ Bác theo đúng tiêu chuẩn VietGAP và kinh nghiệm thực địa vùng Lục Ngạn, TP. Bắc Ninh!`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({
  rating,
  size = 'sm',
}) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${rating} sao`}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} ${
          s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'
        }`}
      />
    ))}
  </span>
);

/** Render markdown-style **bold** and line breaks */
const RichText: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <span className={className}>
    {text.split('\n').map((line, i, arr) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i} className="block">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="font-bold">{part}</strong> : part
          )}
          {i < arr.length - 1 && <br />}
        </span>
      );
    })}
  </span>
);

const OnlineDot: React.FC<{ online: boolean; size?: 'sm' | 'md' | 'lg' }> = ({
  online,
  size = 'sm',
}) => {
  const sz = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <span
      className={`${sz} rounded-full border-2 border-white ${
        online ? 'bg-green-500' : 'bg-slate-400'
      }`}
      title={online ? 'Đang trực tuyến' : 'Ngoại tuyến'}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export const ExpertChatTab: React.FC<ExpertChatTabProps> = ({ currentFarmer }) => {
  const [view, setView] = useState<ViewMode>('list');
  const [selectedExpert, setSelectedExpert] = useState<AgriExpert | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBadge, setFilterBadge] = useState<string>('Tất cả');
  const [messages, setMessages] = useState<ExpertMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatTopic, setChatTopic] = useState('');
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicDraft, setTopicDraft] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const badgeFilters = ['Tất cả', 'Cán bộ Khuyến nông', 'Chuyên gia Cấp tỉnh', 'Đầu ngành Quốc gia', 'Nhà nghiên cứu'];

  const onlineCount = useMemo(() => AGRI_EXPERTS.filter((e) => e.isOnline).length, []);
  const totalConsulted = useMemo(
    () => AGRI_EXPERTS.reduce((s, e) => s + e.consultedCount, 0),
    []
  );

  const filteredExperts = useMemo(
    () =>
      AGRI_EXPERTS.filter((e) => {
        const q = searchQuery.toLowerCase();
        const matchQ =
          !q ||
          e.name.toLowerCase().includes(q) ||
          e.specialties.some((s) => s.toLowerCase().includes(q)) ||
          e.organization.toLowerCase().includes(q) ||
          e.coverCrops.some((c) => c.toLowerCase().includes(q));
        return matchQ && (filterBadge === 'Tất cả' || e.badge === filterBadge);
      }),
    [searchQuery, filterBadge]
  );

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when entering chat view
  useEffect(() => {
    if (view === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [view]);

  const openTopicModal = useCallback((expert: AgriExpert) => {
    setSelectedExpert(expert);
    setTopicDraft('');
    setShowTopicModal(true);
  }, []);

  const startChat = useCallback(
    (expert: AgriExpert, topic: string) => {
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const topicTrimmed = topic.trim();

      const sysMsg: ExpertMessage = {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: `Phiên tư vấn với **${expert.name}** bắt đầu${topicTrimmed ? ` · Chủ đề: ${topicTrimmed}` : ''}`,
        time: now,
      };
      const greetMsg: ExpertMessage = {
        id: `exp-greet-${Date.now()}`,
        sender: 'expert',
        expertId: expert.id,
        text: `Kính chào ${currentFarmer ? `Bác **${currentFarmer.name}**` : 'Bác'}! Tôi là **${expert.name}** – ${expert.title} tại ${expert.organization}.\n\nTôi sẵn sàng hỗ trợ kỹ thuật canh tác, sâu bệnh và quy trình VietGAP.${
          topicTrimmed
            ? `\n\nVề chủ đề Bác hỏi: "*${topicTrimmed}*", tôi sẽ phân tích ngay bên dưới.`
            : '\n\nBác cần tư vấn vấn đề gì hôm nay ạ?'
        }`,
        time: now,
        isRead: false,
      };

      setMessages([sysMsg, greetMsg]);
      setChatTopic(topicTrimmed);
      setShowTopicModal(false);
      setView('chat');

      if (topicTrimmed) {
        setTimeout(async () => {
          setIsTyping(true);
          const reply = await fetchExpertReply(expert.id, topicTrimmed, currentFarmer);
          setIsTyping(false);
          const replyNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          setMessages((prev) => [
            ...prev,
            {
              id: `exp-${Date.now()}`,
              sender: 'expert',
              expertId: expert.id,
              text: reply,
              time: replyNow,
              isRead: false,
            },
          ]);
        }, 900);
      }
    },
    [currentFarmer]
  );

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !selectedExpert || isTyping) return;
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const farmerMsg: ExpertMessage = {
      id: `farmer-${Date.now()}`,
      sender: 'farmer',
      text,
      time: now,
    };
    setMessages((prev) => [...prev, farmerMsg]);
    setInputText('');
    setIsTyping(true);
    const reply = await fetchExpertReply(selectedExpert.id, text, currentFarmer);
    setIsTyping(false);
    const replyNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: `exp-${Date.now()}`,
        sender: 'expert',
        expertId: selectedExpert.id,
        text: reply,
        time: replyNow,
        isRead: false,
      },
    ]);
  }, [inputText, selectedExpert, isTyping, currentFarmer]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // VIEW: LIST
  // ═══════════════════════════════════════════════════════════════════
  if (view === 'list') {
    return (
      <article className="space-y-5 pb-8" aria-label="Danh sách chuyên gia nông nghiệp">

        {/* ── Hero Banner ─────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#073d26] via-[#0a5235] to-[#062e1c] p-5 sm:p-7 text-white shadow-lg">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-emerald-600/10" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-emerald-500/8" />
            <div className="absolute top-1/2 right-16 w-24 h-24 rounded-full bg-white/5" />
          </div>

          <div className="relative z-10">
            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-xs font-semibold mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              {onlineCount} chuyên gia đang trực tuyến ngay lúc này
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white mb-2">
              Kết Nối Chuyên Gia<br className="hidden sm:block" />
              <span className="text-emerald-300"> Nông Nghiệp Bắc Ninh</span>
            </h1>
            <p className="text-emerald-100/75 text-sm leading-relaxed max-w-md mb-5">
              Chat trực tiếp với cán bộ khuyến nông, chuyên gia cấp tỉnh và nhà khoa học Bộ
              NN&PTNT. Tư vấn kỹ thuật canh tác chuẩn VietGAP — miễn phí hoàn toàn.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Shield, label: 'Miễn phí 100%' },
                { icon: Zap, label: 'Phản hồi nhanh' },
                { icon: Award, label: 'Chứng chỉ quốc gia' },
                { icon: Leaf, label: 'Chuẩn VietGAP' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90"
                >
                  <Icon className="w-3 h-3 text-emerald-300" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats Row ───────────────────────────────────── */}
        <section className="grid grid-cols-3 gap-3" aria-label="Thống kê chuyên gia">
          {[
            { value: AGRI_EXPERTS.length, label: 'Chuyên gia', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: '👨‍🔬' },
            { value: onlineCount, label: 'Đang online', color: 'text-green-700', bg: 'bg-green-50', icon: '🟢' },
            { value: `${(totalConsulted / 1000).toFixed(1)}K`, label: 'Ca tư vấn', color: 'text-blue-700', bg: 'bg-blue-50', icon: '💬' },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-2xl p-3 sm:p-4 border border-slate-200/60 text-center`}
            >
              <div className="text-lg mb-0.5">{s.icon}</div>
              <div className={`text-xl sm:text-2xl font-black ${s.color} leading-none`}>{s.value}</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </section>

        {/* ── Search & Filter ──────────────────────────────── */}
        <section className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 cursor-pointer"
                aria-label="Xóa tìm kiếm"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
            <input
              type="search"
              placeholder="Tìm theo tên, chuyên môn, cây trồng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm chuyên gia"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 transition-shadow"
            />
          </div>

          {/* Badge filters */}
          <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Lọc theo chức danh">
            {badgeFilters.map((f) => (
              <button
                key={f}
                onClick={() => setFilterBadge(f)}
                aria-pressed={filterBadge === f}
                className={`px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer border ${
                  filterBadge === f
                    ? 'bg-[#0a5235] text-white border-[#0a5235] shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                }`}
              >
                {f === 'Tất cả' ? f : (BADGE_CONFIG[f as AgriExpert['badge']]?.icon + ' ' + f)}
              </button>
            ))}
          </div>
        </section>

        {/* ── Expert Cards ─────────────────────────────────── */}
        <section aria-label="Danh sách chuyên gia" className="space-y-3">
          {filteredExperts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200/80 text-center">
              <AlertCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-semibold text-sm">Không tìm thấy chuyên gia phù hợp</p>
              <button
                onClick={() => { setSearchQuery(''); setFilterBadge('Tất cả'); }}
                className="mt-3 text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            filteredExperts.map((expert) => {
              const cfg = BADGE_CONFIG[expert.badge];
              return (
                <article
                  key={expert.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all duration-200 group"
                  itemScope
                  itemType="https://schema.org/Person"
                >
                  {/* Coloured top bar */}
                  <div className={`h-1 bg-gradient-to-r ${cfg.bar}`} />

                  <div className="p-4 sm:p-5">
                    {/* Header row */}
                    <div className="flex items-start gap-3.5">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={expert.avatar}
                          alt={expert.name}
                          itemProp="image"
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow"
                          loading="lazy"
                        />
                        <div className="absolute -bottom-1 -right-1">
                          <OnlineDot online={expert.isOnline} />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="min-w-0">
                            <h3
                              className="font-black text-slate-900 text-[15px] leading-tight truncate"
                              itemProp="name"
                            >
                              {expert.name}
                            </h3>
                            <p className="text-xs text-slate-600 font-medium mt-0.5 truncate" itemProp="jobTitle">
                              {expert.title}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate" itemProp="worksFor">
                              {expert.organization}
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border shrink-0 ${cfg.pill}`}>
                            {cfg.icon} {expert.badge}
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <StarRating rating={expert.rating} />
                          <span className="text-xs font-bold text-amber-600">{expert.rating.toFixed(1)}</span>
                          <span className="text-slate-300 text-xs">·</span>
                          <span className="text-[11px] text-slate-500">
                            <strong className="font-bold text-slate-700">{expert.consultedCount.toLocaleString()}</strong> ca tư vấn
                          </span>
                          <span className="text-slate-300 text-xs">·</span>
                          <span className="text-[11px] text-slate-500">
                            <strong className="font-bold text-slate-700">{expert.experience}</strong> năm KN
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {expert.specialties.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {expert.specialties.length > 4 && (
                        <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                          +{expert.specialties.length - 4} khác
                        </span>
                      )}
                    </div>

                    {/* Status row */}
                    <div className="mt-3 flex items-center gap-2 text-xs flex-wrap">
                      {expert.isOnline ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 border border-green-100 text-green-700 font-semibold">
                          <Wifi className="w-3 h-3" />
                          Trực tuyến
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 font-semibold">
                          <WifiOff className="w-3 h-3" />
                          Ngoại tuyến
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {expert.responseTime}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-3.5">
                      <button
                        onClick={() => { setSelectedExpert(expert); setView('profile'); }}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
                        aria-label={`Xem hồ sơ ${expert.name}`}
                      >
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                        Xem hồ sơ
                      </button>
                      <button
                        onClick={() => openTopicModal(expert)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                          expert.isOnline
                            ? 'bg-[#0a5235] hover:bg-[#0d6644] text-white'
                            : 'bg-slate-700 hover:bg-slate-800 text-white'
                        }`}
                        aria-label={`Chat với ${expert.name}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {expert.isOnline ? 'Chat ngay' : 'Gửi câu hỏi'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* ── Topic Input Modal ────────────────────────────── */}
        {showTopicModal && selectedExpert && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Chọn chủ đề tư vấn"
            onClick={(e) => e.target === e.currentTarget && setShowTopicModal(false)}
          >
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
              {/* Modal header */}
              <div className={`bg-gradient-to-r ${BADGE_CONFIG[selectedExpert.badge].bar} px-5 py-4 flex items-center gap-3`}>
                <img
                  src={selectedExpert.avatar}
                  alt={selectedExpert.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white/30 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-white truncate">{selectedExpert.name}</h3>
                  <p className="text-white/70 text-xs truncate">{selectedExpert.title}</p>
                </div>
                <button
                  onClick={() => setShowTopicModal(false)}
                  className="text-white/70 hover:text-white cursor-pointer p-1"
                  aria-label="Đóng"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-5">
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Bác cần tư vấn vấn đề gì?
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Mô tả ngắn gọn để chuyên gia chuẩn bị câu trả lời chi tiết nhất.
                </p>
                <input
                  type="text"
                  placeholder="Vd: Lá cam bị vàng gân xanh, nhện đỏ hại lá, bón phân giai đoạn nuôi quả..."
                  value={topicDraft}
                  onChange={(e) => setTopicDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && topicDraft.trim() && startChat(selectedExpert, topicDraft)}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 bg-slate-50 mb-3"
                />

                {/* Quick topic chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {QUICK_TOPICS.map(({ label, emoji }) => (
                    <button
                      key={label}
                      onClick={() => setTopicDraft(label)}
                      className={`inline-flex items-center gap-1 text-[11px] sm:text-xs px-2.5 py-1.5 rounded-lg font-medium cursor-pointer transition-colors border ${
                        topicDraft === label
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                      }`}
                    >
                      <span>{emoji}</span> {label}
                    </button>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowTopicModal(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => startChat(selectedExpert, topicDraft)}
                    className="flex-2 px-6 py-3 rounded-xl bg-[#0a5235] hover:bg-[#0d6644] text-white text-sm font-black cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Bắt đầu chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </article>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // VIEW: PROFILE
  // ═══════════════════════════════════════════════════════════════════
  if (view === 'profile' && selectedExpert) {
    const expert = selectedExpert;
    const cfg = BADGE_CONFIG[expert.badge];

    return (
      <article className="space-y-4 pb-8" itemScope itemType="https://schema.org/Person" aria-label={`Hồ sơ ${expert.name}`}>
        {/* Back */}
        <button
          onClick={() => setView('list')}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Danh sách chuyên gia
        </button>

        {/* Profile card */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.bar} p-5 sm:p-7 text-white shadow-lg`}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10" />
          </div>
          <div className="relative z-10 flex items-start gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <img
                src={expert.avatar}
                alt={expert.name}
                itemProp="image"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white/30 shadow-xl"
              />
              <div className="absolute -bottom-1.5 -right-1.5">
                <OnlineDot online={expert.isOnline} size="md" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 border border-white/25 text-white/90 inline-block mb-2">
                {cfg.icon} {expert.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black leading-tight" itemProp="name">{expert.name}</h2>
              <p className="text-white/80 text-sm mt-0.5" itemProp="jobTitle">{expert.title}</p>
              <p className="text-white/60 text-xs mt-0.5" itemProp="worksFor">{expert.organization}</p>
              <div className="flex items-center gap-2 mt-2.5">
                <StarRating rating={expert.rating} size="md" />
                <span className="text-sm font-bold">{expert.rating.toFixed(1)}</span>
                <span className="text-white/50 text-xs">· {expert.consultedCount.toLocaleString()} ca</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: 'Năm kinh nghiệm', value: `${expert.experience}+`, icon: TrendingUp, color: 'text-emerald-700 bg-emerald-50' },
            { label: 'Ca tư vấn', value: expert.consultedCount.toLocaleString(), icon: MessageCircle, color: 'text-blue-700 bg-blue-50' },
            { label: 'Đánh giá', value: `${expert.rating}/5 ⭐`, icon: Star, color: 'text-amber-700 bg-amber-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`${color.split(' ')[1]} rounded-2xl p-3 sm:p-4 border border-slate-200/60 text-center`}>
              <Icon className={`w-5 h-5 ${color.split(' ')[0]} mx-auto mb-1`} />
              <div className={`text-base sm:text-lg font-black ${color.split(' ')[0]} leading-tight`}>{value}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Giới thiệu
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed" itemProp="description">{expert.bio}</p>
        </section>

        {/* Specialties & Cover Crops */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Chuyên môn & Cây trồng phụ trách
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {expert.specialties.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                ✦ {s}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {expert.coverCrops.map((c) => (
              <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">
                🌱 {c}
              </span>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Bằng cấp & Chứng chỉ
          </h3>
          <ul className="space-y-2.5">
            {expert.certifications.map((cert, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> Liên hệ & Lịch làm việc
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-emerald-700" />
              </div>
              <a
                href={`tel:${expert.phone.replace(/\s/g, '')}`}
                className="font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                itemProp="telephone"
              >
                {expert.phone}
              </a>
            </div>
            {expert.zalo && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-blue-700" />
                </div>
                <span className="text-slate-700">Zalo: <strong>{expert.zalo}</strong></span>
              </div>
            )}
            {expert.email && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </div>
                <a
                  href={`mailto:${expert.email}`}
                  className="text-slate-600 text-xs hover:text-emerald-700 transition-colors"
                  itemProp="email"
                >
                  {expert.email}
                </a>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm pt-2 border-t border-slate-100 mt-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-amber-700" />
              </div>
              <span className="text-slate-700 font-medium text-xs">{expert.availableHours}</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${expert.phone.replace(/\s/g, '')}`}
            className="py-3.5 rounded-xl border-2 border-[#0a5235] text-[#0a5235] font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors cursor-pointer"
            aria-label={`Gọi điện cho ${expert.name}`}
          >
            <Phone className="w-4 h-4" /> Gọi điện
          </a>
          <button
            onClick={() => openTopicModal(expert)}
            className="py-3.5 rounded-xl bg-[#0a5235] hover:bg-[#0d6644] text-white font-black text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <MessageCircle className="w-4 h-4" /> Chat tư vấn
          </button>
        </div>

        {/* Topic Input Modal (shared) */}
        {showTopicModal && selectedExpert && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.target === e.currentTarget && setShowTopicModal(false)}
          >
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
              <div className={`bg-gradient-to-r ${BADGE_CONFIG[selectedExpert.badge].bar} px-5 py-4 flex items-center gap-3`}>
                <img src={selectedExpert.avatar} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-white/30 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-white truncate">{selectedExpert.name}</h3>
                  <p className="text-white/70 text-xs truncate">{selectedExpert.title}</p>
                </div>
                <button onClick={() => setShowTopicModal(false)} className="text-white/70 hover:text-white cursor-pointer">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <label className="block text-sm font-bold text-slate-800 mb-3">Bác cần tư vấn vấn đề gì?</label>
                <input
                  type="text"
                  placeholder="Vd: Lá cam bị vàng gân xanh, nhện đỏ, bón phân..."
                  value={topicDraft}
                  onChange={(e) => setTopicDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && topicDraft.trim() && startChat(selectedExpert, topicDraft)}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-400 bg-slate-50 mb-3"
                />
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {QUICK_TOPICS.map(({ label, emoji }) => (
                    <button key={label} onClick={() => setTopicDraft(label)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-medium cursor-pointer border transition-colors ${topicDraft === label ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'}`}>
                      {emoji} {label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowTopicModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold cursor-pointer hover:bg-slate-50">Hủy</button>
                  <button onClick={() => startChat(selectedExpert, topicDraft)} className="flex-1 py-3 rounded-xl bg-[#0a5235] text-white text-sm font-black cursor-pointer hover:bg-[#0d6644] flex items-center justify-center gap-2 shadow-sm">
                    <MessageCircle className="w-4 h-4" /> Bắt đầu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </article>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // VIEW: CHAT
  // ═══════════════════════════════════════════════════════════════════
  if (view === 'chat' && selectedExpert) {
    const expert = selectedExpert;
    const cfg = BADGE_CONFIG[expert.badge];

    return (
      <section
        className="flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
        style={{ height: 'calc(100vh - 210px)', minHeight: 520 }}
        aria-label={`Chat với ${expert.name}`}
      >
        {/* ── Chat Header ─────────────────────────────────── */}
        <header className={`bg-gradient-to-r ${cfg.bar} px-4 py-3 flex items-center gap-3 shrink-0`}>
          <button
            onClick={() => setView('list')}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 cursor-pointer transition-all"
            aria-label="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setView('profile')}
            className="flex items-center gap-3 flex-1 min-w-0 group text-left cursor-pointer"
            aria-label={`Xem hồ sơ ${expert.name}`}
          >
            <div className="relative shrink-0">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-10 h-10 rounded-xl object-cover border border-white/30 group-hover:border-white/60 transition-colors"
              />
              <div className="absolute -bottom-0.5 -right-0.5">
                <OnlineDot online={expert.isOnline} size="sm" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white truncate">{expert.name}</h2>
                <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 shrink-0 transition-colors" />
              </div>
              <p className="text-white/65 text-[11px] truncate">{expert.title}</p>
            </div>
          </button>

          <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            expert.isOnline ? 'bg-green-500/20 text-green-200 border border-green-400/20' : 'bg-white/10 text-white/60'
          }`}>
            {expert.isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {expert.isOnline ? 'Online' : 'Offline'}
          </div>
        </header>

        {/* ── Topic Bar ───────────────────────────────────── */}
        {chatTopic && (
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100/80 flex items-center gap-2 text-xs shrink-0">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium text-emerald-700">Chủ đề:</span>
            <span className="font-bold text-emerald-900 truncate">{chatTopic}</span>
          </div>
        )}

        {/* ── Messages ────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
          style={{ background: 'linear-gradient(180deg,#f8faf8 0%,#f1f5f1 100%)' }}
          role="log"
          aria-live="polite"
          aria-label="Tin nhắn tư vấn"
        >
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <span className="text-[11px] text-slate-400 bg-white/90 px-4 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
                    <RichText text={msg.text} />
                  </span>
                </div>
              );
            }
            const isFarmer = msg.sender === 'farmer';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isFarmer ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                {isFarmer ? (
                  <div className="w-8 h-8 rounded-xl bg-[#0a5235] flex items-center justify-center shrink-0 shadow-sm">
                    {currentFarmer?.avatar ? (
                      <img src={currentFarmer.avatar} alt="" className="w-8 h-8 rounded-xl object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                ) : (
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                  />
                )}

                {/* Bubble */}
                <div className={`flex flex-col gap-1 max-w-[78%] sm:max-w-[72%] ${isFarmer ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-xs ${
                      isFarmer
                        ? 'bg-[#0a5235] text-white rounded-br-sm'
                        : 'bg-white text-slate-800 border border-slate-100/80 rounded-bl-sm'
                    }`}
                  >
                    <RichText text={msg.text} />
                  </div>
                  <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-2.5">
              <img
                src={expert.avatar}
                alt=""
                className="w-8 h-8 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
              />
              <div className="bg-white border border-slate-100/80 rounded-2xl rounded-bl-sm px-4 py-3 shadow-xs">
                <div className="flex items-center gap-1" aria-label="Chuyên gia đang gõ">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* ── Quick Suggestions ────────────────────────────── */}
        <div className="px-3 pt-2 pb-1 flex gap-2 overflow-x-auto bg-white border-t border-slate-100 shrink-0 scrollbar-hide">
          {QUICK_TOPICS.map(({ label, emoji }) => (
            <button
              key={label}
              onClick={() => setInputText(label)}
              className="inline-flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-medium whitespace-nowrap cursor-pointer transition-colors shrink-0 border border-transparent hover:border-emerald-100"
            >
              <span>{emoji}</span> {label}
            </button>
          ))}
        </div>

        {/* ── Input Bar ───────────────────────────────────── */}
        <div className="px-3 pb-3 pt-2 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-shadow">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi kỹ thuật..."
              disabled={isTyping}
              aria-label="Nhập câu hỏi"
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            aria-label="Gửi câu hỏi"
            className="w-11 h-11 rounded-2xl bg-[#0a5235] hover:bg-[#0d6644] text-white flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </section>
    );
  }

  return null;
};
