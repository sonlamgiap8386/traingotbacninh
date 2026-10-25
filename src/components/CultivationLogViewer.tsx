import React, { useState } from 'react';
import {
  Droplets,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  FileCheck,
} from 'lucide-react';
import { WateringLog, FertilizingLog, PestProtectionLog } from '../types/agriculture';
import { LycheeLogo } from './LycheeLogo';

interface CultivationLogViewerProps {
  logs: {
    watering: WateringLog[];
    fertilizing: FertilizingLog[];
    pestProtection: PestProtectionLog[];
  };
  vietgapCode: string;
}

export const CultivationLogViewer: React.FC<CultivationLogViewerProps> = ({
  logs,
  vietgapCode,
}) => {
  const [activeLogTab, setActiveLogTab] = useState<'watering' | 'fertilizing' | 'pest'>(
    'watering'
  );

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveLogTab('watering')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeLogTab === 'watering'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Lịch tưới nước ({logs.watering.length})</span>
          </button>

          <button
            onClick={() => setActiveLogTab('fertilizing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeLogTab === 'fertilizing'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LycheeLogo className="text-sm" />
            <span>Lịch bón phân ({logs.fertilizing.length})</span>
          </button>

          <button
            onClick={() => setActiveLogTab('pest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeLogTab === 'pest'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Phun thuốc BVTV & Cách ly ({logs.pestProtection.length})</span>
          </button>
        </div>

        <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mã VietGAP: {vietgapCode}</span>
        </div>
      </div>

      {/* 1. WATERING TAB */}
      {activeLogTab === 'watering' && (
        <div className="space-y-2.5 animate-in fade-in duration-150">
          <p className="text-xs text-slate-500 mb-2">
            Nhật ký kiểm soát độ ẩm đất và chu kỳ tưới tiêu tự động:
          </p>
          {logs.watering.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/60 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Ngày tưới: {item.date}
                </span>
                <span className="font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-md border border-blue-200 shadow-2xs">
                  {item.amountLiters}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-0.5">
                <p>
                  <strong>Hệ thống:</strong> {item.method}
                </p>
                <p>
                  <strong>Nguồn nước:</strong> {item.waterSource}
                </p>
              </div>

              <p className="text-[11px] text-slate-500 bg-white/70 p-2 rounded-xl border border-blue-100">
                📝 <em>Ghi chú:</em> {item.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 2. FERTILIZING TAB */}
      {activeLogTab === 'fertilizing' && (
        <div className="space-y-2.5 animate-in fade-in duration-150">
          <p className="text-xs text-slate-500 mb-2">
            Nhật ký dinh dưỡng cây trồng theo từng giai đoạn phát triển sinh học:
          </p>
          {logs.fertilizing.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    {item.date}
                  </span>
                  {item.organicCertified && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      100% Hữu cơ sinh học
                    </span>
                  )}
                </div>
                <span className="font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                  Liều lượng: {item.dosage}
                </span>
              </div>

              <div className="pt-0.5">
                <p className="font-bold text-sm text-slate-900">{item.fertilizerName}</p>
                <p className="text-slate-600 text-xs mt-0.5">
                  <strong>Giai đoạn vụ:</strong> {item.stage}
                </p>
              </div>

              <p className="text-[11px] text-slate-500 bg-white/70 p-2 rounded-xl border border-emerald-100">
                📝 <em>Mục đích & Kỹ thuật:</em> {item.note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 3. PEST PROTECTION & PRE-HARVEST INTERVAL TAB */}
      {activeLogTab === 'pest' && (
        <div className="space-y-2.5 animate-in fade-in duration-150">
          {/* Safety Guarantee Notice */}
          <div className="p-3 rounded-2xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <strong className="block font-bold">Cam kết an toàn tuyệt đối VietGAP:</strong>
              100% diện tích sử dụng chế phẩm sinh học & dầu khoáng thảo mộc, đã hoàn thành thời gian cách ly (PHI) tối thiểu trước khi thu hoạch, dư lượng BVTV = 0.
            </div>
          </div>

          {logs.pestProtection.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs space-y-2"
            >
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  Ngày xử lý: {item.date}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {item.status}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-800">
                    Cách ly: {item.isolationDaysBeforeHarvest} ngày
                  </span>
                </div>
              </div>

              <div>
                <p className="font-bold text-sm text-slate-900">{item.productUsed}</p>
                <p className="text-slate-600 text-xs mt-0.5">
                  <strong>Đối tượng phòng trừ:</strong> {item.targetPest}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-amber-200/50">
                <span>Loại chế phẩm: <strong>{item.isBiological ? 'Sinh học vi sinh' : 'Khoáng thiên nhiên'}</strong></span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã kiểm định không tồn dư hóa chất
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
