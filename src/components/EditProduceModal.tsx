import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  DollarSign,
  TrendingUp,
  Tag,
  Layers,
  Award,
  CheckCircle2,
  Image as ImageIcon,
  AlertCircle,
  Package,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProduceItem, FarmerAccount } from '../types/agriculture';
import { FruitLogo } from './FruitLogo';
import { publicAssetUrl } from '../utils/assetUrl';

interface EditProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProduceItem | null;
  onSave: (updatedProduct: ProduceItem) => void;
  currentFarmer?: FarmerAccount;
}

export const EditProduceModal: React.FC<EditProduceModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
  currentFarmer,
}) => {
  const sampleFruitImages = [
    { label: 'Vải thiều Chũ', src: publicAssetUrl('assets/aistudio/vai_thieu_chu_1791794876673_8ae22a2e.jpg') },
    { label: 'Cam đường Canh', src: publicAssetUrl('assets/aistudio/cam_duong_canh_1791794891255_d0cb0660.jpg') },
    { label: 'Bưởi Diễn', src: publicAssetUrl('assets/aistudio/buoi_dien_chu_1791794953100_e11caabd.jpg') },
    { label: 'Táo xuân', src: publicAssetUrl('assets/aistudio/tao_xuan_dailoan_1791794902514_30247698.jpg') },
    { label: 'Ổi lê Chũ', src: publicAssetUrl('assets/aistudio/oi_le_chu_1791794939350_2428c961.jpg') },
  ];

  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [unit, setUnit] = useState<string>('kg');
  const [inStock, setInStock] = useState<number>(0);
  const [sweetnessBrix, setSweetnessBrix] = useState<number>(20);
  const [harvestSeason, setHarvestSeason] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [certifications, setCertifications] = useState<
    ('VietGAP' | 'GlobalGAP' | 'OCOP 4 sao' | 'OCOP 5 sao' | 'Hữu cơ')[]
  >([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setUnit(product.unit || 'kg');
      setInStock(product.inStock || 0);
      setSweetnessBrix(product.sweetnessBrix || 20);
      setHarvestSeason(product.harvestSeason || '');
      setDescription(product.description || '');
      setImage(product.image || '');
      setCertifications(product.certifications || ['VietGAP']);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handlePriceDelta = (delta: number) => {
    setPrice((prev) => Math.max(1000, prev + delta));
  };

  const toggleCertification = (
    cert: 'VietGAP' | 'GlobalGAP' | 'OCOP 4 sao' | 'OCOP 5 sao' | 'Hữu cơ'
  ) => {
    if (certifications.includes(cert)) {
      setCertifications(certifications.filter((c) => c !== cert));
    } else {
      setCertifications([...certifications, cert]);
    }
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: ProduceItem = {
      ...product,
      name: name.trim() || product.name,
      price: Number(price) > 0 ? Number(price) : product.price,
      unit: unit.trim() || 'kg',
      inStock: Number(inStock) >= 0 ? Number(inStock) : product.inStock,
      sweetnessBrix: Number(sweetnessBrix),
      harvestSeason: harvestSeason.trim() || product.harvestSeason,
      description: description.trim() || product.description,
      image: image || product.image,
      certifications: certifications.length > 0 ? certifications : product.certifications,
    };

    onSave(updated);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in font-['Times_New_Roman',Times,serif]">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-800 to-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center border border-white/20 shadow-xs">
              <DollarSign className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight text-white">
                Sửa Bài Đăng & Cập Nhật Giá Bán
              </h3>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Chủ vườn: {currentFarmer ? currentFarmer.name : product.farmer}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {/* Highlighted Price Adjustment Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-500/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Giá Bán Mới Cho Khách Mua (VNĐ)</span>
              </label>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Giá hiện tại trên Sạp
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full text-xl sm:text-2xl font-black text-emerald-900 px-4 py-2.5 rounded-2xl border-2 border-emerald-400 bg-white focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-300 transition-all font-mono"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  VNĐ
                </span>
              </div>

              {/* Quick Adjustment Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handlePriceDelta(-5000)}
                  className="px-2.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-emerald-300 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer active:scale-95"
                >
                  -5.000đ
                </button>
                <button
                  type="button"
                  onClick={() => handlePriceDelta(5000)}
                  className="px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs cursor-pointer active:scale-95"
                >
                  +5.000đ
                </button>
                <button
                  type="button"
                  onClick={() => handlePriceDelta(10000)}
                  className="px-2.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs cursor-pointer active:scale-95"
                >
                  +10.000đ
                </button>
              </div>
            </div>

            {/* Price Preview formatted */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-200/60">
              <span className="text-emerald-800 font-medium">Hiển thị trên Sạp:</span>
              <span className="text-base font-black text-emerald-900">
                {price.toLocaleString('vi-VN')} đ / {unit}
              </span>
            </div>
          </div>

          {/* Unit & InStock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Đơn vị tính</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="flex-1 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                  placeholder="kg, thùng 5kg, v.v."
                />
                <button
                  type="button"
                  onClick={() => setUnit('kg')}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold border ${
                    unit === 'kg' ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('thùng 5kg')}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold border ${
                    unit === 'thùng 5kg'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  thùng
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-slate-500" />
                <span>Sản lượng còn lại ({unit})</span>
              </label>
              <input
                type="number"
                min="0"
                value={inStock}
                onChange={(e) => setInStock(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                placeholder="1000"
              />
            </div>
          </div>

          {/* Title / Produce Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Tiêu đề bài đăng nông sản
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
              placeholder="VD: Vải thiều Chũ chính gốc vườn bác Nguyễn Văn An"
            />
          </div>

          {/* Sweetness Brix & Harvest Season */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <FruitLogo fruit="apple" className="text-sm" />
                <span>Độ ngọt trung bình (°Brix)</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={sweetnessBrix}
                onChange={(e) => setSweetnessBrix(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Mùa vụ / Thời gian thu hái
              </label>
              <input
                type="text"
                value={harvestSeason}
                onChange={(e) => setHarvestSeason(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                placeholder="VD: Tháng 5 - Tháng 7 hàng năm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Mô tả chi tiết & Cam kết chất lượng
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600 leading-relaxed font-sans"
              placeholder="Nhập ghi chú về quy trình hái, vận chuyển, độ tươi..."
            />
          </div>

          {/* Certifications */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chứng nhận chất lượng gắn trên bài đăng</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(['VietGAP', 'GlobalGAP', 'OCOP 4 sao', 'OCOP 5 sao', 'Hữu cơ'] as const).map(
                (cert) => {
                  const isChecked = certifications.includes(cert);
                  return (
                    <button
                      type="button"
                      key={cert}
                      onClick={() => toggleCertification(cert)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {isChecked && '✓ '}
                      {cert}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Ảnh đại diện bài đăng trái cây</span>
            </label>
            <div className="flex items-center gap-3">
              <img
                src={image || product.image}
                alt="Xem trước"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-xs shrink-0"
              />
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap gap-1.5">
                  {sampleFruitImages.map((s, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImage(s.src)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                        image === s.src
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <label className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer">
                    <span>+ Tải ảnh thực tế từ vườn</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu & Cập Nhật Giá Bán Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
