import React, { useState } from 'react';
import {
  Menu,
  ShoppingBag,
  MapPin,
  Check,
  ChevronDown,
  ShieldCheck,
  Repeat,
  FileEdit,
  ExternalLink,
  LogOut,
  Edit3,
  Leaf,
} from 'lucide-react';
import { ActiveTab, FarmerAccount } from '../types/agriculture';
import { LycheeLogo } from './LycheeLogo';

interface HeaderProps {
  onOpenSidebar: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  currentFarmer: FarmerAccount;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenQuickLogin: () => void;
  onOpenDeclareOrchard?: () => void;
  onOpenAddProduce?: () => void;
  onOpenEditProduce?: () => void;
  onSelectFarmer?: (farmer: FarmerAccount) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  currentFarmer,
  isLoggedIn,
  onLogout,
  onOpenQuickLogin,
  onOpenDeclareOrchard,
  onOpenAddProduce,
  onOpenEditProduce,
  onSelectFarmer,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'overview':
        return isLoggedIn ? `Trang Trại: ${currentFarmer.name}` : 'Mô Hình Canh Tác Nhà Vườn Chũ';
      case 'garden_map':
        return 'Vị Trí Khu Vườn & Bản Đồ 3D';
      case 'weather':
        return 'Thời Tiết & Vi Khí Hậu';
      case 'calendar':
        return 'Lịch Canh Tác Chuẩn VietGAP';
      case 'market':
        return 'Sạp Trái Cây Đặc Sản Phường Chũ';
      case 'community':
        return 'Cộng Đồng Nhà Vườn';
      case 'assistant':
        return 'Trợ Lý Canh Tác & Chẩn Đoán AI';
      default:
        return 'Trái ngọt Bắc Ninh';
    }
  };

  const getTabEmoji = (tab: ActiveTab) => {
    switch (tab) {
      case 'overview': return '🏡';
      case 'garden_map': return '🗺️';
      case 'weather': return '☀️';
      case 'calendar': return '📅';
      case 'market': return '🍊';
      case 'community': return '👨‍🌾';
      case 'assistant': return '🍊';
      default: return '🍒';
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 py-2.5 transition-all font-['Times_New_Roman',Times,serif]"
      style={{
        background: 'linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(247,253,249,0.97) 50%, rgba(255,255,255,0.97) 100%)',
        boxShadow: '0 1px 0 rgba(0,155,85,0.08), 0 4px 16px -4px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Page title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors shrink-0 cursor-pointer border border-transparent hover:border-emerald-200"
            title="Mở menu điều hướng"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            {/* Breadcrumb location */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-sm">
                {isLoggedIn ? currentFarmer.location : 'phường Chũ, TP. Bắc Ninh'}
              </span>
            </div>
            {/* Page title with emoji */}
            <h1 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 truncate leading-tight flex items-center gap-1.5">
              <span className="hidden sm:inline">{getTabEmoji(activeTab)}</span>
              {getTabTitle(activeTab)}
            </h1>
          </div>
        </div>

        {/* Right Area */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Agricultural badge — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800">
            <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-bold">VietGAP · OCOP</span>
          </div>

          {/* Cart button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
            title="Giỏ hàng nông sản"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm animate-badge-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="w-px h-7 bg-slate-200" />

          {/* Conditional: Guest Mode vs Logged-In Farmer Mode */}
          {!isLoggedIn ? (
            <button
              onClick={onOpenQuickLogin}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)' }}
              title="Đăng nhập tài khoản nhà vườn để quản lý"
            >
              <LycheeLogo className="text-base shrink-0" />
              <span className="hidden sm:inline">Đăng nhập</span>
              <span>Nhà Vườn</span>
            </button>
          ) : (
            /* Logged-In Farmer Profile Avatar & Dropdown */
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-2xl hover:bg-emerald-50 transition-all text-left cursor-pointer border border-emerald-200/70 bg-emerald-50/40 shadow-sm"
              >
                <div className="relative shrink-0">
                  <img
                    src={currentFarmer.avatar}
                    alt={currentFarmer.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover ring-2 ring-emerald-500 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 ring-2 ring-white">
                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                  </div>
                </div>

                <div className="hidden sm:block text-left max-w-[140px]">
                  <div className="flex items-center gap-1">
                    <p className="font-extrabold text-xs text-slate-900 leading-tight truncate">
                      {currentFarmer.name}
                    </p>
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-emerald-700 font-semibold leading-tight truncate">
                    {currentFarmer.shortLocation}
                  </p>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Farmer Banner */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <img
                      src={currentFarmer.avatar}
                      alt={currentFarmer.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h4 className="font-extrabold text-sm text-slate-900 truncate">{currentFarmer.name}</h4>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-emerald-700 font-bold truncate">{currentFarmer.role}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        📍 {currentFarmer.location}
                      </p>
                    </div>
                  </div>

                  {/* Technical Orchard Stats */}
                  <div className="py-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700">
                      <span className="font-medium text-slate-500">Mã vùng trồng (PUC):</span>
                      <strong className="text-emerald-800 font-mono font-bold">{currentFarmer.pucCode}</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700">
                      <span className="font-medium text-slate-500">Quy mô canh tác:</span>
                      <strong className="text-slate-900 font-bold">
                        {currentFarmer.areaHa} ha ({currentFarmer.treeCount} gốc)
                      </strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700">
                      <span className="font-medium text-slate-500">Cây trồng chủ lực:</span>
                      <strong className="text-emerald-700 truncate max-w-[150px] font-bold">
                        {currentFarmer.cropFocus}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/80 text-emerald-900">
                      <span className="font-medium text-emerald-700">Chứng nhận chất lượng:</span>
                      <strong className="font-bold">{currentFarmer.certification}</strong>
                    </div>
                  </div>

                  {/* Farmer Actions in Dropdown */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenDeclareOrchard?.();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer text-left"
                    >
                      <FileEdit className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Khai báo vị trí & Thông tin vườn</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenAddProduce?.();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer text-left border border-amber-200/60"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Đăng bán trái cây mới lên Sạp</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenEditProduce?.();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-amber-950 font-black text-xs flex items-center gap-2 transition-colors cursor-pointer text-left border border-amber-300"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                      <span>Sửa bài đăng & Cập nhật giá bán</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenQuickLogin();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer border border-emerald-200/60"
                    >
                      <span className="flex items-center gap-2">
                        <Repeat className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Mở danh sách đăng nhập nhanh</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                    </button>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer border border-rose-200/70 text-left"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Đăng xuất (Chuyển sang Khách mua)</span>
                      </span>
                      <span className="text-[10px] text-rose-700 font-semibold bg-rose-100/80 px-1.5 py-0.5 rounded">
                        Khách hàng
                      </span>
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Xác thực VietGAP Chũ - Bắc Ninh
                      </span>
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="text-slate-500 hover:text-slate-800 font-semibold text-[11px] px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
