import React, { useState } from 'react';
import {
  User,
  Phone,
  MessageSquare,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  QrCode,
  ExternalLink,
  MapPin,
  Heart,
  FileCheck,
  X,
  Eye,
} from 'lucide-react';
import { FarmerProfile, Certificate } from '../types/agriculture';

interface FarmerProfileViewerProps {
  farmer: FarmerProfile;
  produceName: string;
}

export const FarmerProfileViewer: React.FC<FarmerProfileViewerProps> = ({
  farmer,
  produceName,
}) => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <div className="space-y-5">
      {/* 1. Farmer Bio & Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06432b] to-[#042d1c] p-5 sm:p-6 text-white border border-emerald-800/50 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={farmer.avatar}
              alt={farmer.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-400/80 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 ring-2 ring-[#06432b]">
              <CheckCircle2 className="w-4 h-4 text-white stroke-[3]" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-xl font-extrabold text-white">{farmer.name}</h3>
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                Chủ hộ VietGAP chính hiệu
              </span>
            </div>

            <p className="text-xs text-emerald-200/90 font-medium mb-1">
              {farmer.role}
            </p>

            <p className="text-xs text-emerald-100/70 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{farmer.address}</span>
            </p>
          </div>

          {/* Quick contact buttons */}
          <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
            <a
              href={`tel:${farmer.phone.replace(/\s+/g, '')}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-xs transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi: {farmer.phone}</span>
            </a>

            <a
              href={`https://zalo.me/${farmer.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-300" />
              <span>Nhắn Zalo</span>
            </a>
          </div>
        </div>

        {/* 3 Key Stats of the Orchard */}
        <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-emerald-800/60 text-center">
          <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-700/30">
            <span className="text-[10px] text-emerald-300 font-medium block">Kinh nghiệm</span>
            <p className="text-base sm:text-lg font-black text-white">{farmer.experienceYears} năm</p>
          </div>
          <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-700/30">
            <span className="text-[10px] text-emerald-300 font-medium block">Quy mô vườn</span>
            <p className="text-base sm:text-lg font-black text-white">{farmer.orchardAreaHa} ha</p>
          </div>
          <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-700/30">
            <span className="text-[10px] text-emerald-300 font-medium block">Số lượng gốc</span>
            <p className="text-base sm:text-lg font-black text-white">{farmer.treeCount} cây</p>
          </div>
        </div>
      </div>

      {/* 2. Bio & Personal Commitment */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3 text-xs leading-relaxed">
        <div>
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-1">
            Tiểu sử & Câu chuyện nhà vườn:
          </h4>
          <p className="text-slate-600">{farmer.bio}</p>
        </div>

        <div className="pt-2 border-t border-slate-200/60">
          <h4 className="font-extrabold text-emerald-800 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Cam kết canh tác tử tế của chủ hộ:</span>
          </h4>
          <p className="text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200">
            &ldquo;{farmer.commitment}&rdquo;
          </p>
        </div>

        {/* Achievements list */}
        {farmer.achievements && farmer.achievements.length > 0 && (
          <div className="pt-1">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Thành tích & Danh hiệu đạt được:</span>
            </h4>
            <div className="space-y-1">
              {farmer.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Official Quality Certificates (VietGAP / GlobalGAP / OCOP) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h4 className="font-extrabold text-sm text-slate-900">
              Giấy Chứng Nhận Tiêu Chuẩn Nông Nghiệp ({farmer.certificates.length})
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            Đã thẩm định & Xác thực điện tử
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {farmer.certificates.map((cert) => (
            <div
              key={cert.id}
              className={`p-4 rounded-2xl border transition-all text-xs flex flex-col justify-between space-y-3 ${
                cert.type === 'GlobalGAP'
                  ? 'bg-blue-50/60 border-blue-200 hover:border-blue-400'
                  : cert.type === 'OCOP'
                  ? 'bg-amber-50/60 border-amber-200 hover:border-amber-400'
                  : 'bg-emerald-50/60 border-emerald-200 hover:border-emerald-400'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      cert.type === 'GlobalGAP'
                        ? 'bg-blue-600 text-white'
                        : cert.type === 'OCOP'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    Chứng nhận {cert.type}
                  </span>

                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Hợp lệ
                  </span>
                </div>

                <h5 className="font-black text-sm text-slate-900 leading-snug">
                  {cert.title}
                </h5>

                <p className="text-[11px] font-mono text-emerald-800 font-bold mt-1">
                  Mã số: {cert.certificateNumber}
                </p>

                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                  <strong>Phạm vi:</strong> {cert.scope}
                </p>

                <div className="mt-2 pt-2 border-t border-slate-200/60 space-y-0.5 text-[11px] text-slate-500">
                  <p>
                    <strong>Cơ quan cấp:</strong> {cert.issuedBy}
                  </p>
                  <p>
                    <strong>Hiệu lực:</strong> {cert.issuedDate} – {cert.expiryDate}
                  </p>
                  <p>
                    <strong>Quy chuẩn:</strong> {cert.standardDetails}
                  </p>
                </div>
              </div>

              {/* View certificate modal trigger */}
              <button
                onClick={() => setSelectedCert(cert)}
                className="w-full py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xem bản chụp chứng nhận</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Full Certificate Inspect Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-extrabold text-sm text-slate-900">
                  Hồ Sơ Chứng Nhận Điện Tử
                </h4>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Document Graphic Preview */}
            <div className="p-5 rounded-2xl bg-amber-50/40 border-2 border-amber-300 text-center space-y-3 relative overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam
                </span>
                <p className="text-[11px] text-slate-400">Độc lập - Tự do - Hạnh phúc</p>
              </div>

              <h3 className="text-base font-black text-slate-900 uppercase">
                {selectedCert.title}
              </h3>

              <div className="bg-white p-3 rounded-xl border border-amber-200 text-left text-xs space-y-1.5">
                <p>
                  <strong>Chủ cơ sở:</strong> {farmer.name}
                </p>
                <p>
                  <strong>Sản phẩm chứng nhận:</strong> {produceName}
                </p>
                <p>
                  <strong>Mã số cấp phép:</strong>{' '}
                  <span className="font-mono font-bold text-emerald-700">
                    {selectedCert.certificateNumber}
                  </span>
                </p>
                <p>
                  <strong>Đơn vị đánh giá:</strong> {selectedCert.issuedBy}
                </p>
                <p>
                  <strong>Ngày cấp:</strong> {selectedCert.issuedDate} &nbsp;|&nbsp;{' '}
                  <strong>Hết hạn:</strong> {selectedCert.expiryDate}
                </p>
                <p>
                  <strong>Tiêu chuẩn kỹ thuật:</strong> {selectedCert.standardDetails}
                </p>
              </div>

              {/* Red Seal stamp watermark */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-left text-[11px] text-slate-500">
                  <QrCode className="w-10 h-10 text-slate-800" />
                  <span className="text-[9px]">Quét xác thực</span>
                </div>

                <div className="border-2 border-red-600 text-red-600 px-3 py-1 rounded-xl text-center transform rotate-[-8deg] font-black text-xs uppercase tracking-wider shadow-xs">
                  <span>★ ĐÃ KIỂM ĐỊNH ★</span>
                  <span className="block text-[8px] font-bold">CHUẨN AN TOÀN VIETNAM</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCert(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Đóng xem chứng nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
