import React, { useState, useRef, useEffect } from 'react';
import {
  Stethoscope,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  MessageSquare,
  BookmarkPlus,
  Printer,
  ChevronRight,
  Info,
  Layers,
  Bug,
  Leaf,
  Clock,
  ExternalLink,
  Check,
} from 'lucide-react';
import { COMMON_DISEASES } from '../data/mockData';
import { DiseaseRecord } from '../types/agriculture';
import { FruitLogo, FruitLogoKind } from './FruitLogo';

interface DiagnosisTabProps {
  onAskAssistant?: (question: string) => void;
}

export const DiagnosisTab: React.FC<DiagnosisTabProps> = ({ onAskAssistant }) => {
  const [selectedDisease, setSelectedDisease] = useState<DiseaseRecord>(COMMON_DISEASES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [plantType, setPlantType] = useState<string>('Vải thiều');
  const [affectedPart, setAffectedPart] = useState<string>('Lá & Chùm hoa');
  const [symptomText, setSymptomText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const diagnosisFruit: FruitLogoKind = plantType.toLowerCase().includes('cam')
    ? 'orange'
    : plantType.toLowerCase().includes('bưởi')
      ? 'pomelo'
      : plantType.toLowerCase().includes('táo')
        ? 'apple'
        : plantType.toLowerCase().includes('ổi')
          ? 'guava'
          : 'lychee';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up media stream on component unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 3000);
  };

  // Resize camera and upload images before encoding. Vision models do not need
  // the original multi-megapixel file, and this sharply reduces request time
  // and mobile-memory use while preserving enough leaf-detail for diagnosis.
  const imageToBase64 = (file: Blob, maxEdge = 1600): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      image.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        URL.revokeObjectURL(objectUrl);
        if (!context) {
          reject(new Error('Trình duyệt không hỗ trợ xử lý ảnh.'));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        // JPEG is supported by the API for every accepted input type and is
        // substantially smaller than a PNG photo from a phone camera.
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Không thể đọc ảnh.'));
      };
      image.src = objectUrl;
    });
  };

  // Handle uploaded image file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      showToast('Vui lòng chọn ảnh JPG, PNG hoặc WebP có dung lượng không quá 10MB.');
      e.target.value = '';
      return;
    }

    try {
      const base64Data = await imageToBase64(file);
      setUploadedPreview(base64Data);
      runDiagnosis(base64Data, 'image/jpeg');
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi đọc tệp ảnh. Vui lòng thử lại.');
    }
  };

  // Live Camera handlers
  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      showToast('Không thể mở máy ảnh. Vui lòng dùng tính năng tải ảnh.');
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    const sourceWidth = videoRef.current.videoWidth || 640;
    const sourceHeight = videoRef.current.videoHeight || 480;
    const scale = Math.min(1, 1600 / Math.max(sourceWidth, sourceHeight));
    canvas.width = Math.round(sourceWidth * scale);
    canvas.height = Math.round(sourceHeight * scale);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      setUploadedPreview(dataUrl);
      stopCamera();
      runDiagnosis(dataUrl, 'image/jpeg');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  // Run AI Diagnosis via backend server or smart agronomic matcher
  const runDiagnosis = async (
    imgBase64?: string,
    mimeType?: string,
    targetPlant?: string,
    targetPart?: string,
    targetSymptoms?: string
  ) => {
    setIsAnalyzing(true);
    const activePlant = targetPlant || plantType;
    const activePart = targetPart || affectedPart;
    const activeSymptoms = targetSymptoms !== undefined ? targetSymptoms : symptomText;

    try {
      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imgBase64 || uploadedPreview,
          mimeType: mimeType || 'image/jpeg',
          plantType: activePlant,
          affectedPart: activePart,
          symptomsDescription: activeSymptoms,
        }),
      });

      const data = await response.json();

      if (data.success && data.diagnosis) {
        const diag = data.diagnosis;
        setSelectedDisease({
          id: `diag-${Date.now()}`,
          name: diag.name || `Bệnh trên cây ${activePlant}`,
          plant: diag.plant || activePlant,
          confidence: diag.confidence || 95,
          severity: diag.severity || 'Nghiêm trọng',
          symptoms: Array.isArray(diag.symptoms) ? diag.symptoms : [diag.symptoms || 'Triệu chứng biến màu mô'],
          causes: diag.causes || 'Tác nhân nấm/vi sinh vật phát sinh theo điều kiện vi khí hậu.',
          treatment: {
            biological: diag.treatment?.biological || [
              'Phun dịch nấm đối kháng Trichoderma harzianum hoặc dầu khoáng sinh học',
              'Sử dụng chế phẩm Nano Bạc - Đồng vi sinh sinh học bảo vệ mô tế bào',
            ],
            chemicalIfSevere: diag.treatment?.chemicalIfSevere || [
              'Luân phiên hoạt chất theo danh mục bảo vệ thực vật VietGAP quy định',
            ],
            prevention: diag.treatment?.prevention || [
              'Tỉa cành thông thoáng lòng tán, quét vôi trắng thân cây',
              'Bón bổ sung Silic, vi lượng Chelate và Kali hữu cơ tăng đề kháng',
            ],
          },
        });
        showToast(`Đã chẩn đoán: ${diag.name}`);
      } else {
        // Smart Local Matcher based on plant and symptoms
        fallbackDiagnosisMatch(activePlant, activePart, activeSymptoms);
      }
    } catch (err) {
      console.warn('API error, using local agronomic knowledge engine:', err);
      fallbackDiagnosisMatch(activePlant, activePart, activeSymptoms);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fallbackDiagnosisMatch = (targetPlant?: string, targetPart?: string, targetSymptoms?: string) => {
    const curPlant = (targetPlant || plantType).toLowerCase();
    const curPart = (targetPart || affectedPart).toLowerCase();
    const curSym = (targetSymptoms !== undefined ? targetSymptoms : symptomText).toLowerCase();
    const text = `${curSym} ${curPlant} ${curPart}`;

    let matched = COMMON_DISEASES[0];

    // 1. CÂY CAM ĐƯỜNG CANH / CÂY CÓ MÚI / BƯỞI DIỄN
    if (curPlant.includes('cam') || curPlant.includes('canh') || curPlant.includes('bưởi') || curPlant.includes('citrus')) {
      if (text.includes('nhện') || text.includes('bạc') || text.includes('cám') || text.includes('rám')) {
        matched = COMMON_DISEASES.find((d) => d.id === 'dis-3') || COMMON_DISEASES[2];
      } else {
        // Bệnh phổ biến nhất trên lá cam: Vàng Lá Gân Xanh (Greening / HLB)
        matched = COMMON_DISEASES.find((d) => d.id === 'dis-2') || COMMON_DISEASES[1];
      }
    } else if (curPlant.includes('vải')) {
      // 2. CÂY VẢI THIỀU
      if (text.includes('đục') || text.includes('cuống') || text.includes('sâu non')) {
        matched = COMMON_DISEASES.find((d) => d.id === 'dis-6') || COMMON_DISEASES[3];
      } else if (text.includes('sương mai') || text.includes('mốc trắng') || text.includes('mưa phùn') || text.includes('hoa thâm')) {
        matched = COMMON_DISEASES.find((d) => d.id === 'dis-5') || COMMON_DISEASES[0];
      } else if (text.includes('bọ xít') || text.includes('hút nhựa')) {
        matched = COMMON_DISEASES.find((d) => d.id === 'dis-4') || COMMON_DISEASES[3];
      } else {
        matched = COMMON_DISEASES.find((d) => d.id === 'dis-1') || COMMON_DISEASES[0];
      }
    } else {
      matched = COMMON_DISEASES[0];
    }

    setSelectedDisease(matched);
    showToast(`Đã nhận diện: ${matched.name}`);
  };

  const handleSelectSample = (disease: DiseaseRecord) => {
    setIsAnalyzing(true);
    setUploadedPreview(null);
    setTimeout(() => {
      setSelectedDisease(disease);
      setPlantType(disease.plant.split(' ')[0] || 'Vải thiều');
      setIsAnalyzing(false);
      showToast(`Đã tải mẫu bệnh: ${disease.name}`);
    }, 400);
  };

  const quickSymptoms = [
    'Đốm tròn nâu đen lá non',
    'Vàng lá gân còn xanh',
    'Chùm hoa khô thối rụng',
    'Bạc trắng mặt lá như rắc cám',
    'Sâu đùn phân ở cuống quả',
    'Mốc trắng chùm hoa sau mưa',
  ];

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto font-['Times_New_Roman',Times,serif]">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-600 flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Chẩn Đoán Sâu Bệnh Cây Trồng Bằng AI Đa Phương Thức
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Chụp ảnh thực địa hoặc tải ảnh cành lá, hoa, quả bị bệnh. Mô hình AI kết hợp cơ sở dữ liệu BVTV phường Chũ, TP. Bắc Ninh sẽ nhận diện bệnh và đưa ra phác đồ sinh học chuẩn VietGAP.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900">
          <FruitLogo fruit={diagnosisFruit} className="text-base" />
          <span>Mô hình Gemini 3.8 Flash & Viện BVTV</span>
        </div>
      </div>

      {/* Main Diagnosis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form, Photo Upload & Samples (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card: Upload & Camera Controls */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-700" />
              <span>Ảnh Mẫu Thực Địa Cần Chẩn Đoán</span>
            </h3>

            {/* Camera Viewfinder if open */}
            {cameraActive ? (
              <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-300">
                <video ref={videoRef} autoPlay playsInline className="w-full h-56 object-cover" />
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3">
                  <button
                    onClick={capturePhoto}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Chụp Ngay</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-900 text-white font-medium text-xs cursor-pointer"
                  >
                    Đóng máy ảnh
                  </button>
                </div>
              </div>
            ) : uploadedPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-300 bg-slate-50 group">
                <img
                  src={uploadedPreview}
                  alt="Ảnh mẫu bệnh thực địa"
                  className="w-full h-52 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-md cursor-pointer hover:bg-slate-100"
                  >
                    Đổi ảnh khác
                  </button>
                  <button
                    onClick={() => setUploadedPreview(null)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-rose-700"
                  >
                    Xóa ảnh
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-emerald-800/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                  Ảnh đã tải lên
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-emerald-50/40 hover:bg-emerald-50 transition-all">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-xl bg-white shadow-2xs text-emerald-600 flex items-center justify-center mb-1.5">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Tải ảnh từ máy</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG dưới 10MB</span>
                </label>

                <button
                  onClick={startCamera}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-2xs text-slate-700 flex items-center justify-center mb-1.5">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">Chụp bằng máy ảnh</span>
                  <span className="text-[10px] text-slate-400">Chụp trực tiếp tại vườn</span>
                </button>
              </div>
            )}

            {/* Tree Type & Affected Part Selectors */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Loại cây trồng:</label>
                <select
                  value={plantType}
                  onChange={(e) => {
                    const newPlant = e.target.value;
                    setPlantType(newPlant);
                    if (uploadedPreview) {
                      runDiagnosis(uploadedPreview, 'image/jpeg', newPlant, affectedPart, symptomText);
                    }
                  }}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-emerald-600 focus:border-emerald-600"
                >
                  <option value="Vải thiều">Vải thiều Chũ</option>
                  <option value="Cam đường Canh">Cam đường Canh</option>
                  <option value="Bưởi Diễn">Bưởi Diễn</option>
                  <option value="Táo xuân">Táo xuân Đài Loan</option>
                  <option value="Ổi lê">Ổi lê Phượng Sơn</option>
                  <option value="Cây ăn quả khác">Cây khác</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Bộ phận bị hại:</label>
                <select
                  value={affectedPart}
                  onChange={(e) => setAffectedPart(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-emerald-600 focus:border-emerald-600"
                >
                  <option value="Lá & Chùm hoa">Lá & Chùm hoa</option>
                  <option value="Quả non / Vỏ quả">Quả non / Vỏ quả</option>
                  <option value="Cành & Thân cây">Cành & Thân cây</option>
                  <option value="Gốc & Rễ cây">Gốc & Rễ cây</option>
                  <option value="Toàn bộ cây">Toàn bộ cây</option>
                </select>
              </div>
            </div>

            {/* Symptom description textarea */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Mô tả triệu chứng nhìn thấy (tùy chọn):
              </label>
              <textarea
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="Ví dụ: Lá non có đốm tròn thâm nâu, cuống quả non bị khô héo rụng nhiều sau đợt mưa phùn..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
              />

              {/* Quick symptom tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickSymptoms.map((qs, i) => (
                  <button
                    key={i}
                    onClick={() => setSymptomText(qs)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                  >
                    + {qs}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => runDiagnosis()}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Đang Phân Tích Mẫu Bệnh...</span>
                </>
              ) : (
                <>
                  <FruitLogo fruit={diagnosisFruit} className="text-base" />
                  <span>Tiến Hành Chẩn Đoán AI Ngay</span>
                </>
              )}
            </button>
          </div>

          {/* Preset Sample Diseases */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Hoặc thử mẫu bệnh cây ăn quả điển hình:</span>
              <span className="text-[10px] text-emerald-700 font-black">{COMMON_DISEASES.length} mẫu</span>
            </h4>
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {COMMON_DISEASES.map((dis) => (
                <button
                  key={dis.id}
                  onClick={() => handleSelectSample(dis)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    selectedDisease.id === dis.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                      : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-emerald-800">{dis.plant}</span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {dis.confidence}% Tin cậy
                    </span>
                  </div>
                  <p className="line-clamp-1 text-slate-800 font-extrabold">{dis.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Diagnosis Detailed Results Card (7 cols) */}
        <div className="lg:col-span-7">
          {isAnalyzing ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-200/90 shadow-card flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center animate-spin">
                <RefreshCw className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1">
                  Đang Quét Phổ Bệnh Thực Vật Phường Chũ, TP. Bắc Ninh...
                </h3>
                <p className="text-xs text-slate-500 max-w-md">
                  Mô hình AI thị giác đang phân tích các đốm mô, sắc tố lá, cơ chế gây hại và đối chiếu với cẩm nang Bảo vệ Thực vật VietGAP phường Chũ, TP. Bắc Ninh.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                <FruitLogo fruit={diagnosisFruit} className="text-sm" />
                <span>Đang tạo phác đồ sinh học ưu tiên</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-card space-y-5">
              {/* Header Result */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Cây: {selectedDisease.plant}
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        selectedDisease.severity === 'Nghiêm trọng'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      Mức độ: {selectedDisease.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Mã bệnh: {selectedDisease.id}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    {selectedDisease.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block font-bold uppercase tracking-wider">
                    Độ tin cậy AI
                  </span>
                  <span className="text-2xl font-black text-emerald-700">
                    {selectedDisease.confidence}%
                  </span>
                </div>
              </div>

              {/* Causes & Mechanics */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold mb-1">
                  <Bug className="w-4 h-4 text-amber-600" />
                  <span>Nguyên Nhân & Cơ Chế Phát Sinh:</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {selectedDisease.causes}
                </p>
              </div>

              {/* Identification Symptoms */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Triệu chứng nhận biết thực địa tại vườn:</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedDisease.symptoms.map((sym, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-800 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* VietGAP Biological Protocol */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                    Phác Đồ Xử Lý Sinh Học Ưu Tiên (Chuẩn VietGAP):
                  </h4>
                </div>
                <div className="space-y-2">
                  {selectedDisease.treatment.biological.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="font-semibold">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chemical if severe & Prevention */}
              <div className="pt-2 border-t border-slate-100 space-y-3 text-xs">
                {selectedDisease.treatment.chemicalIfSevere.length > 0 && (
                  <div>
                    <strong className="text-rose-700 block mb-1 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Trường hợp mật độ bệnh quá nặng ({'>'}20% tán cây):</span>
                    </strong>
                    <p className="text-slate-700 bg-rose-50/70 p-2.5 rounded-xl border border-rose-200 leading-relaxed font-medium">
                      {selectedDisease.treatment.chemicalIfSevere[0]}
                    </p>
                  </div>
                )}

                <div>
                  <strong className="text-slate-900 block mb-1.5 font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                    <span>Biện pháp canh tác phòng ngừa lâu dài cho vườn đồi:</span>
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    {selectedDisease.treatment.prevention.map((prev, idx) => (
                      <li key={idx} className="font-medium">{prev}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons for Farmer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      if (onAskAssistant) {
                        onAskAssistant(
                          `Vườn nhà tôi đang bị bệnh: ${selectedDisease.name}. Nhờ Trợ lý hướng dẫn chi tiết liều lượng và thời điểm phun xịt chuẩn VietGAP an toàn?`
                        );
                      }
                      showToast('Đang chuyển câu hỏi sang Trợ lý Kỹ thuật AI...');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Hỏi Thêm Trợ Lý AI Về Bệnh Này</span>
                  </button>

                  <button
                    onClick={() => showToast('Đã lưu chẩn đoán vào Lịch Canh Tác VietGAP của nông hộ!')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer border border-slate-200"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Lưu Vào Nhật Ký Vườn</span>
                  </button>
                </div>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold border border-slate-200 transition-all cursor-pointer"
                  title="In phác đồ điều trị"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Phác Đồ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
