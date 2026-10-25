import React, { useState } from 'react';
import {
  X,
  MapPin,
  Camera,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  Mountain,
  Droplet,
  Layers,
  Award,
  Upload,
} from 'lucide-react';
import { FarmerAccount } from '../types/agriculture';
import { publicAssetUrl } from '../utils/assetUrl';

interface OrchardDeclarationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFarmer: FarmerAccount;
  onSaveFarmer: (updatedFarmer: FarmerAccount) => void;
}

export const OrchardDeclarationModal: React.FC<OrchardDeclarationModalProps> = ({
  isOpen,
  onClose,
  currentFarmer,
  onSaveFarmer,
}) => {
  const [formData, setFormData] = useState({
    name: currentFarmer.name,
    role: currentFarmer.role,
    phone: currentFarmer.phone,
    location: currentFarmer.location,
    shortLocation: currentFarmer.shortLocation,
    commune: currentFarmer.commune,
    areaHa: currentFarmer.areaHa,
    treeCount: currentFarmer.treeCount,
    cropFocus: currentFarmer.cropFocus,
    pucCode: currentFarmer.pucCode,
    certification: currentFarmer.certification,
    avatar: currentFarmer.avatar,
    // Orchard details
    altitudeM: 95,
    soilType: 'Đất feralit đỏ vàng sỏi son đồi dốc',
    waterSource: 'Nước nguồn hồ Cấm Sơn qua bể lọc vi sinh',
    lat: 21.3653,
    lng: 106.5925,
    bio: 'Nhà vườn chuyên canh cây ăn quả theo quy trình hữu cơ vi sinh VietGAP.',
    commitment: '100% không dùng thuốc diệt cỏ hóa học, thời gian cách ly PHI nghiêm ngặt trước thu hoạch.',
  });

  const [previewAvatar, setPreviewAvatar] = useState<string>(currentFarmer.avatar);
  const [orchardPhoto, setOrchardPhoto] = useState<string>(
    publicAssetUrl('assets/aistudio/vai_thieu_chu_1791794876673_8ae22a2e.jpg')
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') return;
        setPreviewAvatar(reader.result);
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setOrchardPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FarmerAccount = {
      ...currentFarmer,
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      location: formData.location,
      shortLocation: formData.shortLocation,
      commune: formData.commune,
      areaHa: Number(formData.areaHa),
      treeCount: Number(formData.treeCount),
      cropFocus: formData.cropFocus,
      pucCode: formData.pucCode,
      certification: formData.certification,
      avatar: previewAvatar,
    };

    onSaveFarmer(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in font-['Times_New_Roman',Times,serif]">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                Khai Báo Thông Tin Khu Vườn & Vị Trí Canh Tác
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Cập nhật hồ sơ nhà vườn, tọa độ bản đồ Google Maps và tiêu chuẩn chất lượng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1 text-xs">
          {isSaved && (
            <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>Đã lưu thành công thông tin khu vườn của chủ hộ {formData.name}!</span>
            </div>
          )}

          {/* 1. Photos Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Avatar upload */}
            <div>
              <label className="block text-slate-700 font-bold mb-2">Ảnh chân dung chủ vườn:</label>
              <div className="flex items-center gap-3">
                <img
                  src={previewAvatar}
                  alt="Chân dung chủ vườn"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-xs"
                />
                <label className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Đổi ảnh</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Orchard photo upload */}
            <div>
              <label className="block text-slate-700 font-bold mb-2">Ảnh chụp khu vườn thực tế:</label>
              <div className="flex items-center gap-3">
                <img
                  src={orchardPhoto}
                  alt="Ảnh vườn thực tế"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-xs"
                />
                <label className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>Tải ảnh vườn</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* 2. Personal & Location Information */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>1. Định Danh & Vị Trí Khu Vườn</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Họ và tên chủ hộ *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Số điện thoại liên hệ *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Vị trí khu vườn chi tiết (Thôn - TDP - Phường tại TP. Bắc Ninh) *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ví dụ: Thôn Kép 1 - Phường Chũ, TP. Bắc Ninh"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tọa độ Vĩ độ (Latitude)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 21.3653 })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Tọa độ Kinh độ (Longitude)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 106.5925 })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* 3. Orchard Scale & Crops */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>2. Quy Mô Vườn & Cây Trồng Chủ Lực</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Diện tích vườn (Hecta) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.areaHa}
                  onChange={(e) => setFormData({ ...formData, areaHa: parseFloat(e.target.value) || 1 })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Số lượng gốc cây</label>
                <input
                  type="number"
                  value={formData.treeCount}
                  onChange={(e) => setFormData({ ...formData, treeCount: parseInt(e.target.value) || 100 })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mã vùng trồng (PUC)</label>
                <input
                  type="text"
                  value={formData.pucCode}
                  onChange={(e) => setFormData({ ...formData, pucCode: e.target.value })}
                  placeholder="VN-BG-CHU-..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono font-bold focus:outline-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Cây trồng chủ lực *</label>
              <input
                type="text"
                required
                value={formData.cropFocus}
                onChange={(e) => setFormData({ ...formData, cropFocus: e.target.value })}
                placeholder="Ví dụ: Vải thiều Chũ, Cam đường Canh, Bưởi Diễn..."
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tiêu chuẩn chứng nhận</label>
                <select
                  value={formData.certification}
                  onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
                >
                  <option value="VietGAP & GlobalGAP">VietGAP & GlobalGAP</option>
                  <option value="VietGAP & OCOP 4 sao">VietGAP & OCOP 4 sao</option>
                  <option value="VietGAP & OCOP 5 sao">VietGAP & OCOP 5 sao</option>
                  <option value="Hữu cơ & VietGAP">Hữu cơ sinh học & VietGAP</option>
                  <option value="Đang chuyển đổi VietGAP">Đang chuyển đổi VietGAP</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Độ cao địa hình (mét)</label>
                <input
                  type="number"
                  value={formData.altitudeM}
                  onChange={(e) => setFormData({ ...formData, altitudeM: parseInt(e.target.value) || 90 })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Nguồn nước tưới</label>
              <input
                type="text"
                value={formData.waterSource}
                onChange={(e) => setFormData({ ...formData, waterSource: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-2xl flex items-center justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thông tin khu vườn</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
