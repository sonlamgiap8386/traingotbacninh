import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Plus,
  Filter,
  AlertTriangle,
  Clock,
  User,
  Package,
  Droplets,
  ShieldCheck,
  FileCheck,
  MapPin,
  RefreshCw,
  X,
  Layers,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CalendarTask, FarmerAccount, ProduceItem } from '../types/agriculture';
import { CultivationLogInput, CultivationLogType, getSynchronizedTasksForFarmer, getFarmerProduce } from '../utils/cultivationSync';
import { LycheeLogo } from './LycheeLogo';

interface CalendarTabProps {
  currentFarmer: FarmerAccount;
  produceList: ProduceItem[];
  onAddCultivationLog: (
    logType: CultivationLogType,
    data: CultivationLogInput
  ) => void;
  isLoggedIn?: boolean;
  onOpenQuickLogin?: () => void;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  currentFarmer,
  produceList,
  onAddCultivationLog,
  isLoggedIn = false,
  onOpenQuickLogin,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Tất cả');
  const [selectedLogType, setSelectedLogType] = useState<
    'all' | 'watering' | 'fertilizing' | 'pest' | 'general'
  >('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addLogCategory, setAddLogCategory] = useState<
    'watering' | 'fertilizing' | 'pest' | 'general'
  >('watering');

  // Local state for tasks that allows toggling completed status
  const [completedTaskIds, setCompletedTaskIds] = useState<Record<string, boolean>>({});

  // Inputs for Add Log Modal
  const [dateStr, setDateStr] = useState<string>(
    new Date().toLocaleDateString('vi-VN')
  );
  // Watering fields
  const [waterMethod, setWaterMethod] = useState<string>('Tưới nhỏ giọt công nghệ Israel quanh tán');
  const [waterAmount, setWaterAmount] = useState<string>('40 lít/gốc');
  const [waterSource, setWaterSource] = useState<string>('Hồ đập thủy nông qua lọc cát vi sinh');
  const [waterNote, setWaterNote] = useState<string>('Duy trì độ ẩm đất 65% cho bộ rễ phát triển khỏe');

  // Fertilizing fields
  const [fertilizerName, setFertilizerName] = useState<string>(
    'Phân bón hữu cơ vi sinh trùn quế Quế Lâm'
  );
  const [fertilizerDosage, setFertilizerDosage] = useState<string>('3.5 kg/gốc');
  const [fertilizerStage, setFertilizerStage] = useState<string>('Nuôi quả & bao trái');
  const [organicCertified, setOrganicCertified] = useState<boolean>(true);
  const [fertilizerNote, setFertilizerNote] = useState<string>(
    'Rải đều theo rãnh quanh mép tán, lấp đất mỏng giữ ẩm'
  );

  // Pest protection fields
  const [productUsed, setProductUsed] = useState<string>(
    'Chế phẩm sinh học thảo mộc Neem Oil + Vi sinh BT'
  );
  const [targetPest, setTargetPest] = useState<string>('Phòng trừ sâu róm non, nhện đỏ và bọ xít');
  const [isolationDays, setIsolationDays] = useState<number>(45);

  // General task fields
  const [generalTitle, setGeneralTitle] = useState<string>('');
  const [generalInstructions, setGeneralInstructions] = useState<string>('');
  const [generalMaterials, setGeneralMaterials] = useState<string>('Dụng cụ làm vườn');

  const farmerProduct = useMemo(
    () => getFarmerProduce(currentFarmer, produceList),
    [currentFarmer, produceList]
  );

  const allTasks = useMemo(
    () => getSynchronizedTasksForFarmer(currentFarmer, produceList),
    [currentFarmer, produceList]
  );

  const toggleTask = (id: string) => {
    setCompletedTaskIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredTasks = useMemo(() => {
    return allTasks
      .map((t) => ({
        ...t,
        completed: completedTaskIds[t.id] !== undefined ? completedTaskIds[t.id] : t.completed,
      }))
      .filter((t) => {
        // Filter by crop
        if (selectedCrop !== 'Tất cả' && !t.crop.toLowerCase().includes(selectedCrop.toLowerCase())) {
          return false;
        }
        // Filter by logType
        if (selectedLogType !== 'all') {
          if (t.logType !== selectedLogType) return false;
        }
        return true;
      });
  }, [allTasks, completedTaskIds, selectedCrop, selectedLogType]);

  const crops = ['Tất cả', 'Vải thiều', 'Cam đường Canh', 'Bưởi Diễn', 'Ổi lê Chũ', 'Táo xuân'];

  const wateringCount = allTasks.filter((t) => t.logType === 'watering').length;
  const fertilizingCount = allTasks.filter((t) => t.logType === 'fertilizing').length;
  const pestCount = allTasks.filter((t) => t.logType === 'pest').length;
  const generalCount = allTasks.filter((t) => t.logType === 'general').length;

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();

    if (addLogCategory === 'watering') {
      onAddCultivationLog('watering', {
        date: dateStr,
        method: waterMethod,
        amountLiters: waterAmount,
        waterSource,
        note: waterNote,
      });
    } else if (addLogCategory === 'fertilizing') {
      onAddCultivationLog('fertilizing', {
        date: dateStr,
        fertilizerName,
        dosage: fertilizerDosage,
        stage: fertilizerStage,
        organicCertified,
        note: fertilizerNote,
      });
    } else if (addLogCategory === 'pest') {
      onAddCultivationLog('pest', {
        date: dateStr,
        productUsed,
        targetPest,
        isolationDaysBeforeHarvest: isolationDays,
      });
    } else {
      onAddCultivationLog('general', {
        date: dateStr,
        title: generalTitle || 'Chăm sóc vườn theo chuẩn VietGAP',
        instructions: generalInstructions,
        materials: generalMaterials,
      });
    }

    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12 font-['Times_New_Roman',Times,serif]">
      {/* Synchronization Header Banner */}
      <div className="bg-gradient-to-r from-[#06432b] via-[#095738] to-[#042d1c] rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-emerald-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Mã Vùng Trồng PUC: {currentFarmer.pucCode} · VietGAP</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-200 text-xs font-semibold">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Đồng bộ 100% với Logs Truy Xuất Nông Sản</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              Nhật Ký &amp; Lịch Canh Tác Điện Tử Vườn Bác {currentFarmer.name}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Mọi hoạt động tưới nước, bón phân, cách ly thuốc BVTV ghi chép tại đây được <strong>tự động đồng bộ sang trang chi tiết nông sản</strong> để khách mua quét mã QR kiểm tra nhật ký minh bạch.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{currentFarmer.location}</span>
            </div>
          </div>

          {/* Quick Stats & Action Button */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="bg-emerald-950/70 border border-emerald-700/50 px-4 py-2.5 rounded-2xl text-center shrink-0">
              <span className="text-[11px] text-emerald-300 font-bold block">Tổng nhật ký &amp; logs:</span>
              <p className="text-lg font-black text-white">
                {allTasks.length} Bản Ghi
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Ghi Nhật Ký Canh Tác Mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Log Category Switcher */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedLogType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedLogType === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📋 Tất cả ({allTasks.length})
          </button>

          <button
            onClick={() => setSelectedLogType('watering')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedLogType === 'watering'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-800 hover:bg-blue-50'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span>💧 Tưới nước ({wateringCount})</span>
          </button>

          <button
            onClick={() => setSelectedLogType('fertilizing')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedLogType === 'fertilizing'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <LycheeLogo className="text-sm" />
            <span>🌱 Bón phân ({fertilizingCount})</span>
          </button>

          <button
            onClick={() => setSelectedLogType('pest')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedLogType === 'pest'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>🛡️ Phun BVTV sinh học ({pestCount})</span>
          </button>

          <button
            onClick={() => setSelectedLogType('general')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedLogType === 'general'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ✂️ Công việc mùa vụ ({generalCount})
          </button>
        </div>

        {/* Filter by Crop */}
        <div className="flex items-center gap-1 text-xs">
          <span className="font-bold text-slate-500">Cây trồng:</span>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-emerald-600"
          >
            {crops.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task & Cultivation Log List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/90 shadow-2xs space-y-2">
            <CalendarIcon className="w-10 h-10 mx-auto text-slate-300" />
            <h4 className="font-bold text-slate-700 text-sm">Chưa có nhật ký nào trong mục này</h4>
            <p className="text-xs text-slate-500">
              Bấm &ldquo;Ghi Nhật Ký Canh Tác Mới&rdquo; để thêm đợt tưới nước, bón phân hoặc công việc chăm sóc.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isWatering = task.logType === 'watering';
            const isFert = task.logType === 'fertilizing';
            const isPest = task.logType === 'pest';

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-2xs hover:shadow-xs ${
                  task.completed
                    ? 'border-emerald-200/90 bg-emerald-50/15'
                    : 'border-slate-200/90 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                      title={task.completed ? 'Đã hoàn thành theo chuẩn VietGAP' : 'Đánh dấu hoàn thành'}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300 hover:text-emerald-500" />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Badge row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isWatering && (
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-blue-600" />
                            <span>Nhật Ký Tưới Nước (VietGAP Log)</span>
                          </span>
                        )}
                        {isFert && (
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <LycheeLogo className="text-xs" />
                            <span>Nhật Ký Bón Phân (VietGAP Log)</span>
                          </span>
                        )}
                        {isPest && (
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            <span>Phòng Trừ Sinh Học &amp; Cách Ly PHI</span>
                          </span>
                        )}
                        {!isWatering && !isFert && !isPest && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            Công Việc Canh Tác Mùa Vụ
                          </span>
                        )}

                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                          {task.crop}
                        </span>

                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {task.date}
                        </span>

                        {task.completed && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                            ✓ Đã ghi vào sổ logs
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-extrabold text-slate-900 leading-snug ${
                          task.completed ? 'text-slate-800' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Instructions / Log Note */}
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                        {task.instructions}
                      </p>

                      {/* Materials / Details */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
                          <Package className="w-3.5 h-3.5" /> Thông số / Vật tư:
                        </span>
                        {task.materialsNeeded.map((mat, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Assigned To Farmer */}
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{task.assignedTo || currentFarmer.name}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task / Cultivation Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-800 to-emerald-950 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 text-emerald-300 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Ghi Nhật Ký Canh Tác Điện Tử VietGAP
                  </h3>
                  <p className="text-xs text-emerald-200/90">
                    Tự động đồng bộ sang mã QR &amp; Logs kiểm định của vườn
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Category Picker */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Chọn phân loại nhật ký cần ghi:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAddLogCategory('watering')}
                    className={`p-2.5 rounded-xl font-bold border flex items-center gap-2 cursor-pointer ${
                      addLogCategory === 'watering'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Droplets className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>💧 Tưới nước</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddLogCategory('fertilizing')}
                    className={`p-2.5 rounded-xl font-bold border flex items-center gap-2 cursor-pointer ${
                      addLogCategory === 'fertilizing'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <LycheeLogo className="text-base shrink-0" />
                    <span>🌱 Bón phân</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddLogCategory('pest')}
                    className={`p-2.5 rounded-xl font-bold border flex items-center gap-2 cursor-pointer ${
                      addLogCategory === 'pest'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>🛡️ Phun BVTV sinh học</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddLogCategory('general')}
                    className={`p-2.5 rounded-xl font-bold border flex items-center gap-2 cursor-pointer ${
                      addLogCategory === 'general'
                        ? 'bg-slate-100 border-slate-500 text-slate-900 ring-1 ring-slate-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>✂️ Công việc mùa vụ</span>
                  </button>
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ngày thực hiện / Ngày ghi nhận
                </label>
                <input
                  type="text"
                  required
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                  placeholder="VD: 20/10/2026"
                />
              </div>

              {/* Dynamic Form based on Category */}
              {addLogCategory === 'watering' && (
                <div className="space-y-3 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/60 text-xs">
                  <div>
                    <label className="font-bold text-blue-900 block mb-1">Phương pháp tưới</label>
                    <input
                      type="text"
                      value={waterMethod}
                      onChange={(e) => setWaterMethod(e.target.value)}
                      className="w-full p-2 rounded-xl border border-blue-300 bg-white font-medium"
                      placeholder="VD: Tưới nhỏ giọt quanh tán, tưới phun sương..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-blue-900 block mb-1">Lượng nước / cây</label>
                      <input
                        type="text"
                        value={waterAmount}
                        onChange={(e) => setWaterAmount(e.target.value)}
                        className="w-full p-2 rounded-xl border border-blue-300 bg-white font-medium"
                        placeholder="VD: 40 lít/gốc"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-blue-900 block mb-1">Nguồn nước</label>
                      <input
                        type="text"
                        value={waterSource}
                        onChange={(e) => setWaterSource(e.target.value)}
                        className="w-full p-2 rounded-xl border border-blue-300 bg-white font-medium"
                        placeholder="VD: Nước giếng sâu, nước hồ Cấm Sơn"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-blue-900 block mb-1">Ghi chú độ ẩm &amp; kỹ thuật</label>
                    <input
                      type="text"
                      value={waterNote}
                      onChange={(e) => setWaterNote(e.target.value)}
                      className="w-full p-2 rounded-xl border border-blue-300 bg-white font-medium"
                    />
                  </div>
                </div>
              )}

              {addLogCategory === 'fertilizing' && (
                <div className="space-y-3 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 text-xs">
                  <div>
                    <label className="font-bold text-emerald-900 block mb-1">Tên phân bón</label>
                    <input
                      type="text"
                      value={fertilizerName}
                      onChange={(e) => setFertilizerName(e.target.value)}
                      className="w-full p-2 rounded-xl border border-emerald-300 bg-white font-medium"
                      placeholder="VD: Phân hữu cơ trùn quế Quế Lâm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-emerald-900 block mb-1">Liều lượng bón</label>
                      <input
                        type="text"
                        value={fertilizerDosage}
                        onChange={(e) => setFertilizerDosage(e.target.value)}
                        className="w-full p-2 rounded-xl border border-emerald-300 bg-white font-medium"
                        placeholder="VD: 3.5 kg/gốc"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-emerald-900 block mb-1">Giai đoạn sinh trưởng</label>
                      <input
                        type="text"
                        value={fertilizerStage}
                        onChange={(e) => setFertilizerStage(e.target.value)}
                        className="w-full p-2 rounded-xl border border-emerald-300 bg-white font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-emerald-900 block mb-1">Kỹ thuật bón &amp; Lưu ý</label>
                    <input
                      type="text"
                      value={fertilizerNote}
                      onChange={(e) => setFertilizerNote(e.target.value)}
                      className="w-full p-2 rounded-xl border border-emerald-300 bg-white font-medium"
                    />
                  </div>
                </div>
              )}

              {addLogCategory === 'pest' && (
                <div className="space-y-3 p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs">
                  <div>
                    <label className="font-bold text-amber-900 block mb-1">Tên chế phẩm sinh học</label>
                    <input
                      type="text"
                      value={productUsed}
                      onChange={(e) => setProductUsed(e.target.value)}
                      className="w-full p-2 rounded-xl border border-amber-300 bg-white font-medium"
                      placeholder="VD: Dầu khoáng SK Enspray + Tỏi ớt thảo mộc"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-amber-900 block mb-1">Đối tượng phòng trừ</label>
                      <input
                        type="text"
                        value={targetPest}
                        onChange={(e) => setTargetPest(e.target.value)}
                        className="w-full p-2 rounded-xl border border-amber-300 bg-white font-medium"
                        placeholder="VD: Nhện đỏ, bọ xít non, rệp sáp"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-amber-900 block mb-1">Thời gian cách ly (ngày)</label>
                      <input
                        type="number"
                        min="7"
                        value={isolationDays}
                        onChange={(e) => setIsolationDays(Number(e.target.value))}
                        className="w-full p-2 rounded-xl border border-amber-300 bg-white font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {addLogCategory === 'general' && (
                <div className="space-y-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Tên công việc</label>
                    <input
                      type="text"
                      value={generalTitle}
                      onChange={(e) => setGeneralTitle(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium"
                      placeholder="VD: Khoanh cành hãm lộc đông, bao trái đợt 2..."
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Hướng dẫn thực hiện</label>
                    <textarea
                      rows={2}
                      value={generalInstructions}
                      onChange={(e) => setGeneralInstructions(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white font-sans text-xs"
                      placeholder="Chi tiết quy trình canh tác..."
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Vật tư cần chuẩn bị</label>
                    <input
                      type="text"
                      value={generalMaterials}
                      onChange={(e) => setGeneralMaterials(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white font-medium"
                      placeholder="Kéo cắt tỉa, bao túi, bẫy dính..."
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Lưu &amp; Đồng Bộ Lên Logs VietGAP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
