import { ProduceItem, FarmerAccount, CalendarTask, WateringLog, FertilizingLog, PestProtectionLog, GeneralCultivationLog } from '../types/agriculture';
import { CALENDAR_TASKS } from '../data/mockData';

export type CultivationLogType = 'watering' | 'fertilizing' | 'pest' | 'general';

export type CultivationLogInput =
  | Pick<WateringLog, 'date' | 'method' | 'amountLiters' | 'waterSource' | 'note'>
  | Pick<FertilizingLog, 'date' | 'fertilizerName' | 'dosage' | 'stage' | 'organicCertified' | 'note'>
  | Pick<PestProtectionLog, 'date' | 'productUsed' | 'targetPest' | 'isolationDaysBeforeHarvest'>
  | GeneralCultivationLog;

/**
 * Maps a crop name to produce item in produceList
 */
export function getFarmerProduce(farmer: FarmerAccount, produceList: ProduceItem[]): ProduceItem | undefined {
  return produceList.find(
    (p) =>
      p.farmer.toLowerCase().includes(farmer.name.toLowerCase()) ||
      p.vietgapCode === farmer.pucCode ||
      p.farmerProfile?.name.toLowerCase().includes(farmer.name.toLowerCase())
  ) || produceList[0];
}

/**
 * Builds synchronized CalendarTasks from the farmer's produce cultivation logs and seasonal tasks
 */
export function getSynchronizedTasksForFarmer(
  farmer: FarmerAccount,
  produceList: ProduceItem[],
  customTasks: CalendarTask[] = []
): CalendarTask[] {
  const product = getFarmerProduce(farmer, produceList);
  const tasks: CalendarTask[] = [];

  // 1. Sync custom tasks added by farmer in session
  customTasks.forEach((t) => tasks.push(t));

  if (product && product.cultivationLog) {
    const cropName = product.name.split('–')[0].split('-')[0].trim();

    // 2. Synchronize Watering Logs from product.cultivationLog
    product.cultivationLog.watering.forEach((w, idx) => {
      tasks.push({
        id: `sync-water-${product.id}-${idx}`,
        crop: cropName,
        title: `Tưới nước: ${w.method} (${w.amountLiters})`,
        date: w.date,
        stage: 'Nuôi quả & bao trái',
        priority: 'Trung bình',
        completed: true,
        assignedTo: farmer.name,
        instructions: `Nguồn nước: ${w.waterSource}. ${w.note}`,
        materialsNeeded: ['Hệ thống tưới tự động', 'Nước sạch qua kiểm nghiệm'],
        logType: 'watering',
        logDetail: `${w.amountLiters} · ${w.waterSource}`,
      });
    });

    // 3. Synchronize Fertilizing Logs from product.cultivationLog
    product.cultivationLog.fertilizing.forEach((f, idx) => {
      tasks.push({
        id: `sync-fert-${product.id}-${idx}`,
        crop: cropName,
        title: `Bón phân: ${f.fertilizerName} (${f.dosage})`,
        date: f.date,
        stage: f.stage || 'Tích lũy dinh dưỡng & Hãm lộc đông',
        priority: 'Cao',
        completed: true,
        assignedTo: farmer.name,
        instructions: `Giai đoạn: ${f.stage}. Liều lượng: ${f.dosage}. ${f.note}`,
        materialsNeeded: [f.fertilizerName, 'Dụng cụ bón phân theo rãnh'],
        logType: 'fertilizing',
        logDetail: `${f.dosage} · ${f.organicCertified ? 'Chuẩn hữu cơ' : 'Khoáng vi sinh'}`,
      });
    });

    // 4. Synchronize Pest Protection Logs from product.cultivationLog
    product.cultivationLog.pestProtection.forEach((p, idx) => {
      tasks.push({
        id: `sync-pest-${product.id}-${idx}`,
        crop: cropName,
        title: `Bảo vệ thực vật sinh học: ${p.productUsed}`,
        date: p.date,
        stage: 'Nuôi quả & bao trái',
        priority: 'Cao',
        completed: true,
        assignedTo: farmer.name,
        instructions: `Đối tượng: ${p.targetPest}. Thời gian cách ly PHI: ${p.isolationDaysBeforeHarvest} ngày (${p.status}). Đã kiểm định an toàn VietGAP.`,
        materialsNeeded: [p.productUsed, 'Bảo hộ lao động phun sinh học'],
        logType: 'pest',
        logDetail: `Cách ly ${p.isolationDaysBeforeHarvest} ngày · ${p.status}`,
      });
    });

    // 5. Synchronize general seasonal work recorded by the farmer.
    product.cultivationLog.general?.forEach((log, idx) => {
      tasks.push({
        id: `sync-general-${product.id}-${idx}`,
        crop: cropName,
        title: log.title,
        date: log.date,
        stage: 'Nuôi quả & bao trái',
        priority: 'Trung bình',
        completed: true,
        assignedTo: farmer.name,
        instructions: log.instructions,
        materialsNeeded: log.materials
          .split(',')
          .map((material) => material.trim())
          .filter(Boolean),
        logType: 'general',
        logDetail: log.materials,
      });
    });
  }

  // 6. Add matching seasonal tasks from CALENDAR_TASKS
  CALENDAR_TASKS.forEach((t) => {
    // Check if task is already in list or matches farmer's crops
    const isAlready = tasks.some((existing) => existing.title === t.title);
    if (!isAlready) {
      tasks.push({
        ...t,
        logType: 'general',
      });
    }
  });

  return tasks;
}

/**
 * Appends a new cultivation log to the farmer's product in produceList,
 * keeping produceList and calendar 100% synchronized!
 */
export function addCultivationLogToProduce(
  produceList: ProduceItem[],
  farmer: FarmerAccount,
  logType: CultivationLogType,
  logData: CultivationLogInput
): ProduceItem[] {
  const targetProduct = getFarmerProduce(farmer, produceList);
  if (!targetProduct) return produceList;

  return produceList.map((item) => {
    if (item.id !== targetProduct.id) return item;

    const currentLogs = item.cultivationLog || {
      watering: [],
      fertilizing: [],
      pestProtection: [],
    };
    const generalLogs = currentLogs.general || [];

    if (logType === 'watering') {
      const data = logData as Pick<WateringLog, 'date' | 'method' | 'amountLiters' | 'waterSource' | 'note'>;
      const newWatering: WateringLog = {
        date: data.date || new Date().toLocaleDateString('vi-VN'),
        method: data.method || 'Tưới nhỏ giọt quanh tán cây',
        amountLiters: data.amountLiters || '35 lít/gốc',
        waterSource: data.waterSource || 'Nước sạch kiểm định VietGAP',
        note: data.note || 'Duy trì ẩm độ đất chuẩn',
      };
      return {
        ...item,
        cultivationLog: {
          ...currentLogs,
          watering: [newWatering, ...currentLogs.watering],
        },
      };
    }

    if (logType === 'fertilizing') {
      const data = logData as Pick<FertilizingLog, 'date' | 'fertilizerName' | 'dosage' | 'stage' | 'organicCertified' | 'note'>;
      const newFertilizing: FertilizingLog = {
        date: data.date || new Date().toLocaleDateString('vi-VN'),
        fertilizerName: data.fertilizerName || 'Phân bón hữu cơ sinh học vi sinh',
        dosage: data.dosage || '300g/gốc',
        stage: data.stage || 'Nuôi quả & bao trái',
        organicCertified: Boolean(data.organicCertified ?? true),
        note: data.note || 'Bón rải quanh hình chiếu tán cây',
      };
      return {
        ...item,
        cultivationLog: {
          ...currentLogs,
          fertilizing: [newFertilizing, ...currentLogs.fertilizing],
        },
      };
    }

    if (logType === 'pest') {
      const data = logData as Pick<PestProtectionLog, 'date' | 'productUsed' | 'targetPest' | 'isolationDaysBeforeHarvest'>;
      const newPest: PestProtectionLog = {
        date: data.date || new Date().toLocaleDateString('vi-VN'),
        productUsed: data.productUsed || 'Chế phẩm thảo mộc sinh học tỏi ớt gừng',
        targetPest: data.targetPest || 'Xua đuổi ruồi đục quả và rệp sáp',
        isBiological: true,
        isolationDaysBeforeHarvest: Number(data.isolationDaysBeforeHarvest) || 45,
        status: 'Đã hoàn thành cách ly',
        safetyVerified: true,
      };
      return {
        ...item,
        cultivationLog: {
          ...currentLogs,
          pestProtection: [newPest, ...currentLogs.pestProtection],
        },
      };
    }

    if (logType === 'general') {
      const data = logData as GeneralCultivationLog;
      const newGeneralLog: GeneralCultivationLog = {
        date: data.date || new Date().toLocaleDateString('vi-VN'),
        title: data.title || 'Chăm sóc vườn theo chuẩn VietGAP',
        instructions: data.instructions || 'Thực hiện theo quy trình canh tác an toàn.',
        materials: data.materials || 'Dụng cụ làm vườn',
      };
      return {
        ...item,
        cultivationLog: {
          ...currentLogs,
          general: [newGeneralLog, ...generalLogs],
        },
      };
    }

    return item;
  });
}
