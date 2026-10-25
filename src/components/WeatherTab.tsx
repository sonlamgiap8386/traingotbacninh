import React from 'react';
import {
  CloudSun,
  Sun,
  Cloud,
  Droplets,
  Wind,
  Compass,
  AlertCircle,
  ThermometerSun,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { WEATHER_FORECAST } from '../data/mockData';

export const WeatherTab: React.FC = () => {
  const currentWeather = WEATHER_FORECAST[0];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Current Weather Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#07472c] via-[#095c39] to-[#043320] p-6 lg:p-8 text-white shadow-xl border border-emerald-800/40">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Trạm Quan Trắc Vi Khí Hậu Phường Chũ, TP. Bắc Ninh</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-1">
              Thời Tiết Nông Vụ Hôm Nay
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm">
              Cập nhật lúc 07:30 · Thích hợp cho việc bón lót phân vi sinh và thăm khám vườn đồi.
            </p>

            <div className="flex items-center gap-4 mt-5">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl lg:text-6xl font-black">27</span>
                <span className="text-2xl text-emerald-300 font-bold">°C</span>
              </div>
              <div className="border-l border-emerald-700/60 pl-4 space-y-0.5 text-xs text-emerald-100">
                <p className="font-bold text-sm text-white">{currentWeather.condition}</p>
                <p>Biên độ nhiệt: 19°C – 28°C</p>
                <p>Cảm giác như: 28°C</p>
              </div>
            </div>
          </div>

          {/* Quick microclimate indicators */}
          <div className="grid grid-cols-2 gap-3 bg-emerald-950/40 p-4 rounded-2xl border border-emerald-700/30 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-emerald-200">Độ ẩm không khí</span>
                <p className="text-base font-bold text-white">68%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-emerald-200">Gió Đông Bắc</span>
                <p className="text-base font-bold text-white">11 km/h</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-emerald-200">Chỉ số UV</span>
                <p className="text-base font-bold text-white">5 (Vừa phải)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                <ThermometerSun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-emerald-200">Lượng mưa</span>
                <p className="text-base font-bold text-white">0.0 mm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 flex items-start gap-3.5">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-bold text-sm block mb-0.5">Khuyến cáo khí tượng nông nghiệp phường Chũ, TP. Bắc Ninh tuần này:</strong>
          Đêm và sáng sớm trời se lạnh (17 - 19°C), ngày nắng ráo quang đãng. Đây là thời tiết lý tưởng để hãm lộc đông cho vải thiều và tích lũy đường brix cho cam đường Canh. Tránh tưới đẫm nước vào buổi chiều muộn để hạn chế sương ẩm gây bệnh thán thư.
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Dự Báo Thời Tiết 7 Ngày Tới Cho Vùng Cây Ăn Quả
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">phường Chũ, TP. Bắc Ninh</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {WEATHER_FORECAST.map((day, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center flex flex-col justify-between space-y-2 transition-all ${
                idx === 0
                  ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-emerald-50/40'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">{day.dayName}</span>
                <span className="text-[10px] text-slate-400 block">{day.date}</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-white shadow-2xs mx-auto flex items-center justify-center text-amber-500 my-1">
                {day.icon === 'Sun' ? (
                  <Sun className="w-5 h-5" />
                ) : day.icon === 'CloudSun' ? (
                  <CloudSun className="w-5 h-5 text-emerald-600" />
                ) : day.icon === 'Wind' ? (
                  <Wind className="w-5 h-5 text-teal-600" />
                ) : (
                  <Cloud className="w-5 h-5 text-blue-500" />
                )}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-bold">
                <span className="text-slate-900">{day.tempHigh}°</span>
                <span className="text-slate-400">{day.tempLow}°</span>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                <Droplets className="w-3 h-3 text-blue-500" />
                <span>{day.humidity}%</span>
              </div>

              <p className="text-[10px] text-emerald-800 font-medium line-clamp-2 leading-tight bg-white p-1 rounded-md border border-slate-100">
                {day.agriAdvice}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
