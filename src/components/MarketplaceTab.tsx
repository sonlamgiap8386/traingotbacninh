import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Star,
  CheckCircle,
  MapPin,
  Filter,
  Plus,
  ShieldCheck,
  Search,
  Truck,
  Eye,
  Award,
  Edit3,
  Pencil,
  DollarSign,
} from 'lucide-react';
import { ProduceItem, FarmerAccount } from '../types/agriculture';
import { PRODUCE_ITEMS } from '../data/mockData';
import { FruitLogo } from './FruitLogo';

interface MarketplaceTabProps {
  onSelectProduct: (product: ProduceItem) => void;
  onAddToCart: (product: ProduceItem, qty?: number) => void;
  produceList?: ProduceItem[];
  onOpenAddProduce?: () => void;
  isLoggedIn?: boolean;
  onOpenQuickLogin?: () => void;
  currentFarmer?: FarmerAccount;
  onOpenEditProduce?: (product: ProduceItem) => void;
}

export const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
  onSelectProduct,
  onAddToCart,
  produceList,
  onOpenAddProduce,
  isLoggedIn = false,
  onOpenQuickLogin,
  currentFarmer,
  onOpenEditProduce,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCert, setSelectedCert] = useState<string>('all');

  const categories = useMemo(() => [
    { id: 'all', label: 'Tất cả nông sản' },
    ...(isLoggedIn && currentFarmer
      ? [{ id: 'my_orchard', label: `🌿 Bài đăng của tôi` }]
      : []),
    { id: 'lychee', label: 'Vải thiều Chũ' },
    { id: 'orange', label: 'Cam đường Canh' },
    { id: 'pomelo', label: 'Bưởi Diễn' },
    { id: 'guava', label: 'Ổi lê Chũ' },
    { id: 'apple', label: 'Táo xuân' },
  ], [isLoggedIn, currentFarmer]);

  const items = produceList || PRODUCE_ITEMS;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory === 'my_orchard' && currentFarmer) {
        const isMyItem =
          item.farmer.toLowerCase().includes(currentFarmer.name.toLowerCase()) ||
          item.vietgapCode === currentFarmer.pucCode;
        if (!isMyItem) return false;
      } else if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.origin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCert =
        selectedCert === 'all' ||
        item.certifications.some((c) => c.toLowerCase().includes(selectedCert.toLowerCase()));
      return matchesSearch && matchesCert;
    });
  }, [items, selectedCategory, currentFarmer, searchQuery, selectedCert]);

  return (
    <div className="space-y-6 pb-12 font-['Times_New_Roman',Times,serif] animate-fade-up">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white shadow-md border border-emerald-700/30 market-banner">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Chính Gốc Phường Chũ, TP. Bắc Ninh · OCOP &amp; VietGAP</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-200 font-medium">
                <Truck className="w-3 h-3 text-emerald-400" />
                <span>Giao tươi hái trong ngày</span>
              </span>
            </div>

            <h2 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight text-white leading-snug">
              Sạp Trái Cây Trực Tiếp Từ Vườn Đồi Phường Chũ, TP. Bắc Ninh
            </h2>

            <p className="text-emerald-100/85 text-xs line-clamp-1">
              Kết nối trực tiếp 5 khu vườn đồi chính ngạch VietGAP / GlobalGAP · Minh bạch nguồn gốc và lịch mùa vụ.
            </p>
          </div>

          {/* Right Action / CTA Button */}
          <div className="shrink-0 flex items-center gap-2 pt-1 md:pt-0">
            {isLoggedIn ? (
              <button
                onClick={onOpenAddProduce}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Đăng Bán Trái Cây Mới</span>
              </button>
            ) : (
              onOpenQuickLogin && (
                <button
                  onClick={onOpenQuickLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white font-bold text-xs border border-emerald-600/50 transition-all cursor-pointer whitespace-nowrap"
                >
                  <FruitLogo fruit="lychee" className="text-sm" />
                  <span>Chủ vườn đăng bán? <strong className="underline text-amber-300">Đăng nhập</strong></span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-3.5 orchard-pattern">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm vải thiều Chũ, cam Canh, bưởi Diễn, tên nhà vườn, thôn xóm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Quick cert filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-600 shrink-0">Chứng nhận:</span>
            <select
              value={selectedCert}
              onChange={(e) => setSelectedCert(e.target.value)}
              className="text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-emerald-500 text-slate-800"
            >
              <option value="all">Tất cả chứng nhận</option>
              <option value="VietGAP">Chuẩn VietGAP</option>
              <option value="GlobalGAP">Chuẩn GlobalGAP</option>
              <option value="OCOP">Đạt OCOP (4-5 sao)</option>
              <option value="Hữu cơ">Hữu cơ sinh học</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Produce Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-card space-y-3">
          <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
          <h3 className="font-extrabold text-slate-700 text-base">Không tìm thấy nông sản phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Hãy thử tìm với từ khóa khác hoặc bấm nút đặt lại danh mục.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setSelectedCert('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer hover:bg-emerald-700"
          >
            Xem tất cả nông sản
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((product) => {
            const isMyProduct = Boolean(
              isLoggedIn &&
                currentFarmer &&
                (product.farmer.toLowerCase().includes(currentFarmer.name.toLowerCase()) ||
                  product.vietgapCode === currentFarmer.pucCode ||
                  product.id.startsWith('prod-custom'))
            );

            return (
              <div
                key={product.id}
                className={`bg-white rounded-3xl overflow-hidden border flex flex-col group produce-card shadow-fruit hover:shadow-fruit-hover ${
                  isMyProduct
                    ? 'border-emerald-500/90 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200/90 shadow-card hover:shadow-card-hover'
                }`}
              >
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges on top */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%]">
                    {product.certifications.map((c) => {
                        const certClass = c.includes('VietGAP') ? 'badge-vietgap'
                          : c.includes('Global') ? 'badge-globalgap'
                          : c.includes('OCOP') ? 'badge-ocop'
                          : c.includes('Hữu') ? 'badge-organic'
                          : 'bg-white/95 text-emerald-900 border border-emerald-200';
                        return (
                          <span
                            key={c}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs backdrop-blur-xs ${certClass}`}
                          >
                            {c}
                          </span>
                        );
                      })}
                  </div>

                  {/* Quick Edit Button on Image for owner */}
                  {isMyProduct && onOpenEditProduce && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditProduce(product);
                      }}
                      className="absolute top-3 right-3 bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 z-10 border border-amber-500"
                      title="Sửa bài đăng & cập nhật lại giá bán trái cây"
                    >
                      <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Sửa giá</span>
                    </button>
                  )}

                  {/* Sweetness Brix */}
                  {product.sweetnessBrix && (
                    <div className="absolute bottom-3 left-3 bg-amber-500/95 text-white px-2.5 py-1 rounded-xl text-[11px] font-black shadow-xs flex items-center gap-1 backdrop-blur-xs">
                      <span>{product.sweetnessBrix}° Brix</span>
                      <span className="text-[10px] font-normal opacity-90">độ ngọt</span>
                    </div>
                  )}

                  {/* Stock Indicator */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold backdrop-blur-xs">
                    Còn: {product.inStock} {product.unit}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Owner Badge */}
                    {isMyProduct && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-[11px] font-extrabold border border-emerald-300/80">
                        <Award className="w-3 h-3 text-emerald-700" />
                        <span>Bài đăng của vườn Bác {currentFarmer?.name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{product.origin}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 leading-snug line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Chủ vườn:</span>
                      <span className="font-bold text-emerald-800 truncate">{product.farmer}</span>
                    </div>
                  </div>

                  {/* Price and Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <span className="text-lg sm:text-xl font-black text-emerald-800">
                          {product.price.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="text-xs font-bold text-slate-500"> / {product.unit}</span>
                      </div>

                      {/* If owner: Quick Update Price link */}
                      {isMyProduct && onOpenEditProduce ? (
                        <button
                          type="button"
                          onClick={() => onOpenEditProduce(product)}
                          className="text-xs font-extrabold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer border border-amber-300"
                        >
                          <Edit3 className="w-3 h-3 text-amber-700" />
                          <span>Đổi giá</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-slate-400 text-[10px]">({product.reviewCount})</span>
                        </div>
                      )}
                    </div>

                    {/* Dedicated Edit Produce Button for Owner */}
                    {isMyProduct && onOpenEditProduce && (
                      <button
                        type="button"
                        onClick={() => onOpenEditProduce(product)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:scale-[1.01] border border-amber-500"
                      >
                        <Edit3 className="w-4 h-4 stroke-[2.5]" />
                        <span>Sửa Bài Đăng & Cập Nhật Giá Bán</span>
                      </button>
                    )}

                    {/* 2 Default Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Xem Vườn & Logs</span>
                      </button>

                      <button
                        onClick={() => onAddToCart(product, 1)}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:scale-[1.02]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Thêm Vào Giỏ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
