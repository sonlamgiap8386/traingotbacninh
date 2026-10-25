import React, { useState } from 'react';
import {
  X,
  Star,
  Flame,
  CheckCircle,
  Phone,
  QrCode,
  MapPin,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ShoppingBag,
  Navigation,
  CalendarCheck,
  Droplets,
  ExternalLink,
  Award,
  UserCheck,
  Edit3,
} from 'lucide-react';
import { ProduceItem, FarmerAccount } from '../types/agriculture';
import { GardenLocationMap } from './GardenLocationMap';
import { CultivationLogViewer } from './CultivationLogViewer';
import { FarmerProfileViewer } from './FarmerProfileViewer';

interface ProductDetailModalProps {
  product: ProduceItem | null;
  onClose: () => void;
  onAddToCart: (product: ProduceItem, qty: number) => void;
  isLoggedIn?: boolean;
  currentFarmer?: FarmerAccount;
  onOpenEdit?: (product: ProduceItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isLoggedIn = false,
  currentFarmer,
  onOpenEdit,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [modalTab, setModalTab] = useState<'info' | 'farmer' | 'map' | 'logs'>('info');

  if (!product) return null;

  const isMyProduct = Boolean(
    isLoggedIn &&
      currentFarmer &&
      (product.farmer.toLowerCase().includes(currentFarmer.name.toLowerCase()) ||
        product.vietgapCode === currentFarmer.pucCode)
  );

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                Nông sản chính ngạch Phường Chũ, TP. Bắc Ninh
              </span>
              <span className="text-[11px] text-slate-500">
                Mã vùng trồng: {product.vietgapCode} · Chủ hộ: {product.farmerProfile?.name || product.farmer}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMyProduct && onOpenEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEdit(product);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer border border-amber-500"
              >
                <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Sửa bài đăng & Đổi giá</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Main Navigation Tabs in Modal */}
        <div className="px-5 pt-3 border-b border-slate-100 flex items-center gap-2 bg-white overflow-x-auto">
          <button
            onClick={() => setModalTab('info')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              modalTab === 'info'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Thông tin & Đặt mua</span>
          </button>

          <button
            onClick={() => setModalTab('farmer')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              modalTab === 'farmer'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Thông tin chủ vườn & Chứng nhận</span>
          </button>

          <button
            onClick={() => setModalTab('map')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              modalTab === 'map'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Vị trí vườn Google Maps</span>
          </button>

          <button
            onClick={() => setModalTab('logs')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              modalTab === 'logs'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>Lịch canh tác (Tưới, Bón, BVTV)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* TAB 1: PRODUCT INFO */}
          {modalTab === 'info' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Product Hero Image */}
              <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden bg-slate-100 shadow-xs">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {product.certifications.map((c) => (
                    <span
                      key={c}
                      className="text-xs font-black px-3 py-1 rounded-full bg-emerald-600 text-white shadow"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                {product.sweetnessBrix && (
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 shadow">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Độ ngọt tự nhiên: {product.sweetnessBrix}° Brix</span>
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {product.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1.5">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-500 mr-1" />
                    {product.rating} ({product.reviewCount} đánh giá)
                  </span>
                  <span>·</span>
                  <span className="text-emerald-700 font-bold">
                    Còn {product.inStock} {product.unit} sẵn sàng thu hái
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-semibold">
                    Giá thu mua / Bán lẻ trực tiếp tại vườn:
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-800">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-sm font-bold text-slate-500">/{product.unit}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500">Thời vụ thu hoạch:</span>
                  <p className="text-xs font-bold text-slate-800">{product.harvestSeason}</p>
                </div>
              </div>

              {/* Quick Jump Action Cards (3 cards: Farmer profile, Google Map, Cultivation Logs) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setModalTab('farmer')}
                  className="p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-emerald-950">
                        Thông tin chủ vườn
                      </p>
                      <p className="text-[10px] text-emerald-700 font-medium truncate max-w-[120px]">
                        Chứng nhận VietGAP, GlobalGAP
                      </p>
                    </div>
                  </div>
                  <Award className="w-4 h-4 text-emerald-600" />
                </button>

                <button
                  onClick={() => setModalTab('map')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                        Vị trí Google Map
                      </p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {product.location.commune}
                      </p>
                    </div>
                  </div>
                  <Navigation className="w-4 h-4 text-emerald-600" />
                </button>

                <button
                  onClick={() => setModalTab('logs')}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 group-hover:text-blue-700">
                        Lịch canh tác
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Tưới, bón & cách ly PHI
                      </p>
                    </div>
                  </div>
                  <CalendarCheck className="w-4 h-4 text-blue-600" />
                </button>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Đặc điểm phẩm chất & thổ nhưỡng:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {product.description}
                </p>
              </div>

              {/* Farmer Profile Card in info */}
              {product.farmerProfile && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Đại diện nhà vườn:
                    </h4>
                    <button
                      onClick={() => setModalTab('farmer')}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>Xem đầy đủ chứng chỉ & hồ sơ</span>
                      <Award className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.farmerProfile.avatar}
                        alt={product.farmerProfile.name}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500"
                      />
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 text-sm">
                          {product.farmerProfile.name}
                        </p>
                        <p className="text-slate-600 text-[11px]">{product.farmerProfile.role}</p>
                        <p className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{product.farmerProfile.certificates.length} Chứng nhận an toàn</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-center shrink-0">
                      <QrCode className="w-8 h-8 text-emerald-800 mx-auto" />
                      <span className="text-[9px] text-slate-500 font-bold mt-0.5 block">QR VietGAP</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={`tel:${product.farmerProfile.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hotline: {product.farmerProfile.phone}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FARMER PROFILE & CERTIFICATES */}
          {modalTab === 'farmer' && product.farmerProfile && (
            <div className="animate-in fade-in duration-150">
              <FarmerProfileViewer
                farmer={product.farmerProfile}
                produceName={product.name}
              />
            </div>
          )}

          {/* TAB 3: GOOGLE MAPS LOCATION */}
          {modalTab === 'map' && (
            <div className="animate-in fade-in duration-150">
              <GardenLocationMap
                location={product.location}
                farmerName={product.farmerProfile?.name || product.farmer}
                produceName={product.name}
              />
            </div>
          )}

          {/* TAB 4: CULTIVATION LOGS (WATERING, FERTILIZING, PEST SPRAYING) */}
          {modalTab === 'logs' && (
            <div className="animate-in fade-in duration-150">
              <CultivationLogViewer
                logs={product.cultivationLog}
                vietgapCode={product.vietgapCode}
              />
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Checkout Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-black text-slate-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-400">{product.unit}</span>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              Thêm vào đơn hàng ({(product.price * quantity).toLocaleString('vi-VN')}đ)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
