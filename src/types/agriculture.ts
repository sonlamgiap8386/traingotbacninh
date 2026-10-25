export type ActiveTab =
  | 'overview'
  | 'garden_map'
  | 'weather'
  | 'calendar'
  | 'market'
  | 'community'
  | 'assistant';

export interface FarmerAccount {
  id: string;
  name: string;
  avatar: string;
  location: string; // Vị trí chính xác
  shortLocation: string;
  commune: string;
  role: string;
  cropFocus: string;
  areaHa: number;
  treeCount: number;
  phone: string;
  pucCode: string; // Mã số vùng trồng
  certification: string;
  farmName?: string;
  licenseNo?: string;
}

export interface Certificate {
  id: string;
  type: 'VietGAP' | 'GlobalGAP' | 'OCOP' | 'Hữu cơ';
  title: string;
  certificateNumber: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  scope: string;
  verified: boolean;
  qrCodeUrl?: string;
  standardDetails: string;
}

export interface FarmerProfile {
  name: string;
  avatar: string;
  coverImage?: string;
  role: string;
  phone: string;
  zalo: string;
  address: string;
  experienceYears: number;
  orchardAreaHa: number;
  treeCount: number;
  bio: string;
  achievements: string[];
  commitment: string;
  certificates: Certificate[];
}

export interface WateringLog {
  date: string;
  method: string;
  amountLiters: string;
  waterSource: string;
  note: string;
}

export interface FertilizingLog {
  date: string;
  fertilizerName: string;
  dosage: string;
  stage: string;
  organicCertified: boolean;
  note: string;
}

export interface PestProtectionLog {
  date: string;
  productUsed: string;
  targetPest: string;
  isBiological: boolean;
  isolationDaysBeforeHarvest: number;
  status: 'Đã hoàn thành cách ly' | 'Đang cách ly';
  safetyVerified: boolean;
}

export interface GeneralCultivationLog {
  date: string;
  title: string;
  instructions: string;
  materials: string;
}

export interface FarmLocation {
  lat: number;
  lng: number;
  address: string;
  commune: string;
  altitudeM: number;
  soilType: string;
  waterSource: string;
  mapZoom?: number;
}

export interface ProduceItem {
  id: string;
  name: string;
  category: 'lychee' | 'orange' | 'pomelo' | 'guava' | 'apple' | 'other';
  price: number;
  unit: string;
  origin: string;
  farmer: string;
  farmerPhone: string;
  rating: number;
  reviewCount: number;
  inStock: number;
  image: string;
  certifications: ('VietGAP' | 'GlobalGAP' | 'OCOP 4 sao' | 'OCOP 5 sao' | 'Hữu cơ')[];
  harvestSeason: string;
  sweetnessBrix?: number;
  description: string;
  featured?: boolean;
  vietgapCode: string;
  farmerProfile: FarmerProfile;
  location: FarmLocation;
  cultivationLog: {
    watering: WateringLog[];
    fertilizing: FertilizingLog[];
    pestProtection: PestProtectionLog[];
    general?: GeneralCultivationLog[];
  };
}

export interface FarmZone {
  id: string;
  name: string;
  crop: string;
  areaHa: number;
  treeCount: number;
  treeAge: number;
  soilMoisture: number;
  soilPh: number;
  healthStatus: 'Tuyệt vời' | 'Bình thường' | 'Cần chú ý';
  lastWatered: string;
  irrigationStatus: 'idle' | 'running';
  expectedYieldTons: number;
  coordinates: { x: number; y: number; z: number };
  color: string;
}

export interface CalendarTask {
  id: string;
  crop: string;
  title: string;
  date: string;
  // Người dùng có thể nhập giai đoạn canh tác tùy chỉnh trong nhật ký.
  stage: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  completed: boolean;
  assignedTo: string;
  instructions: string;
  materialsNeeded: string[];
  logType?: 'watering' | 'fertilizing' | 'pest' | 'general';
  logDetail?: string;
}

export interface CommunityPost {
  id: string;
  authorId?: string;
  author: {
    name: string;
    avatar: string;
    village: string;
    badge: string;
  };
  timeAgo: string;
  isEdited?: boolean;
  content: string;
  images?: string[];
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  comments: {
    id: string;
    author: string;
    avatar: string;
    village: string;
    content: string;
    timeAgo: string;
  }[];
  tags: string[];
}

export interface WeatherDay {
  date: string;
  dayName: string;
  condition: string;
  icon: string;
  tempHigh: number;
  tempLow: number;
  humidity: number;
  rainfallMm: number;
  windSpeedKmH: number;
  agriAdvice: string;
}

export interface DiseaseRecord {
  id: string;
  name: string;
  plant: string;
  confidence: number;
  severity: 'Nhẹ' | 'Trung bình' | 'Nghiêm trọng';
  symptoms: string[];
  causes: string;
  treatment: {
    biological: string[];
    chemicalIfSevere: string[];
    prevention: string[];
  };
}

export interface CartItem {
  item: ProduceItem;
  quantity: number;
}

export interface AgriExpert {
  id: string;
  name: string;
  title: string;          // Chức danh
  organization: string;   // Đơn vị công tác
  avatar: string;
  specialties: string[];  // Lĩnh vực chuyên môn
  phone: string;
  zalo?: string;
  email?: string;
  experience: number;     // Số năm kinh nghiệm
  isOnline: boolean;
  responseTime: string;   // Thời gian phản hồi ước tính
  rating: number;
  consultedCount: number; // Số ca tư vấn
  certifications: string[];
  bio: string;
  availableHours: string; // "7:00 - 17:00, T2-T6"
  coverCrops: string[];   // Cây trồng phụ trách
  badge: 'Cán bộ Khuyến nông' | 'Chuyên gia Cấp tỉnh' | 'Đầu ngành Quốc gia' | 'Nhà nghiên cứu';
}

export interface ExpertMessage {
  id: string;
  sender: 'farmer' | 'expert' | 'system';
  text: string;
  time: string;
  expertId?: string;
  imageBase64?: string;
  isRead?: boolean;
}

export interface ExpertChatSession {
  id: string;
  expertId: string;
  farmerId: string;
  messages: ExpertMessage[];
  status: 'active' | 'waiting' | 'closed';
  topic: string;
  createdAt: string;
  lastActivity: string;
}
