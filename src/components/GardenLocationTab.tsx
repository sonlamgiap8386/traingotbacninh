import React, { useState } from 'react';
import {
  MapPin,
  Box,
  Compass,
  Navigation,
  Layers,
  Droplets,
  ExternalLink,
  Info,
  ShieldCheck,
  CheckCircle2,
  Mountain,
  Phone,
  Maximize2,
  Loader2,
} from 'lucide-react';
import { PRODUCE_ITEMS, FARMER_ACCOUNTS } from '../data/mockData';

const LazyMap3DTab = React.lazy(() =>
  import('./Map3DTab').then((m) => ({ default: m.Map3DTab }))
);

const Map3DLoadingFallback = () => (
  <div className="bg-white rounded-3xl p-12 border border-slate-200/90 shadow-card flex flex-col items-center justify-center min-h-[460px] text-center">
    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 animate-pulse">
      <Box className="w-7 h-7 animate-bounce" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-1">
      Đang tải mô hình không gian 3D vùng đồi phường Chũ...
    </h3>
    <p className="text-xs text-slate-500 max-w-md">
      Hệ thống đang khởi tạo đồ họa Three.js, địa hình đồi bát úp và hệ thống vi khí hậu.
    </p>
  </div>
);

export const GardenLocationTab: React.FC = () => {
  const [mapMode, setMapMode] = useState<'3d' | 'google_maps'>('google_maps');
  const [selectedFarmerIndex, setSelectedFarmerIndex] = useState<number>(0);
  const [googleMapType, setGoogleMapType] = useState<'m' | 'k'>('m'); // m: map, k: satellite

  // Coordinates and details mapped to the 5 designated farmer locations
  const gardenLocations = [
    {
      id: 'garden-1',
      farmer: FARMER_ACCOUNTS[0].name,
      avatar: FARMER_ACCOUNTS[0].avatar,
      role: FARMER_ACCOUNTS[0].role,
      phone: FARMER_ACCOUNTS[0].phone,
      location: FARMER_ACCOUNTS[0].location,
      shortLocation: FARMER_ACCOUNTS[0].shortLocation,
      crop: 'Vải thiều Chũ chính gốc & U hồng',
      lat: 21.3653,
      lng: 106.5925,
      areaHa: 3.5,
      treeCount: 650,
      pucCode: FARMER_ACCOUNTS[0].pucCode,
      certification: 'VietGAP & GlobalGAP',
      altitudeM: 95,
      soilType: 'Đất feralit đỏ vàng đồi dốc son',
      waterSource: 'Nước nguồn hồ Cấm Sơn qua bể lắng vi sinh',
      produceItem: PRODUCE_ITEMS[0],
    },
    {
      id: 'garden-2',
      farmer: FARMER_ACCOUNTS[1].name,
      avatar: FARMER_ACCOUNTS[1].avatar,
      role: FARMER_ACCOUNTS[1].role,
      phone: FARMER_ACCOUNTS[1].phone,
      location: FARMER_ACCOUNTS[1].location,
      shortLocation: FARMER_ACCOUNTS[1].shortLocation,
      crop: 'Cam đường Canh & Cam V2',
      lat: 21.3789,
      lng: 106.6214,
      areaHa: 2.8,
      treeCount: 520,
      pucCode: FARMER_ACCOUNTS[1].pucCode,
      certification: 'VietGAP & OCOP 4 sao',
      altitudeM: 88,
      soilType: 'Đất phù sa cổ pha cát giàu vi lượng',
      waterSource: 'Hồ đập Thầu qua trạm bơm tưới nhỏ giọt Israel',
      produceItem: PRODUCE_ITEMS[1],
    },
    {
      id: 'garden-3',
      farmer: FARMER_ACCOUNTS[2].name,
      avatar: FARMER_ACCOUNTS[2].avatar,
      role: FARMER_ACCOUNTS[2].role,
      phone: FARMER_ACCOUNTS[2].phone,
      location: FARMER_ACCOUNTS[2].location,
      shortLocation: FARMER_ACCOUNTS[2].shortLocation,
      crop: 'Bưởi Diễn cổ thụ & Làng nghề Mỳ Chũ',
      lat: 21.3412,
      lng: 106.5743,
      areaHa: 2.2,
      treeCount: 380,
      pucCode: FARMER_ACCOUNTS[2].pucCode,
      certification: 'VietGAP & OCOP 4 sao',
      altitudeM: 78,
      soilType: 'Đất bãi ven sông Lục Nam màu mỡ',
      waterSource: 'Nước ngầm giếng khoan tầng sâu kiểm định an toàn',
      produceItem: PRODUCE_ITEMS[2],
    },
    {
      id: 'garden-4',
      farmer: FARMER_ACCOUNTS[3].name,
      avatar: FARMER_ACCOUNTS[3].avatar,
      role: FARMER_ACCOUNTS[3].role,
      phone: FARMER_ACCOUNTS[3].phone,
      location: FARMER_ACCOUNTS[3].location,
      shortLocation: FARMER_ACCOUNTS[3].shortLocation,
      crop: 'Táo xuân Đài Loan & Ổi lê',
      lat: 21.3892,
      lng: 106.5987,
      areaHa: 1.9,
      treeCount: 420,
      pucCode: FARMER_ACCOUNTS[3].pucCode,
      certification: 'VietGAP an toàn sinh học',
      altitudeM: 105,
      soilType: 'Đất feralit phát triển trên đá phiến sét',
      waterSource: 'Hồ suối Làng Lâm lọc tự nhiên',
      produceItem: PRODUCE_ITEMS[3],
    },
    {
      id: 'garden-5',
      farmer: FARMER_ACCOUNTS[4].name,
      avatar: FARMER_ACCOUNTS[4].avatar,
      role: FARMER_ACCOUNTS[4].role,
      phone: FARMER_ACCOUNTS[4].phone,
      location: FARMER_ACCOUNTS[4].location,
      shortLocation: FARMER_ACCOUNTS[4].shortLocation,
      crop: 'Vải thiều hữu cơ xuất khẩu & Ổi sạch',
      lat: 21.4125,
      lng: 106.6431,
      areaHa: 3.1,
      treeCount: 580,
      pucCode: FARMER_ACCOUNTS[4].pucCode,
      certification: 'Hữu cơ & VietGAP',
      altitudeM: 120,
      soilType: 'Đất đồi cao tơi xốp giàu mùn tự nhiên',
      waterSource: 'Nước suối nguồn rừng phòng hộ Tân Quang',
      produceItem: PRODUCE_ITEMS[4],
    },
  ];

  const currentGarden = gardenLocations[selectedFarmerIndex];
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${currentGarden.lat},${currentGarden.lng}`;
  const embedUrl = `https://maps.google.com/maps?q=${currentGarden.lat},${currentGarden.lng}&t=${googleMapType}&z=14&output=embed`;

  return (
    <div className="space-y-6 pb-12 font-['Times_New_Roman',Times,serif]">
      {/* Top Switcher Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Vị Trí Khu Vườn & Bản Đồ Canh Tác Phường Chũ, TP. Bắc Ninh
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Khám phá 5 khu vườn đồi chính gốc tại phường Chũ, TP. Bắc Ninh qua Google Maps thực địa hoặc mô hình 3D tương tác.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setMapMode('google_maps')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mapMode === 'google_maps'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Bản Đồ Google Maps Thực Địa (5 Vườn)</span>
          </button>

          <button
            onClick={() => setMapMode('3d')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mapMode === '3d'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Mô Hình Không Gian 3D</span>
          </button>
        </div>
      </div>

      {/* Render 3D Model Mode */}
      {mapMode === '3d' ? (
        <React.Suspense fallback={<Map3DLoadingFallback />}>
          <LazyMap3DTab />
        </React.Suspense>
      ) : (
        /* Render Google Maps Real Locations Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Google Map Iframe & controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Mã vùng trồng: {currentGarden.pucCode}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {currentGarden.certification}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1">
                    Vườn Bác {currentGarden.farmer} – {currentGarden.crop}
                  </h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{currentGarden.location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs">
                    <button
                      onClick={() => setGoogleMapType('m')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        googleMapType === 'm'
                          ? 'bg-white text-emerald-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Bản đồ giao thông
                    </button>
                    <button
                      onClick={() => setGoogleMapType('k')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                        googleMapType === 'k'
                          ? 'bg-white text-emerald-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Ảnh vệ tinh
                    </button>
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mở Google Maps</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>

              {/* Map Iframe */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-[480px]">
                <iframe
                  title={`Google Maps - ${currentGarden.farmer}`}
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  className="w-full h-full"
                />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Tọa độ GPS: {currentGarden.lat}° N, {currentGarden.lng}° E</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs font-bold text-emerald-800">
                  📍 {currentGarden.shortLocation}
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Pick 5 Orchards & Inspect Terroir */}
          <div className="space-y-4">
            {/* 5 Farmer Orchards Selector */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Chọn vị trí 5 khu vườn tiêu biểu:
              </h4>

              <div className="space-y-2">
                {gardenLocations.map((item, idx) => {
                  const isSelected = selectedFarmerIndex === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedFarmerIndex(idx)}
                      className={`w-full text-left p-3 rounded-2xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/90 border-emerald-500 font-bold text-emerald-950 shadow-xs ring-1 ring-emerald-400'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <img
                        src={item.avatar}
                        alt={item.farmer}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-extrabold truncate text-slate-900">{item.farmer}</p>
                          <span className="text-[10px] text-emerald-700 font-bold">{item.areaHa} ha</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 font-semibold truncate mt-0.5">
                          📍 {item.location}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {item.crop}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Terroir, Water & Soil specs */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card space-y-3 text-xs">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="font-extrabold text-sm text-slate-900">
                  Thông Số Thổ Nhưỡng & Vùng Trồng
                </h4>
              </div>

              <div className="space-y-2.5 text-slate-700">
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">Chủ hộ canh tác:</span>
                  <strong className="text-slate-900 text-right">{currentGarden.farmer} ({currentGarden.phone})</strong>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">Mã định danh PUC:</span>
                  <strong className="font-mono text-emerald-700 font-bold">{currentGarden.pucCode}</strong>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">Độ cao địa hình:</span>
                  <strong className="text-slate-900">{currentGarden.altitudeM} mét so với mực nước biển</strong>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">Chất đất đồi:</span>
                  <span className="text-slate-900 font-semibold text-right max-w-[170px]">{currentGarden.soilType}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">Nguồn nước tưới:</span>
                  <span className="text-slate-900 font-semibold text-right max-w-[170px]">{currentGarden.waterSource}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">Quy mô:</span>
                  <strong className="text-slate-900">{currentGarden.areaHa} ha ({currentGarden.treeCount} gốc)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
