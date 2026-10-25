import React from 'react';
import {
  X,
  UserCheck,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  LogOut,
} from 'lucide-react';
import { FARMER_ACCOUNTS } from '../data/mockData';
import { FarmerAccount } from '../types/agriculture';
import { LycheeLogo } from './LycheeLogo';

interface QuickLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFarmer: FarmerAccount;
  onSelectFarmer: (farmer: FarmerAccount) => void;
  isLoggedIn?: boolean;
}

export const QuickLoginModal: React.FC<QuickLoginModalProps> = ({
  isOpen,
  onClose,
  currentFarmer,
  onSelectFarmer,
  isLoggedIn = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col font-['Times_New_Roman',Times,serif]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                Đăng Nhập Tài Khoản Nhà Vườn
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                5 chủ vườn tiêu biểu thuộc phường Chũ, TP. Bắc Ninh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account List */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-3.5 flex-1">
          <p className="text-xs text-slate-600 font-semibold mb-1">
            {isLoggedIn
              ? 'Bấm "Đăng nhập ngay" để chuyển đổi tài khoản quản lý sang chủ hộ khác:'
              : 'Chọn 1 trong 5 nhà vườn phường Chũ dưới đây để đăng nhập vào trang quản lý trang trại:'}
          </p>

          {FARMER_ACCOUNTS.map((farmer) => {
            const isCurrent = isLoggedIn && farmer.id === currentFarmer.id;
            return (
              <div
                key={farmer.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 ${
                  isCurrent
                    ? 'bg-emerald-50/80 border-emerald-400 shadow-xs ring-1 ring-emerald-300'
                    : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:bg-slate-50/60'
                }`}
              >
                {/* Farmer Left Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={farmer.avatar}
                      alt={farmer.name}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-xs"
                    />
                    {isCurrent && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-600 rounded-full p-0.5 ring-2 ring-white">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-slate-900">{farmer.name}</h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          Đang hoạt động
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {farmer.certification}
                      </span>
                    </div>

                    {/* Exact user-requested location */}
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-800">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{farmer.location}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate">{farmer.role}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-0.5">
                      <span className="flex items-center gap-1">
                        <LycheeLogo className="text-xs" />
                        <strong>Cây chủ lực:</strong> {farmer.cropFocus}
                      </span>
                      <span>·</span>
                      <span><strong>Quy mô:</strong> {farmer.areaHa} ha ({farmer.treeCount} gốc)</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="shrink-0 w-full sm:w-auto text-right">
                  {isCurrent ? (
                    <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Tài khoản hiện tại</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onSelectFarmer(farmer);
                        onClose();
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs hover:scale-[1.02] cursor-pointer"
                    >
                      <span>Đăng nhập ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Hệ thống Trái ngọt Bắc Ninh</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
