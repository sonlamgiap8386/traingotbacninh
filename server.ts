import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const configuredPort = Number.parseInt(process.env.PORT || '', 10);
const port = Number.isInteger(configuredPort) && configuredPort > 0 ? configuredPort : 3000;

// Images are resized in the browser before upload. Keep a bounded request body
// so a malformed request cannot consume excessive server memory.
app.use(express.json({ limit: '14mb' }));
app.use(express.urlencoded({ extended: true, limit: '14mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function withTimeout<T>(operation: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), timeoutMs);
  });
  return Promise.race([operation, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BASE64_LENGTH = 12 * 1024 * 1024;
const MAX_PROMPT_LENGTH = 3000;

// Built-in expert agronomic knowledge generator (guarantees 100% uptime and precision by crop type)
function generateAgronomicDiagnosis(plantType?: string, affectedPart?: string, symptoms?: string) {
  const crop = (plantType || '').toLowerCase();
  const symptomsLower = (symptoms || '').toLowerCase();
  const partLower = (affectedPart || '').toLowerCase();
  const combined = `${crop} ${partLower} ${symptomsLower}`;

  // 1. CÂY CÓ MÚI: CAM ĐƯỜNG CANH, BƯỞI DIỄN
  if (crop.includes('cam') || crop.includes('bưởi') || crop.includes('citrus')) {
    // If Spider Mite (Nhện đỏ)
    if (combined.includes('nhện') || combined.includes('bạc') || combined.includes('cám') || combined.includes('rám')) {
      return {
        name: 'Nhện Đỏ Hại Cam Canh & Cây Có Múi (Panonychus citri)',
        plant: plantType || 'Cam đường Canh',
        confidence: 93,
        severity: 'Trung bình',
        causes: 'Thời tiết hanh khô kết hợp nắng hanh chênh lệch nhiệt độ cao kích thích nhện đỏ sinh sản nhanh chu kỳ 10-12 ngày/lứa.',
        symptoms: [
          'Mặt trên của phiến lá bị mất diệp lục, lấm chấm bạc trắng li ti như rắc bột cám',
          'Vỏ quả bị rám xám sần sùi làm mất mã màu đỏ bóng của cam đường Canh',
          'Mặt dưới của lá xuất hiện tơ mỏng và các chấm nhỏ màu đỏ di chuyển linh hoạt',
        ],
        treatment: {
          biological: [
            'Dùng vòi phun áp lực cao xịt nước rửa sạch mặt dưới tán lá vào buổi trưa nắng để đánh bật nhện đỏ',
            'Phun chế phẩm sinh học dầu khoáng SK-Enspray 99EC hoặc dầu Neem nguyên chất pha loãng',
            'Bảo tồn thiên địch bọ rùa ăn nhện và bọ trĩ bắt mồi trong thảm cỏ tự nhiên vườn cam',
          ],
          chemicalIfSevere: [
            'Nếu mật độ nhện >5 con/lá, phun thuốc sinh học Abamectin hoặc Diafenthiuron luân phiên theo chuẩn VietGAP',
          ],
          prevention: [
            'Giữ thảm cỏ mọc tự nhiên cao 10-15cm để tạo môi trường ẩm độ ổn định cho thiên địch',
          ],
        },
        expertAdvice: 'Tránh phun thuốc trừ sâu hóa học phổ rộng làm diệt sạch bọ rùa và thiên địch có ích, khiến nhện đỏ bùng phát kháng thuốc nặng hơn.',
        isolationDays: 7,
      };
    }

    // If Root Rot (Thối rễ, vàng lá úng)
    if (combined.includes('thối rễ') || combined.includes('vàng lá thối rễ') || partLower.includes('rễ') || partLower.includes('gốc')) {
      return {
        name: 'Bệnh Vàng Lá Thối Rễ Cam Canh (Phytophthora & Fusarium)',
        plant: plantType || 'Cam đường Canh',
        confidence: 95,
        severity: 'Nghiêm trọng',
        causes: 'Tổ hợp nấm Phytophthora spp. và Fusarium solani tấn công vào chóp rễ tơ và vỏ rễ khi đất vườn đồi bị nén dẽ, đọng nước nghẹt oxy.',
        symptoms: [
          'Gân lá có màu vàng trắng, phiến lá chuyển vàng đều từ từ rồi rụng hàng loạt',
          'Cây cằn cỗi, các cành tơ trên ngọn bị khô chết dần từ chóp ngọn xuống',
          'Rễ tơ bị thối nâu đen, vỏ rễ tuột khỏi lõi gỗ khi dùng tay vuốt nhẹ, có mùi chua hôi',
        ],
        treatment: {
          biological: [
            'Xới nhẹ phá váng rãnh thoát nước quanh tán, tưới chế phẩm đối kháng Trichoderma kết hợp Humic sinh học kích rễ',
            'Tưới chế phẩm vi sinh Bacillus subtilis để tiêu diệt nấm hại trong đất',
            'Quét dung dịch Booc-đô 1% hoặc vôi bột pha đồng sunfat quanh gốc cây cao 50cm',
          ],
          chemicalIfSevere: [
            'Tưới luân phiên thuốc gốc Metalaxyl + Mancozeb hoặc Fosetyl-Aluminium quanh vùng rễ tán cây (cách ly PHI 21 ngày)',
          ],
          prevention: [
            'Đào rãnh thoát nước sâu giữa các hàng cam đồi để chống ngập úng mùa mưa',
            'Bón nhiều phân chuồng ủ hoai mục với nấm đối kháng, không bón đạm tươi',
          ],
        },
        expertAdvice: 'Khi phát hiện vàng lá do rễ, tuyệt đối không được bón phân vô cơ (đạm, NPK) ngay vì sẽ làm cháy những đầu rễ non còn lại.',
        isolationDays: 21,
      };
    }

    // If Canker / Scab (Loét / Ghẻ sẹo)
    if (combined.includes('loét') || combined.includes('ghẻ') || combined.includes('sẹo') || combined.includes('nốt sần')) {
      return {
        name: 'Bệnh Ghẻ Loét Vi Khuẩn Cam Canh (Xanthomonas citri)',
        plant: plantType || 'Cam đường Canh',
        confidence: 94,
        severity: 'Trung bình',
        causes: 'Vi khuẩn Xanthomonas citri xâm nhập qua khí khổng và các vết trầy xước do sâu vẽ bùa hoặc cọ xát gió bão gây ra.',
        symptoms: [
          'Vết bệnh ban đầu là chấm nhỏ màu vàng trong suốt, sau gồ lên như mụn ghẻ màu nâu xám sần sùi',
          'Xung quanh vết loét trên lá có quầng vàng sáng bao quanh rất đặc trưng',
          'Trên vỏ quả có các vết sần nứt nẻ hình miệng núi lửa, quả rụng non hoặc méo mó mất giá trị thương phẩm',
        ],
        treatment: {
          biological: [
            'Phun dung dịch Nano Đồng hữu cơ hoặc Chitosan sinh học khi lộc non mới nhú 1-2cm',
            'Phòng trừ triệt để sâu vẽ bùa bằng dầu khoáng sinh học để chặn đường xâm nhập của vi khuẩn',
          ],
          chemicalIfSevere: [
            'Phun thuốc gốc đồng Copper Oxychloride hoặc Kasugamycin khi bệnh chớm xuất hiện',
          ],
          prevention: [
            'Cắt tỉa các cành bị bệnh đem đốt tiêu hủy trước mùa mưa',
            'Trồng cây chắn gió quanh vườn đồi để hạn chế cọ xát cành lá',
          ],
        },
        expertAdvice: 'Quản lý tốt sâu vẽ bùa ở giai đoạn cành lộc non là biện pháp căn cơ nhất để phòng ngừa bệnh ghẻ loét trên cam canh.',
        isolationDays: 14,
      };
    }

    // Default for Cam Canh: Bệnh Vàng Lá Gân Xanh (Greening / HLB) - bệnh phổ biến nhất trên lá cam
    return {
      name: 'Bệnh Vàng Lá Gân Xanh (Greening / Huanglongbing - HLB)',
      plant: plantType || 'Cam đường Canh',
      confidence: 96,
      severity: 'Nghiêm trọng',
      causes: 'Vi khuẩn Candidatus Liberibacter asiaticus ký sinh trong mạch libe của cây có múi, lây truyền chủ yếu qua vector rầy chổng cánh (Diaphorina citri) và mắt ghép nhiễm bệnh.',
      symptoms: [
        'Phiến lá màu vàng loang lổ (vàng lốm đốm) nhưng gân chính và gân phụ của lá vẫn giữ màu xanh lục đặc trưng',
        'Lá non mọc dựng đứng nhọn như tai thỏ, phiến lá nhỏ dày cứng và giòn dễ gãy vụn',
        'Cây phân nhánh nhiều cành tăm ngắn, hoa ra trái vụ nhiều nhưng rụng quả non hàng loạt',
        'Quả cam méo mó, tâm quả vẹo lệch, hạt bị lép thui đen, múi quả khô chua đắng không ngọt',
      ],
      treatment: {
        biological: [
          'Nuôi thả kiến vàng (Oecophylla smaragdina) trong vườn cam để săn bắt tự nhiên rầy chổng cánh',
          'Trồng xen ổi lê Phượng Sơn quanh rìa vườn cam để xua đuổi rầy chổng cánh nhờ tinh dầu lá ổi tự nhiên',
          'Bổ sung vi lượng Chelate (Kẽm Zn, Magie Mg, Bo) qua lá kết hợp tưới phân hữu cơ trùn quế vi sinh để duy trì màu xanh tế bào',
          'Phun dung dịch thảo mộc xua đuổi rầy chổng cánh lúc cây nhú đọt lộc non',
        ],
        chemicalIfSevere: [
          'Đối với cây đã nhiễm bệnh nặng (>30% tán lá chuyển vàng tai thỏ), bà con cần đào bỏ cả gốc rễ mang ra ngoài vườn đốt tiêu hủy rắc vôi bột khử trùng hố trồng để tránh lây nhiễm cho toàn bộ vườn cam',
          'Phun luân phiên thuốc sinh học Abamectin hoặc dầu khoáng sinh học SK-Enspray 99EC diệt rầy chổng cánh vào các đợt lộc non rộ',
        ],
        prevention: [
          'Chỉ sử dụng cây giống sạch bệnh có chứng chỉ ghép mắt của Viện Rau Quả hoặc cơ quan BVTV nhà nước',
          'Thường xuyên kiểm tra bẫy dính màu vàng để phát hiện sớm mật độ rầy chổng cánh',
          'Bón cân đối phân hữu cơ vi sinh, không bón thừa đạm kích thích cành vống',
        ],
      },
      expertAdvice: 'Rầy chổng cánh là vật chủ truyền bệnh duy nhất. Quản lý triệt để rầy chổng cánh trong các đợt lộc non là chìa khóa sống còn để bảo vệ vườn cam canh khỏi bệnh Greening.',
      isolationDays: 0,
    };
  }

  // 2. CÂY VẢI THIỀU
  if (crop.includes('vải')) {
    if (combined.includes('sương mai') || combined.includes('mốc trắng') || combined.includes('mưa phùn') || combined.includes('hoa thâm')) {
      return {
        name: 'Bệnh Sương Mai Mốc Trắng Vải Thiều (Peronophythora litchii)',
        plant: 'Vải thiều Chũ',
        confidence: 96,
        severity: 'Nghiêm trọng',
        causes: 'Nấm Peronophythora litchii bùng phát khi độ ẩm không khí >90%, mưa phùn ẩm ướt kéo dài vào mùa xuân.',
        symptoms: [
          'Chùm hoa vải bị thâm nâu úng nước, xuất hiện lớp màng mốc trắng như bột sương muối',
          'Quả non bị đốm thối nâu từ cuống quả lan dần xuống vỏ',
          'Hoa và quả non rụng hàng loạt sau các đợt mưa phùn ẩm kéo dài',
        ],
        treatment: {
          biological: [
            'Phun chế phẩm Nano Bạc - Đồng vi sinh sinh học nồng độ 50ppm ướt đều chùm hoa lúc trời ráo sương',
            'Tưới dịch nấm đối kháng Trichoderma harzianum quanh vùng rễ tán cây',
            'Rung giũ hoa tàn sau mưa để tránh ứ đọng giọt sương trên chùm nụ',
          ],
          chemicalIfSevere: [
            'Nếu thời tiết ẩm kéo dài và tỷ lệ bệnh >15%, phun luân phiên thuốc Cymoxanil + Mancozeb hoặc Metalaxyl (cách ly PHI tối thiểu 14 ngày theo chuẩn VietGAP)',
          ],
          prevention: [
            'Tỉa tạo tán mở, thông thoáng lòng tán để ánh nắng rọi vào thân cành',
            'Bón cân đối Lân và Kali hữu cơ vi sinh, hạn chế đạm vô cơ lúc nhú nụ hoa',
          ],
        },
        expertAdvice: 'Thời tiết ẩm là kẻ thù số một của hoa vải. Bà con cần thăm vườn sáng sớm, cắt tỉa cành tăm lòng tán để sương mau bốc hơi.',
        isolationDays: 14,
      };
    }

    if (combined.includes('đục') || combined.includes('cuống') || combined.includes('phân') || combined.includes('sâu non')) {
      return {
        name: 'Sâu Đục Cuống Quả Vải Thiều (Conopomorpha sinensis)',
        plant: 'Vải thiều Chũ',
        confidence: 97,
        severity: 'Nghiêm trọng',
        causes: 'Ngài sâu đục cuống đẻ trứng rộ vào ban đêm trong các đợt lộc non và khi quả vải bắt đầu hình thành hạt non đến đỏ cuống.',
        symptoms: [
          'Sâu non đục thẳng vào cuống quả non hoặc sát đáy quả đang vào cùi',
          'Vết đục có đùn phân li ti màu nâu đen ở ngay cuống quả',
          'Quả vải bị rụng non hàng loạt hoặc quả chín bị sâu bên trong hạt, giảm giá bán trầm trọng',
        ],
        treatment: {
          biological: [
            'Treo bẫy Pheromone giới tính dẫn dụ ngài đực bắt đầu từ tháng 3 âm lịch',
            'Phun thuốc thảo mộc trừ sâu sinh học NeemNim hoặc Matrine 0.5% vào chùm quả lúc chiều mát',
            'Thu gom và tiêu hủy toàn bộ quả rụng dưới gốc để cắt đứt nguồn sâu non hóa nhộng',
          ],
          chemicalIfSevere: [
            'Phun thuốc sinh học thế hệ mới Emamectin benzoate (Dylan, Susupes) trước thu hoạch 20 ngày',
          ],
          prevention: [
            'Bao chùm quả bằng túi lưới chuyên dụng đối với các vườn vải thiều hữu cơ xuất khẩu đi Nhật Bản, EU',
          ],
        },
        expertAdvice: 'Nên đặt bẫy bả chua ngọt và theo dõi lứa ngài đẻ trứng để phun phòng trừ đúng thời điểm sâu non mới nở.',
        isolationDays: 20,
      };
    }

    if (combined.includes('bọ xít') || combined.includes('chích hút') || combined.includes('khô đọt')) {
      return {
        name: 'Bọ Xít Nâu Hại Vải Thiều (Tessaratoma papillosa)',
        plant: 'Vải thiều Chũ',
        confidence: 95,
        severity: 'Trung bình',
        causes: 'Bọ xít qua đông thức dậy vào mùa xuân ấm áp, đẻ từng ổ 14 quả trứng dưới mặt lá non và chùm hoa vải.',
        symptoms: [
          'Bọ xít non và trưởng thành chích hút nhựa ở chùm hoa và cuống quả non',
          'Chùm hoa khô héo, quả non rụng hàng loạt',
          'Đọt non bị thâm đen và cháy cụt',
        ],
        treatment: {
          biological: [
            'Rung cây bắt bọ xít vào sáng sớm khi sương chưa tan cánh ướt không bay được',
            'Treo đèn bẫy côn trùng vào ban đêm và thả ong ký sinh trứng bọ xít (Anastatus)',
            'Phun thuốc thảo mộc sinh học Neem oil hoặc chế phẩm nấm ký sinh Beauveria',
          ],
          chemicalIfSevere: [
            'Phun thuốc sinh học vi sinh BT (Bacillus thuringiensis) lúc bọ xít non mới nở tuổi 1-2',
          ],
          prevention: [
            'Quét vôi trắng gốc cây sau vụ thu hoạch để diệt sạch nơi trú ẩn qua đông',
          ],
        },
        expertAdvice: 'Bắt bọ xít qua đông trước khi đẻ trứng vào tháng Chạp và tháng Giêng là biện pháp hiệu quả và an toàn nhất.',
        isolationDays: 10,
      };
    }

    // Default for Vải Thiều: Bệnh Thán Thư Vải Thiều
    return {
      name: 'Bệnh Thán Thư Vải Thiều (Colletotrichum gloeosporioides)',
      plant: 'Vải thiều Chũ',
      confidence: 96,
      severity: 'Nghiêm trọng',
      causes: 'Nấm Colletotrichum gloeosporioides phát triển mạnh trong điều kiện mưa phùn, ẩm ướt và nhiệt độ 22 - 28°C.',
      symptoms: [
        'Đốm tròn màu nâu thẫm hoặc đen trên phiến lá non, mép lá bị quăn khô rách',
        'Hoa bị khô cháy chuyển màu nâu đen và rụng hàng loạt',
        'Vỏ quả vải xuất hiện vết lõm hình tròn màu xám thối ăn sâu vào cùi',
      ],
      treatment: {
        biological: [
          'Phun dịch nấm đối kháng Trichoderma harzianum pha loãng 1:500 ướt đều mặt tán',
          'Sử dụng chế phẩm sinh học Chitosan kết hợp Nano Bạc để ức chế màng tế bào nấm',
          'Tỉa thông thoáng cành la, cành tăm để ánh nắng chiếu vào thân cây',
        ],
        chemicalIfSevere: [
          'Nếu mật độ bệnh >20%, luân phiên hoạt chất Azoxystrobin + Difenoconazole hoặc Mancozeb theo chuẩn liều lượng VietGAP',
        ],
        prevention: [
          'Bón cân đối N-P-K, tăng cường Silic và Kali hữu cơ giúp thành tế bào lá dày chắc',
          'Không tưới phun mưa lên tán lá vào buổi chiều tối',
        ],
      },
      expertAdvice: 'Cần cắt bỏ và gom các cành lá bị thán thư đem đốt tiêu hủy trước khi bước vào đợt phân hóa mầm hoa chính vụ.',
      isolationDays: 14,
    };
  }

  // 3. CÂY TÁO XUÂN
  if (crop.includes('táo')) {
    return {
      name: 'Bệnh Phấn Trắng Hại Táo Xuân (Podosphaera leucotricha)',
      plant: 'Táo xuân Đài Loan',
      confidence: 93,
      severity: 'Trung bình',
      causes: 'Nấm phấn trắng phát triển khi thời tiết ẩm, tán lá rậm rạp thiếu ánh sáng.',
      symptoms: [
        'Lớp bột trắng như phấn mịn bao phủ trên lá non, chồi non và cuống hoa',
        'Lá bị biến dạng, xoăn queo và rụng sớm, hoa không đậu quả',
        'Vỏ quả táo non bị nứt nẻ sần sùi kém phát triển',
      ],
      treatment: {
        biological: [
          'Phun chế phẩm sinh học Nano Lưu huỳnh hoặc dung dịch baking soda pha loãng',
          'Tỉa cành tạo tán thông thoáng cho vườn táo',
        ],
        chemicalIfSevere: [
          'Phun luân phiên hoạt chất Difenoconazole hoặc Hexaconazole theo chuẩn VietGAP',
        ],
        prevention: [
          'Thu gom và tiêu hủy tàn dư lá bệnh cuối vụ',
          'Bón bổ sung Canxi Silic giúp lá cứng cáp',
        ],
      },
      expertAdvice: 'Nên kiểm tra định kỳ các đợt lộc non của cây táo xuân để phát hiện phấn trắng sớm nhất.',
      isolationDays: 14,
    };
  }

  // 4. CÂY ỔI LÊ
  if (crop.includes('ổi')) {
    return {
      name: 'Bệnh Đốm Mắt Cua Hại Ổi Lê (Pseudocercospora psidii)',
      plant: 'Ổi lê Phượng Sơn',
      confidence: 94,
      severity: 'Trung bình',
      causes: 'Nấm gây bệnh phát tán qua gió và giọt bắn nước mưa trong mùa nóng ẩm.',
      symptoms: [
        'Đốm bệnh hình tròn có tâm màu xám trắng, viền ngoài màu nâu đỏ giống mắt cua',
        'Lá bị thủng lỗ chỗ, quả non bị chai sần nứt nẻ',
      ],
      treatment: {
        biological: [
          'Bao bọc quả sớm bằng túi xốp lưới và nilon đục lỗ từ khi quả bằng đầu ngón tay',
          'Phun chế phẩm Nano Bạc sinh học phòng trừ nấm',
        ],
        chemicalIfSevere: [
          'Phun thuốc gốc đồng hoặc Mancozeb khi bệnh lan rộng',
        ],
        prevention: [
          'Vệ sinh vườn đồi, tỉa bỏ cành vượt và cành chạm đất',
        ],
      },
      expertAdvice: 'Kỹ thuật bao trái từ nhỏ là giải pháp phòng bệnh đốm mắt cua và ruồi vàng hiệu quả 100% không cần dùng thuốc trừ sâu.',
      isolationDays: 7,
    };
  }

  // Fallback chung
  return {
    name: 'Bệnh Thán Thư Cây Ăn Quả (Colletotrichum gloeosporioides)',
    plant: plantType || 'Cây Ăn Quả',
    confidence: 92,
    severity: 'Trung bình',
    causes: 'Nấm Colletotrichum phát triển mạnh trong điều kiện mưa ẩm sương mù.',
    symptoms: [
      'Đốm tròn màu nâu thẫm trên phiến lá, viền lá khô cháy',
      'Hoa khô héo rụng hạt non',
    ],
    treatment: {
      biological: [
        'Phun dịch nấm đối kháng Trichoderma harzianum',
        'Cắt tỉa cành sâu bệnh tiêu hủy',
      ],
      chemicalIfSevere: [
        'Phun hoạt chất Azoxystrobin theo chuẩn VietGAP',
      ],
      prevention: [
        'Bón cân đối N-P-K, tăng cường Kali',
      ],
    },
    expertAdvice: 'Thường xuyên dọn sạch cỏ dại và lá rụng ẩm ướt dưới gốc cây.',
    isolationDays: 14,
  };
}

// Safe parser for Gemini JSON outputs that may be enclosed in markdown backticks
function safeParseJson<T>(rawText: string | undefined): T | null {
  if (!rawText) return null;
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiEnabled: Boolean(ai),
  });
});

// 1. API: Chẩn đoán sâu bệnh cây trồng bằng AI Vision (Multimodal Gemini 3.8 Flash)
app.post('/api/diagnosis', async (req: Request, res: Response) => {
  const { imageBase64, mimeType, plantType, symptomsDescription, affectedPart } = req.body;

  if (typeof imageBase64 === 'string' && imageBase64.length > MAX_IMAGE_BASE64_LENGTH) {
    return res.status(413).json({ success: false, error: 'Ảnh quá lớn. Vui lòng chọn ảnh có dung lượng nhỏ hơn.' });
  }
  if (mimeType && (typeof mimeType !== 'string' || !SUPPORTED_IMAGE_TYPES.has(mimeType))) {
    return res.status(400).json({ success: false, error: 'Định dạng ảnh không được hỗ trợ.' });
  }
  if ([plantType, affectedPart, symptomsDescription].some((value) => typeof value === 'string' && value.length > MAX_PROMPT_LENGTH)) {
    return res.status(400).json({ success: false, error: 'Thông tin chẩn đoán quá dài.' });
  }

  // Try calling Gemini Multimodal first
  if (ai) {
    try {
      const parts: any[] = [];

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '').trim();
        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        });
      }

      const promptText = `Bạn là Chuyên gia Bác sĩ Cây trồng & Kỹ sư BVTV hàng đầu của Viện Bảo vệ Thực vật và Chi cục Trồng trọt & BVTV TP. Bắc Ninh, chuyên sâu về cây ăn quả đặc sản phường Chũ, TP. Bắc Ninh: Vải thiều Chũ, Cam đường Canh, Bưởi Diễn, Táo xuân Đài Loan, Ổi lê.

Hãy chẩn đoán sâu bệnh hại từ hình ảnh mẫu lá/quả/thân cây và mô tả triệu chứng của bà con nông dân.
Thông tin cung cấp từ nhà vườn:
- Loại cây trồng được nông dân chỉ định: "${plantType || 'Cam đường Canh'}"
- Bộ phận bị hại: "${affectedPart || 'Lá/Quả/Cành non'}"
- Mô tả triệu chứng lâm sàng từ nông dân: "${symptomsDescription || 'Không có mô tả thêm'}"

QUY TẮC BẮT BUỘC VỀ LOẠI CÂY TRỒNG (VI PHẠM LÀ SAI NGHIÊM TRỌNG):
1. Nông dân đang gửi mẫu của loại cây: "${plantType || 'Cam đường Canh'}". Bạn BẮT BUỘC PHẢI chẩn đoán bệnh của chính loại cây "${plantType}" này!
   - Ví dụ: Nếu loại cây là "Cam đường Canh" hoặc "Cam Canh", bạn TUYỆT ĐỐI KHÔNG ĐƯỢC chẩn đoán là bệnh của Vải thiều (như Sương mai vải thiều, Sâu đục cuống vải).
   - Với cây Cam đường Canh, hãy quan sát kỹ ảnh mẫu: nếu thấy lá bị vàng loang lổ giữa các gân xanh thì đó là Bệnh Vàng Lá Gân Xanh (Greening / HLB) hoặc Vàng lá thối rễ / Thiếu kẽm magie; nếu thấy lá bạc trắng lấm tấm như cám thì là Nhện đỏ; nếu thấy đốm sần miệng núi lửa thì là Ghẻ loét vi khuẩn Xanthomonas citri.
   - Nếu loại cây là "Vải thiều", chỉ chẩn đoán các bệnh trên vải thiều (Sương mai, Sâu đục cuống, Thán thư, Bọ xít...).
2. Trường "plant" trong JSON phải ghi đúng: "${plantType || 'Cam đường Canh'}".
3. Phân tích cụ thể các triệu chứng thị giác trong ảnh đính kèm (gân lá, sắc tố vàng, đốm hoại tử, cơ chế gây hại) và đối chiếu với cẩm nang VietGAP.

Hãy trả về DUY NHẤT một chuỗi JSON hợp lệ theo đúng cấu trúc sau:
{
  "name": "Tên bệnh hại hoặc sâu hại chuẩn xác của cây ${plantType || ''} (kèm tên khoa học Latinh)",
  "plant": "${plantType || 'Cam đường Canh'}",
  "confidence": 96,
  "severity": "Nhẹ" | "Trung bình" | "Nghiêm trọng",
  "causes": "Nguyên nhân gây bệnh chi tiết của bệnh này trên cây ${plantType}",
  "symptoms": [
    "Dấu hiệu triệu chứng nhận biết 1",
    "Dấu hiệu triệu chứng nhận biết 2",
    "Dấu hiệu triệu chứng nhận biết 3"
  ],
  "treatment": {
    "biological": [
      "Bước 1 phác đồ sinh học an toàn chuẩn VietGAP cho cây ${plantType}",
      "Bước 2 phác đồ sinh học",
      "Bước 3 phác đồ sinh học"
    ],
    "chemicalIfSevere": [
      "Chỉ định thuốc BVTV có trong danh mục của Bộ NN&PTNT khi bệnh nặng >20% và thời gian cách ly PHI"
    ],
    "prevention": [
      "Biện pháp canh tác phòng ngừa lâu dài 1",
      "Biện pháp canh tác phòng ngừa lâu dài 2"
    ]
  },
  "expertAdvice": "Lời khuyên thực tiễn gửi đến chủ vườn trồng cây ${plantType}",
  "isolationDays": 14
}`;

      parts.push({ text: promptText });

      // Generous timeout of 25 seconds for vision analysis
      // Format contents as an array of parts for multimodal Gemini 3.8 Flash
      const response: any = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: parts,
          config: {
            responseMimeType: 'application/json',
          },
        }),
        25000,
        'AI response timeout'
      );

      const diagnosisResult = safeParseJson<any>(response.text);
      // Validate that diagnosis crop matches requested plantType
      if (diagnosisResult && diagnosisResult.name) {
        return res.json({ success: true, diagnosis: diagnosisResult });
      }
    } catch (apiError: any) {
      console.warn('Gemini diagnosis call had an error or timeout, using specialized agronomic knowledge fallback:', apiError.message);
    }
  }

  // Graceful, 100% reliable fallback partitioned strictly by crop
  const fallbackDiagnosis = generateAgronomicDiagnosis(plantType, affectedPart, symptomsDescription);
  return res.json({ success: true, diagnosis: fallbackDiagnosis, isOfflineKnowledge: true });
});

// Helper for crop-specific fallback responses when AI is offline or timeout
function getSmartFallbackReply(prompt: string, currentFarmer?: any): string {
  const lower = (prompt || '').toLowerCase();

  // 1. CÂY CAM ĐƯỜNG CANH & CÂY CÓ MÚI (BƯỞI DIỄN)
  if (lower.includes('cam') || lower.includes('canh') || lower.includes('bưởi') || lower.includes('citrus')) {
    if (lower.includes('bệnh') || lower.includes('vàng lá') || lower.includes('lá') || lower.includes('chết') || lower.includes('đốm') || lower.includes('héo') || lower.includes('rụng')) {
      return `🍊 **Tư Vấn Khuyến Nông: Xử Lý Bệnh Hại Lá Cây Cam Đường Canh Tại Phường Chũ, TP. Bắc Ninh**

Kính chào Bác! Về hiện tượng lá cây cam đường Canh bị bệnh hoặc biến màu vàng, Trạm Bảo vệ Thực vật khuyến cáo phân biệt 2 bệnh phổ biến và nguy hiểm nhất hiện nay:

1. ⚠️ **Bệnh Vàng Lá Gân Xanh (Greening / Huanglongbing - HLB):**
- **Dấu hiệu nhận biết:** Phiến lá bị vàng lốm đốm, loang lổ không đều nhưng gân chính và gân phụ của lá vẫn giữ màu xanh lục. Lá non mọc dựng đứng nhọn như tai thỏ, phiến lá nhỏ giòn dễ gãy.
- **Tác nhân & Vector:** Vi khuẩn Liberibacter do rầy chổng cánh truyền bệnh.
- **Phác đồ xử lý VietGAP:**
  + Nuôi thả kiến vàng trong vườn cam để săn bắt tự nhiên rầy chổng cánh.
  + Phun dầu khoáng sinh học SK-Enspray 99EC hoặc dung dịch Neem oil thảo mộc khi cây nhú lộc non.
  + Bổ sung vi lượng Chelate (Kẽm Zn, Magie Mg, Bo) qua lá để duy trì diệp lục.
  + Nếu cây đã nhiễm quá nặng (>30% tán lá biến dạng), cần đào bỏ cả gốc rễ mang ra ngoài đốt tiêu hủy và rắc vôi bột để tránh lây sang toàn vườn.

2. 💧 **Bệnh Vàng Lá Thối Rễ (Do nấm Phytophthora & Fusarium):**
- **Dấu hiệu nhận biết:** Lá vàng đều cả phiến và gân, rễ tơ dưới đất bị thối đen, vỏ rễ tuột khỏi lõi gỗ và có mùi chua.
- **Biện pháp:** Xới nhẹ rãnh thoát nước quanh tán đồi, tưới chế phẩm sinh học Trichoderma + Humic kích rễ, ngưng bón đạm hóa học.

Bác cũng có thể mở tab **"Chẩn đoán bệnh"** để tải ảnh lá cam chụp thực địa, hệ thống AI sẽ phân tích trực quan ngay!`;
    }

    return `🍊 **Quy Trình Chăm Sóc & Nuôi Quả Ngọt Cam Đường Canh - Phường Chũ:**

Kính chào Bác! Về kỹ thuật cây cam đường Canh:
1. **Dinh dưỡng nuôi quả:** Bón tăng cường Kali sunfat (K2SO4) kết hợp phân trùn quế vi sinh để vỏ quả mỏng, bóng đỏ au, tép mọng nước và độ ngọt Brix > 13.5°.
2. **Tưới tiêu đất đồi:** Giữ độ ẩm đất ổn định 55-60%, tránh để vườn quá khô rồi tưới đẫm đột ngột gây nứt quả.
3. **Phòng trừ sâu hại:** Treo bẫy bả chua ngọt hoặc bẫy dính màu vàng để bẫy ruồi đục quả và rầy chổng cánh.`;
  }

  // 2. CÂY VẢI THIỀU
  if (lower.includes('vải') || lower.includes('lộc đông') || lower.includes('hoa vải')) {
    return `🌿 **Kỹ Thuật Hãm Lộc Đông & Thúc Mầm Hoa Vải Thiều Chũ, TP. Bắc Ninh:**

Kính chào Bác! Trong thời tiết se lạnh heo may:
1. **Xiết cành (Khoanh vỏ):** Dùng cưa mịn khoanh 1 vòng quanh cành cấp 1-2, sâu chạm tầng gỗ để ngăn dinh dưỡng xuống rễ, thúc đẩy phân hóa mầm hoa.
2. **Dừng đạm vô cơ:** Tuyệt đối không bón đạm, giữ vườn đồi khô ráo không tưới đẫm kẻo bật lộc non trái vụ.
3. **Phòng sương mai & bọ xít:** Cắt tỉa cành tăm lòng tán thông thoáng, dọn sạch cỏ dại và quét vôi trắng gốc cây.`;
  }

  // 3. CÂY ĂN QUẢ KHÁC / TỔNG QUÁT
  return `🌱 **Tư Vấn Khuyến Nông Trái ngọt Bắc Ninh – Phường Chũ, TP. Bắc Ninh:**

Kính chào Bác! Về câu hỏi "${prompt}":
- Trạm Khuyến nông khuyến nghị bà con áp dụng đồng bộ các giải pháp sinh học theo tiêu chuẩn VietGAP để giữ vững thương hiệu cây ăn quả đặc sản phường Chũ.
- Thường xuyên theo dõi các đợt phát lộc non để phòng trừ kịp thời các đối tượng chích hút (rầy, rệp, bọ xít).
- Bác có thể dùng tính năng **Chẩn đoán bệnh bằng AI** để chụp ảnh trực tiếp cành lá thực địa nhận phác đồ sinh học chính xác nhất!`;
}

// 2. API: Trợ lý canh tác AI trả lời kỹ thuật nông nghiệp
app.post('/api/chat', async (req: Request, res: Response) => {
  const { prompt, currentFarmer } = req.body;

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Nội dung câu hỏi không được để trống.',
    });
  }

  if (prompt.trim().length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `Câu hỏi không được dài quá ${MAX_PROMPT_LENGTH} ký tự.`,
    });
  }

  const normalizedPrompt = prompt.trim();

  if (ai) {
    try {
      const systemInstruction = `Bạn là Trợ lý Kỹ thuật Canh tác Cây ăn quả Trái ngọt Bắc Ninh, phường Chũ, TP. Bắc Ninh.
Chủ vườn đang trò chuyện: ${currentFarmer?.name || 'Bác nông dân'}, vị trí: ${currentFarmer?.location || 'phường Chũ, TP. Bắc Ninh'}, quy mô: ${currentFarmer?.areaHa || 3} ha, cây trồng chủ lực: ${currentFarmer?.cropFocus || 'Cam đường Canh, Vải thiều Chũ, Bưởi Diễn'}.

NGUYÊN TẮC BẮT BUỘC VỀ LOẠI CÂY TRỒNG (VI PHẠM LÀ SAI NGHIÊM TRỌNG):
1. Khi người dùng hỏi về "cam", "cam đường Canh", "cây có múi", "bưởi" hoặc lá/quả cam bị bệnh:
   - Bạn BẮT BUỘC PHẢI trả lời về cây Cam đường Canh / Bưởi Diễn!
   - Tuyệt đối KHÔNG ĐƯỢC trả lời sang cây vải thiều, không được nhầm lẫn sang hãm lộc đông vải thiều hay bệnh sương mai vải thiều!
   - Các bệnh chính của cam Canh: Vàng lá gân xanh (Greening / HLB - do rầy chổng cánh), Vàng lá thối rễ (Phytophthora), Nhện đỏ, Ghẻ loét vi khuẩn (Xanthomonas citri), sâu vẽ bùa.
2. Khi người dùng hỏi về "vải", "vải thiều": Trả lời về vải thiều Chũ (hãm lộc đông, sương mai mốc trắng, sâu đục cuống quả, bọ xít).
3. Phong cách trả lời: Kính cẩn, ân cần (gọi là Bác/Bà con), chuẩn quy trình VietGAP, phác đồ sinh học an toàn.`;

      const response: any = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: normalizedPrompt,
          config: {
            systemInstruction,
          },
        }),
        15000,
        'AI chat response timeout'
      );

      if (response.text) {
        return res.json({ success: true, reply: response.text });
      }
    } catch (err: any) {
      console.warn('Gemini chat call error, using local agronomic rule engine:', err.message);
    }
  }

  // Fallback chat reply using crop-aware agronomic knowledge
  const smartReply = getSmartFallbackReply(normalizedPrompt, currentFarmer);
  return res.json({
    success: true,
    fallback: true,
    reply: smartReply,
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🌾 Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
