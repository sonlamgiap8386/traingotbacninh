import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Droplets,
  Layers,
  ArrowRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Flame,
  Award,
  Repeat,
  PlusCircle,
  FileEdit,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sun,
  Eye,
  Stethoscope,
  Edit3,
  Pencil,
  DollarSign,
} from 'lucide-react';
import { ActiveTab, ProduceItem, FarmerAccount } from '../types/agriculture';
import { PRODUCE_ITEMS, CALENDAR_TASKS, FARMER_ACCOUNTS } from '../data/mockData';
import { getSynchronizedTasksForFarmer } from '../utils/cultivationSync';
import { LycheeLogo } from './LycheeLogo';

interface OverviewTabProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectProduct: (product: ProduceItem) => void;
  currentFarmer?: FarmerAccount;
  onOpenDeclareOrchard?: () => void;
  onOpenAddProduce?: () => void;
  onSelectFarmer?: (farmer: FarmerAccount) => void;
  onOpenDiagnosis?: () => void;
  isLoggedIn?: boolean;
  onOpenQuickLogin?: () => void;
  produceList?: ProduceItem[];
  onOpenEditProduce?: (product: ProduceItem) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  setActiveTab,
  onSelectProduct,
  currentFarmer,
  onOpenDeclareOrchard,
  onOpenAddProduce,
  onSelectFarmer,
  onOpenDiagnosis,
  isLoggedIn = false,
  onOpenQuickLogin,
  produceList,
  onOpenEditProduce,
}) => {
  const activeFarmer = currentFarmer || FARMER_ACCOUNTS[0];

  const currentProduceList = produceList || PRODUCE_ITEMS;
  const synchronizedTasks = useMemo(() => {
    return getSynchronizedTasksForFarmer(activeFarmer, currentProduceList);
  }, [activeFarmer, currentProduceList]);

  const [completedTaskOverrides, setCompletedTaskOverrides] = useState<Record<string, boolean>>({});

  const toggleTask = (id: string, defaultCompleted: boolean) => {
    setCompletedTaskOverrides((prev) => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : !defaultCompleted,
    }));
  };

  const marketPrices = [
    {
      name: 'Vải thiều Chũ (Loại 1)',
      price: '65.000 đ/kg',
      trend: '+5.000 đ',
      trendUp: true,
      status: 'Chính vụ chất lượng cao',
      origin: 'Phường Chũ, TP. Bắc Ninh',
    },
    {
      name: 'Cam đường Canh Chũ - Bắc Ninh',
      price: '55.000 đ/kg',
      trend: '+2.000 đ',
      trendUp: true,
      status: 'Đạt chuẩn VietGAP',
      origin: 'Phường Chũ, Thanh Hải',
    },
    {
      name: 'Bưởi Diễn Chũ - Bắc Ninh (Quả)',
      price: '38.000 đ/quả',
      trend: 'Ổn định',
      trendUp: null,
      status: 'Vườn cây lão niên > 15 năm',
      origin: 'Xã Nam Dương, TP. Bắc Ninh',
    },
    {
      name: 'Táo xuân Đài Loan',
      price: '28.000 đ/kg',
      trend: '+1.500 đ',
      trendUp: true,
      status: 'Thu hái rộ',
      origin: 'Phường Chũ',
    },
    {
      name: 'Ổi lê Chũ - Bắc Ninh',
      price: '22.000 đ/kg',
      trend: 'Ổn định',
      trendUp: null,
      status: 'Giòn ngọt bao trái',
      origin: 'Phường Chũ, TP. Bắc Ninh',
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-['Times_New_Roman',Times,serif] animate-fade-up">
      {/* Informative notice for Guest / Buyer */}
      {!isLoggedIn && (
        <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Quý khách đang xem <strong>mô hình trang trại chuẩn</strong> của Bác {activeFarmer.name}.
            </span>
          </div>
          {onOpenQuickLogin && (
            <button
              onClick={onOpenQuickLogin}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 shadow-xs cursor-pointer transition-all"
            >
              🌱 Đăng nhập Nhà Vườn để quản lý
            </button>
          )}
        </div>
      )}

      {/* Hero Welcome Banner - Enhanced */}
      <div
        className="relative overflow-hidden rounded-3xl p-5 sm:p-6 lg:p-8 text-white shadow-xl border border-emerald-700/30"
        style={{
          background: 'linear-gradient(135deg, #042d1c 0%, #063f2a 25%, #085030 55%, #063525 80%, #042d1c 100%)',
        }}
      >
        {/* Background decorative patterns */}
        <div className="absolute inset-0 orchard-pattern opacity-60 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-8 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,200,100,0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-6 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)' }} />

        <div className="relative z-10 space-y-4">
          {/* Top greeting row */}
          <div className="flex items-start gap-3">
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 border border-white/15 items-center justify-center shrink-0 shadow-lg">
              <LycheeLogo className="text-3xl animate-float-leaf" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                  🌱 Mùa vụ 2026 · Phường Chũ, TP. Bắc Ninh
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Kính chào Bác {activeFarmer.name}!
              </h2>
              <p className="text-sm text-emerald-200/80 font-medium mt-0.5">
                Trang trại <strong className="text-emerald-300">{activeFarmer.areaHa} ha</strong> · {activeFarmer.treeCount} gốc cây đang sinh trưởng tốt 🍒
              </p>
            </div>
          </div>

          {/* Farmer ID card strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl border border-emerald-500/25"
            style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-700/50 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-white text-sm sm:text-base">
                    Chủ vườn: {activeFarmer.name} · {activeFarmer.farmName || 'Nông trại Thung Lũng Xanh'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-extrabold text-[10px] tracking-wider shrink-0 shadow-sm">
                    ✓ ĐÃ XÁC MINH VIETGAP
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                  Thôn Kép 1, Phường Chũ, TP. Bắc Ninh · SĐT: {activeFarmer.phone || '0918 345 678'} · Giấy phép: {activeFarmer.licenseNo || 'VG-BN-LUC NGAN-2026-088'}
                </p>
              </div>
            </div>

            <button
              onClick={() => { if (onOpenDeclareOrchard) onOpenDeclareOrchard(); }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs shadow-sm transition-all shrink-0 cursor-pointer hover:scale-[1.02]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Xem hồ sơ minh bạch & Giấy phép</span>
            </button>
          </div>

          {/* Quick fruit season tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { emoji: '🍒', label: 'Vải thiều', season: 'T5–T7', color: 'bg-red-500/20 border-red-400/30 text-red-200' },
              { emoji: '🍊', label: 'Cam Canh', season: 'T11–T1', color: 'bg-orange-500/20 border-orange-400/30 text-orange-200' },
              { emoji: '🍈', label: 'Bưởi Diễn', season: 'T11–T2', color: 'bg-yellow-500/20 border-yellow-400/30 text-yellow-200' },
              { emoji: '🍏', label: 'Ổi lê', season: 'Quanh năm', color: 'bg-green-500/20 border-green-400/30 text-green-200' },
            ].map((f) => (
              <span key={f.label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${f.color}`}>
                <span>{f.emoji}</span>
                <span>{f.label}</span>
                <span className="opacity-70">· {f.season}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right side fruit image */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden lg:block">
          <img
            src="/assets/aistudio/vai_thieu_chu_1791794876673_8ae22a2e.jpg"
            alt="Vải thiều Chũ, TP. Bắc Ninh"
            className="w-full h-full object-cover mix-blend-overlay filter blur-sm"
          />
        </div>
      </div>

      {/* 4 Metric Cards - Enhanced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Farm Scale */}
        <div className="rounded-3xl p-5 border shadow-card hover:shadow-card-hover transition-all produce-card stat-card-green">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-emerald-800/70 uppercase tracking-widest">Quy mô trang trại</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-sm">
              <Layers className="w-5 h-5 text-emerald-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-emerald-900">{activeFarmer.areaHa}</span>
            <span className="text-sm font-bold text-emerald-700">Hecta</span>
          </div>
          <p className="text-xs text-emerald-800 font-bold mt-2.5 flex items-center gap-1.5 region-tag px-2 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{activeFarmer.treeCount} gốc · {activeFarmer.certification}</span>
          </p>
        </div>

        {/* Card 2 - Yield */}
        <div className="rounded-3xl p-5 border shadow-card hover:shadow-card-hover transition-all produce-card stat-card-amber">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-amber-800/70 uppercase tracking-widest">Sản lượng 2026</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5 text-amber-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-900">{(activeFarmer.areaHa * 12.8).toFixed(1)}</span>
            <span className="text-sm font-bold text-amber-700">Tấn / mùa</span>
          </div>
          <p className="text-xs text-amber-800 font-bold mt-2.5 flex items-center gap-1.5 bg-amber-100/80 border-l-[3px] border-amber-500 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Tăng +16% so với vụ trước</span>
          </p>
        </div>

        {/* Card 3 - Moisture */}
        <div className="rounded-3xl p-5 border shadow-card hover:shadow-card-hover transition-all produce-card stat-card-blue">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-blue-800/70 uppercase tracking-widest">Độ ẩm đất đồi</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center shadow-sm">
              <Droplets className="w-5 h-5 text-blue-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-blue-900">72.4</span>
            <span className="text-sm font-bold text-blue-700">%</span>
          </div>
          <div className="mt-2.5">
            <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: '72.4%' }} />
            </div>
            <p className="text-[11px] text-blue-800 font-bold mt-1.5">Tối ưu cho tạo mầm hoa 🌺</p>
          </div>
        </div>

        {/* Card 4 - PUC Code */}
        <div className="rounded-3xl p-5 border shadow-card hover:shadow-card-hover transition-all produce-card stat-card-teal">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold text-teal-800/70 uppercase tracking-widest">Mã vùng trồng</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-teal-900 font-mono truncate">{activeFarmer.pucCode}</span>
          </div>
          <p className="text-xs text-teal-800 font-bold mt-2.5 flex items-center gap-1.5 bg-teal-100/80 border-l-[3px] border-teal-500 px-2 py-1 rounded-lg">
            <Award className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Đủ điều kiện xuất khẩu chính ngạch</span>
          </p>
        </div>
      </div>

      {/* 2 Feature Focus Boxes: Garden Location + Live Market Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Market Price Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Bảng Giá Nông Sản Phường Chũ, TP. Bắc Ninh Trực Tiếp Hôm Nay
                </h3>
                <p className="text-xs text-slate-500">
                  Giá giao dịch thực tế tại chợ đầu mối Chũ và các HTX thành viên
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('market')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Xem Sạp Trái Cây</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 uppercase font-bold text-[11px]">
                  <th className="pb-3 font-bold">Nông sản Chũ - Bắc Ninh</th>
                  <th className="pb-3 font-bold">Giá thu mua tại vườn</th>
                  <th className="pb-3 font-bold">Biến động</th>
                  <th className="pb-3 font-bold hidden sm:table-cell">Tiêu chuẩn</th>
                  <th className="pb-3 font-bold text-right">Khu vực thu hái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marketPrices.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-extrabold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 font-black text-emerald-800 text-sm">
                      {item.price}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {item.trend}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 hidden sm:table-cell">
                      <span className="text-[11px] font-semibold bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-slate-500">
                      {item.origin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Quick Access to Garden Location & Google Maps */}
        <div className="bg-gradient-to-br from-emerald-900 to-[#073622] rounded-3xl p-6 text-white shadow-card flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>Vị Trí Vườn & Bản Đồ 3D</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">
              Bản Đồ Không Gian Canh Tác 3D & Google Maps
            </h3>

            <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
              Tra cứu tọa độ địa lý chính xác từng phân khu đồi dốc của 5 chủ vườn tại phường Chũ, TP. Bắc Ninh. Kiểm tra độ cao, hệ thống tưới phun sương tự động và hình ảnh vệ tinh.
            </p>

            <div className="bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-700/40 text-xs space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300">Vị trí hiện tại:</span>
                <span className="font-bold text-white truncate max-w-[150px]">{activeFarmer.shortLocation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-300">Độ cao trung bình:</span>
                <span className="font-bold text-white">95m so với mực nước biển</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-300">Chất đất:</span>
                <span className="font-bold text-white">Feralit đỏ vàng sỏi son</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('garden_map')}
            className="w-full py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <Eye className="w-4 h-4" />
            <span>Mở Bản Đồ Vị Trí Vườn Ngay</span>
          </button>
        </div>
      </div>

      {/* Row 3: Farming Tasks Checklist + Featured Fruit from Orchards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Farming Tasks To-do */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Lịch Trình Canh Tác Tuần Này
                </h3>
                <p className="text-xs text-slate-500">
                  Chuẩn quy trình VietGAP cho từng loại cây ăn quả
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-2.5">
            {synchronizedTasks.slice(0, 5).map((task) => {
              const isCompleted =
                completedTaskOverrides[task.id] !== undefined
                  ? completedTaskOverrides[task.id]
                  : task.completed;
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isCompleted
                      ? 'bg-emerald-50/60 border-emerald-300/80'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-emerald-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-bold text-xs leading-snug ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px]">
                      <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                        {task.crop}
                      </span>
                      {task.logType === 'watering' && (
                        <span className="font-semibold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                          💧 Tưới nước
                        </span>
                      )}
                      {task.logType === 'fertilizing' && (
                        <span className="font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                          🌱 Bón phân
                        </span>
                      )}
                      {task.logType === 'pest' && (
                        <span className="font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          🛡️ BVTV sinh học
                        </span>
                      )}
                      <span className="text-slate-500">Ngày: {task.date}</span>
                      <span
                        className={`font-bold px-1.5 py-0.2 rounded ${
                          task.priority === 'Cao'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Featured Fruits Direct from Orchards */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Đặc Sản Nông Nghiệp Phường Chũ, TP. Bắc Ninh Sẵn Sàng Giao
                </h3>
                <p className="text-xs text-slate-500">
                  Tra cứu nguồn gốc, vị trí nhà vườn trên Google Maps và đặt mua trực tiếp
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('market')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Xem Sạp Trái Cây</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* If farmer is logged in and has produce, show quick price update spotlight */}
          {isLoggedIn && currentFarmer && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-amber-50/50 to-emerald-50 border border-emerald-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                    Cập nhật giá bán nông sản vườn Bác {currentFarmer.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Giá biến động theo phiên chợ Chũ? Bấm sửa để cập nhật giá tức thì lên Sạp trái cây.
                  </p>
                </div>
              </div>

              {onOpenEditProduce && (
                <button
                  type="button"
                  onClick={() => {
                    const allItems = produceList || PRODUCE_ITEMS;
                    const myItem =
                      allItems.find(
                        (p) =>
                          p.farmer.toLowerCase().includes(currentFarmer.name.toLowerCase()) ||
                          p.vietgapCode === currentFarmer.pucCode
                      ) || allItems[0];
                    onOpenEditProduce(myItem);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer hover:scale-[1.02]"
                >
                  <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Sửa Giá Bán Trái Cây Vườn Tôi</span>
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(produceList || PRODUCE_ITEMS).slice(0, 4).map((item) => {
              const isMyItem = Boolean(
                isLoggedIn &&
                  currentFarmer &&
                  (item.farmer.toLowerCase().includes(currentFarmer.name.toLowerCase()) ||
                    item.vietgapCode === currentFarmer.pucCode)
              );

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all shadow-2xs hover:shadow-sm flex gap-3.5 group ${
                    isMyItem
                      ? 'border-emerald-400 bg-emerald-50/40 ring-1 ring-emerald-300/60'
                      : 'border-slate-200/90 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover group-hover:scale-105 transition-transform"
                    />
                    {isMyItem && (
                      <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                        Vườn Bác
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{item.origin.split(',')[0]}</span>
                      </div>

                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2 mt-0.5">
                        {item.name}
                      </h4>

                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs font-black text-emerald-800">
                          {item.price.toLocaleString('vi-VN')} đ / {item.unit}
                        </p>
                        {isMyItem && onOpenEditProduce && (
                          <button
                            type="button"
                            onClick={() => onOpenEditProduce(item)}
                            className="text-[10px] font-extrabold text-amber-900 bg-amber-200/90 hover:bg-amber-300 px-1.5 py-0.5 rounded flex items-center gap-0.5 cursor-pointer"
                            title="Sửa giá bán bài đăng này"
                          >
                            <Pencil className="w-2.5 h-2.5" />
                            <span>Đổi giá</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 mt-1 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold text-amber-700">
                        ★ {item.rating} ({item.reviewCount})
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isMyItem && onOpenEditProduce && (
                          <button
                            onClick={() => onOpenEditProduce(item)}
                            className="px-2 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] transition-colors cursor-pointer"
                          >
                            Sửa bài
                          </button>
                        )}
                        <button
                          onClick={() => onSelectProduct(item)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Xem vườn & Mua
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
