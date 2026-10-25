import React, { useState } from 'react';
import {
  X,
  Upload,
  Camera,
  ShoppingBag,
  Flame,
  CheckCircle2,
  DollarSign,
  Layers,
  MapPin,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProduceItem, FarmerAccount } from '../types/agriculture';
import { publicAssetUrl } from '../utils/assetUrl';

interface AddProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFarmer: FarmerAccount;
  onAddProduce: (newProduce: ProduceItem) => void;
}

export const AddProduceModal: React.FC<AddProduceModalProps> = ({
  isOpen,
  onClose,
  currentFarmer,
  onAddProduce,
}) => {
  const sampleFruitImages: Array<{ label: string; src: string; category: ProduceItem['category'] }> = [
    { label: 'Vải thiều Chũ', src: publicAssetUrl('assets/aistudio/vai_thieu_chu_1791794876673_8ae22a2e.jpg'), category: 'lychee' },
    { label: 'Cam Canh', src: publicAssetUrl('assets/aistudio/cam_duong_canh_1791794891255_d0cb0660.jpg'), category: 'orange' },
    { label: 'Bưởi Diễn', src: publicAssetUrl('assets/aistudio/buoi_dien_chu_1791794953100_e11caabd.jpg'), category: 'pomelo' },
    { label: 'Táo xuân', src: publicAssetUrl('assets/aistudio/tao_xuan_dailoan_1791794902514_30247698.jpg'), category: 'apple' },
    { label: 'Ổi lê Chũ', src: publicAssetUrl('assets/aistudio/oi_le_chu_1791794939350_2428c961.jpg'), category: 'guava' },
  ];

  const [name, setName] = useState<string>('Vải thiều Chũ - Vườn ' + currentFarmer.name);
  const [category, setCategory] = useState<'lychee' | 'orange' | 'pomelo' | 'guava' | 'apple' | 'other'>('lychee');
  const [price, setPrice] = useState<number>(65000);
  const [unit, setUnit] = useState<string>('kg');
  const [inStock, setInStock] = useState<number>(1200);
  const [sweetnessBrix, setSweetnessBrix] = useState<number>(21.5);
  const [harvestSeason, setHarvestSeason] = useState<string>('Tháng 5 - Tháng 7 hàng năm');
  const [selectedImage, setSelectedImage] = useState<string>(sampleFruitImages[0].src);
  const [description, setDescription] = useState<string>(
    'Trái cây thu hái trực tiếp từ vườn đồi phường Chũ, TP. Bắc Ninh của gia đình, cùi dày mọng nước, vị ngọt đậm thơm mát, đạt chuẩn an toàn VietGAP.'
  );
  const [certifications, setCertifications] = useState<('VietGAP' | 'GlobalGAP' | 'OCOP 4 sao' | 'OCOP 5 sao' | 'Hữu cơ')[]>([
    'VietGAP',
    'OCOP 4 sao',
  ]);
  if (!isOpen) return null;

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCertification = (cert: 'VietGAP' | 'GlobalGAP' | 'OCOP 4 sao' | 'OCOP 5 sao' | 'Hữu cơ') => {
    if (certifications.includes(cert)) {
      setCertifications(certifications.filter((c) => c !== cert));
    } else {
      setCertifications([...certifications, cert]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduce: ProduceItem = {
      id: `prod-custom-${Date.now()}`,
      name: name.trim(),
      category,
      price: Number(price),
      unit,
      origin: currentFarmer.location,
      farmer: `${currentFarmer.name} (${currentFarmer.role})`,
      farmerPhone: currentFarmer.phone,
      rating: 5.0,
      reviewCount: 1,
      inStock: Number(inStock),
      image: selectedImage,
      certifications,
      harvestSeason,
      sweetnessBrix: Number(sweetnessBrix),
      description,
      featured: true,
      vietgapCode: currentFarmer.pucCode,
      farmerProfile: {
        name: currentFarmer.name,
        avatar: currentFarmer.avatar,
        role: currentFarmer.role,
        phone: currentFarmer.phone,
        zalo: currentFarmer.phone.replace(/\s+/g, ''),
        address: currentFarmer.location,
        experienceYears: 18,
        orchardAreaHa: currentFarmer.areaHa,
        treeCount: currentFarmer.treeCount,
        bio: `Chủ nhà vườn canh tác tại ${currentFarmer.location}. Tiên phong áp dụng tiến bộ khoa học kỹ thuật và tiêu chuẩn an toàn thực phẩm.`,
        achievements: ['Nhà vườn tiêu biểu phường Chũ, TP. Bắc Ninh', 'Chứng nhận sản phẩm sạch OCOP'],
        commitment: 'Trái cây sạch 100%, thu hái đúng ngày xuất bán, không sử dụng hóa chất cấm.',
        certificates: [
          {
            id: `cert-${Date.now()}`,
            type: 'VietGAP',
            title: 'Giấy Chứng Nhận Tiêu Chuẩn VietGAP',
            certificateNumber: currentFarmer.pucCode,
            issuedBy: 'Chi cục Trồng trọt và Bảo vệ Thực vật TP. Bắc Ninh',
            issuedDate: '01/01/2026',
            expiryDate: '01/01/2029',
            scope: `Canh tác và phân phối ${name}`,
            standardDetails: 'TCVN 11892-1:2017',
            verified: true,
          },
        ],
      },
      location: {
        lat: 21.3653,
        lng: 106.5925,
        address: currentFarmer.location,
        commune: currentFarmer.commune,
        altitudeM: 95,
        soilType: 'Đất feralit sỏi son đồi dốc',
        waterSource: 'Nước nguồn tự nhiên qua lọc vi sinh',
      },
      cultivationLog: {
        watering: [
          {
            date: 'Hôm qua',
            method: 'Tưới nhỏ giọt Isreal tự động',
            amountLiters: '40 lít/gốc',
            waterSource: 'Nước sạch kiểm nghiệm an toàn',
            note: 'Duy trì độ ẩm nuôi quả ngọt',
          },
        ],
        fertilizing: [
          {
            date: '10 ngày trước',
            fertilizerName: 'Phân hữu cơ sinh học Quế Lâm + Kali hữu cơ',
            dosage: '3.5 kg/gốc',
            stage: 'Tích lũy đường brix',
            organicCertified: true,
            note: 'Tăng độ ngọt đậm tự nhiên',
          },
        ],
        pestProtection: [
          {
            date: '35 ngày trước',
            productUsed: 'Chế phẩm thảo dược sinh học Neem + Dầu khoáng SK',
            targetPest: 'Ruồi đục quả và rệp sáp',
            isBiological: true,
            isolationDaysBeforeHarvest: 35,
            status: 'Đã hoàn thành cách ly',
            safetyVerified: true,
          },
        ],
      },
    };

    onAddProduce(newProduce);

    // Celebration confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#047857', '#10b981', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in font-['Times_New_Roman',Times,serif]">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                Đăng Bán Trái Cây Lên Sạp Nông Sản
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Chủ vườn: <strong>{currentFarmer.name}</strong> ({currentFarmer.shortLocation})
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1 text-xs">
          {/* 1. Image selection */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-bold">1. Ảnh chụp trái cây thực tế:</label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-200 shrink-0 ring-2 ring-emerald-600 shadow-xs">
                <img
                  src={selectedImage}
                  alt="Ảnh trái cây đã chọn"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1">
                <p className="text-slate-600 text-[11px]">
                  Chọn ảnh mẫu có sẵn hoặc tải ảnh chụp từ vườn của bác:
                </p>

                {/* Pre-made photos */}
                <div className="flex flex-wrap gap-1.5">
                  {sampleFruitImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedImage(img.src);
                        setCategory(img.category);
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                        selectedImage === img.src
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-[11px] cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Tải ảnh mới từ máy</span>
                  <input type="file" accept="image/*" onChange={handleCustomImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* 2. Basic info */}
          <div className="space-y-3 pt-1">
            <label className="block text-slate-700 font-bold">2. Thông tin thương phẩm:</label>

            <div>
              <label className="block text-slate-600 mb-1">Tên loại trái cây đăng bán *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Vải thiều Chũ chính gốc phường Chũ, TP. Bắc Ninh (Loại 1)"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:outline-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">Giá bán niêm yết (VNĐ) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-emerald-800 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Đơn vị tính</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:outline-emerald-600"
                >
                  <option value="kg">kg (Kilogram)</option>
                  <option value="quả">quả (Trái)</option>
                  <option value="thùng 10kg">thùng (10kg)</option>
                  <option value="sọt 50kg">sọt (50kg)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Sản lượng sẵn sàng xuất</label>
                <input
                  type="number"
                  value={inStock}
                  onChange={(e) => setInStock(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Độ ngọt tự nhiên (° Brix)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={sweetnessBrix}
                  onChange={(e) => setSweetnessBrix(parseFloat(e.target.value) || 12)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Thời vụ thu hoạch</label>
                <input
                  type="text"
                  value={harvestSeason}
                  onChange={(e) => setHarvestSeason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:outline-emerald-600"
                />
              </div>
            </div>

            {/* Certifications checkboxes */}
            <div>
              <label className="block text-slate-600 mb-1.5 font-bold">Chứng nhận đạt chuẩn:</label>
              <div className="flex flex-wrap gap-2">
                {(['VietGAP', 'GlobalGAP', 'OCOP 4 sao', 'OCOP 5 sao', 'Hữu cơ'] as const).map((cert) => (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => toggleCertification(cert)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      certifications.includes(cert)
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {certifications.includes(cert) ? '✓ ' : '+ '} {cert}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-600 mb-1">Mô tả đặc điểm phẩm chất</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:outline-emerald-600"
              />
            </div>

            {/* Farmer provenance preview */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-700 space-y-1">
              <p>
                <strong>Nhà vườn bán:</strong> {currentFarmer.name} ({currentFarmer.phone})
              </p>
              <p className="flex items-center gap-1 text-emerald-800 font-bold">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Vị trí ghim Google Map: {currentFarmer.location}</span>
              </p>
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
              <ShoppingBag className="w-4 h-4" />
              <span>Đăng bán ngay lên Sạp trái cây</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
