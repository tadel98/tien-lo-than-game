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
    let caveDwelling = await prisma.caveDwelling.findUnique({
      where: { playerId }
    });
    if (!caveDwelling) {
      caveDwelling = await prisma.caveDwelling.create({
        data: {
          playerId,
          name: "\u0110\u1ED9ng ph\u1EE7 s\u01A1 c\u1EA5p",
          level: 1,
          maxLevel: 10,
          spiritualEnergy: 0,
          maxSpiritualEnergy: 100,
          comfortLevel: 1,
          decorationLevel: 1,
          protectionLevel: 1,
          cultivationBonus: 0.1,
          // 10% bonus tu luyện
          resourceGeneration: 0.05,
          // 5% bonus tài nguyên
          isActive: true
        }
      });
    }
    const benefits = calculateCaveBenefits(caveDwelling.level);
    const upgradeCost = calculateUpgradeCost(caveDwelling.level);
    return {
      success: true,
      data: {
        caveDwelling: {
          ...caveDwelling,
          benefits,
          upgradeCost,
          canUpgrade: canUpgradeCave(caveDwelling)
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
function calculateCaveBenefits(level) {
  return {
    cultivationBonus: 0.1 + (level - 1) * 0.05,
    // 10% + 5% mỗi level
    resourceGeneration: 0.05 + (level - 1) * 0.02,
    // 5% + 2% mỗi level
    spiritualEnergyRegen: 10 + (level - 1) * 5,
    // 10 + 5 mỗi level
    maxSpiritualEnergy: 100 + (level - 1) * 50,
    // 100 + 50 mỗi level
    comfortBonus: 1 + (level - 1) * 0.5,
    // 1 + 0.5 mỗi level
    protectionBonus: 1 + (level - 1) * 0.3
    // 1 + 0.3 mỗi level
  };
}
function calculateUpgradeCost(level) {
  const baseCost = {
    linhThach: 1e3,
    nguyenThach: 500,
    huyenLuc: 200
  };
  const multiplier = Math.pow(1.5, level - 1);
  return {
    linhThach: Math.floor(baseCost.linhThach * multiplier),
    nguyenThach: Math.floor(baseCost.nguyenThach * multiplier),
    huyenLuc: Math.floor(baseCost.huyenLuc * multiplier)
  };
}
function canUpgradeCave(caveDwelling) {
  return caveDwelling.level < caveDwelling.maxLevel;
}

export { status_get as default };
//# sourceMappingURL=status.get.mjs.map
