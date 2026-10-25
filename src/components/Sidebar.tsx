import React from 'react';
import {
  Home,
  MapPin,
  CloudSun,
  CalendarDays,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react';
import { ActiveTab } from '../types/agriculture';
import { LycheeLogo } from './LycheeLogo';
import { FruitLogo } from './FruitLogo';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  cartCount,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string; emoji: string }[] = [
    { id: 'overview', label: 'Tổng quan', icon: <Home className="w-5 h-5" />, emoji: '🏡' },
    { id: 'garden_map', label: 'Vị trí khu vườn', icon: <MapPin className="w-5 h-5" />, emoji: '🗺️' },
    { id: 'weather', label: 'Thời tiết', icon: <CloudSun className="w-5 h-5" />, emoji: '☀️' },
    { id: 'calendar', label: 'Lịch canh tác', icon: <CalendarDays className="w-5 h-5" />, emoji: '📅' },
    {
      id: 'market',
      label: 'Sạp trái cây',
      icon: <ShoppingBag className="w-5 h-5" />,
      emoji: '🍊',
      badge: cartCount > 0 ? `${cartCount}` : undefined,
    },
    { id: 'community', label: 'Cộng đồng', icon: <Users className="w-5 h-5" />, emoji: '👨‍🌾' },
    {
      id: 'assistant',
      label: 'Trợ lý & Chuyên gia',
      icon: <FruitLogo fruit="orange" className="text-xl" />,
      emoji: '🍊',
      badge: 'AI',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl border-r border-emerald-950/60 font-['Times_New_Roman',Times,serif] sidebar-texture text-white`}
      >
        {/* Top Header & Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto px-4 pt-5 pb-3">

          {/* Logo Brand Header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-emerald-800/30">
            <div className="flex items-center gap-3">
              {/* Logo Icon */}
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400/30 to-emerald-600/20 flex items-center justify-center ring-1 ring-emerald-400/40 shadow-lg">
                <LycheeLogo className="text-2xl" />
                {/* Live dot */}
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#063322] animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-wide block leading-tight">
                  Trái ngọt Bắc Ninh
                </span>
                <span className="text-[11px] text-emerald-300/80 font-medium flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  phường Chũ, Bắc Ninh
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-left cursor-pointer group ${
                    isActive
                      ? 'sidebar-nav-active text-white font-bold'
                      : 'text-emerald-100/75 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'bg-emerald-900/30 text-emerald-400 group-hover:bg-emerald-800/40 group-hover:text-emerald-200'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="leading-tight">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                        item.badge === 'AI'
                          ? isActive
                            ? 'bg-white text-emerald-700'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-400 text-slate-900 animate-badge-bounce'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </aside>
    </>
  );
};
