import { PrismaClient } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/@prisma/client/default.js';
import { eventHandler, getQuery, createError } from 'file://C:/Users/THE%20SUN/Desktop/TienLoThan/node_modules/h3/dist/index.mjs';

const prisma = new PrismaClient();
const status_get = eventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const playerId = query.playerId;
    if (!playerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Thi\u1EBFu ID ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        resources: {
          include: {
            resource: true
          }
        }
      }
    });
    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kh\xF4ng t\xECm th\u1EA5y ng\u01B0\u1EDDi ch\u01A1i"
      });
    }
    const currentLevel = player.level;
    const currentExp = Number(player.experience);
    const nextLevelExp = calculateNextLevelExp(currentLevel);
    const progressPercentage = Math.min(currentExp / nextLevelExp * 100, 100);
    const realm = calculateRealm(currentLevel);
    const realmProgress = calculateRealmProgress(currentLevel);
    const huyenLucResource = player.resources.find((r) => r.resource.name === "huyen_luc");
    const huyenLucAmount = huyenLucResource ? Number(huyenLucResource.amount) : 0;
    return {
      success: true,
      data: {
        player: {
          ...player,
          experience: player.experience.toString()
        },
        cultivation: {
          currentLevel,
          currentExp,
          nextLevelExp,
          progressPercentage: Math.round(progressPercentage * 100) / 100,
          realm,
          realmProgress,
          canCultivate: huyenLucAmount >= 100,
          huyenLucAmount
        }
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});
function calculateNextLevelExp(level) {
  return Math.pow(level, 2) * 1440;
}
function calculateRealm(level) {
  if (level < 10) return "Ph\xE0m c\u1EA3nh";
  if (level < 50) return "Luy\u1EC7n Kh\xED c\u1EA3nh";
  if (level < 100) return "Tr\xFAc C\u01A1 c\u1EA3nh";
  if (level < 200) return "Kim \u0110an c\u1EA3nh";
  if (level < 500) return "Nguy\xEAn Anh c\u1EA3nh";
  if (level < 1e3) return "H\xF3a Th\u1EA7n c\u1EA3nh";
  return "H\u1EE3p Th\u1EC3 c\u1EA3nh";
}
function calculateRealmProgress(level) {
  const realmLevels = {
    "Ph\xE0m c\u1EA3nh": { min: 1, max: 9 },
    "Luy\u1EC7n Kh\xED c\u1EA3nh": { min: 10, max: 49 },
    "Tr\xFAc C\u01A1 c\u1EA3nh": { min: 50, max: 99 },
    "Kim \u0110an c\u1EA3nh": { min: 100, max: 199 },
    "Nguy\xEAn Anh c\u1EA3nh": { min: 200, max: 499 },
    "H\xF3a Th\u1EA7n c\u1EA3nh": { min: 500, max: 999 },
    "H\u1EE3p Th\u1EC3 c\u1EA3nh": { min: 1e3, max: 1e3 }
    // Cảnh giới cao nhất
  };
  const realm = calculateRealm(level);
  const realmInfo = realmLevels[realm];
  if (!realmInfo) {
    return { current: 0, max: 1, percentage: 0 };
  }
  const current = Math.min(level - realmInfo.min + 1, realmInfo.max - realmInfo.min + 1);
  const max = realmInfo.max - realmInfo.min + 1;
  const percentage = Math.round(current / max * 100);
  return { current, max, percentage };
}

export { status_get as default };
//# sourceMappingURL=status.get.mjs.map
