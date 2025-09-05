import { PrismaClient } from '@prisma/client';
import { e as eventHandler, g as getQuery, c as createError } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

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
    const playerTalents = await prisma.playerTalent.findMany({
      where: { playerId },
      include: {
        talent: {
          include: {
            type: true
          }
        }
      }
    });
    const availableTalents = await prisma.talent.findMany({
      where: { isActive: true },
      include: {
        type: true
      }
    });
    const playerBuffs = await prisma.playerBuff.findMany({
      where: {
        playerId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: /* @__PURE__ */ new Date() } }
        ]
      },
      include: {
        buff: true
      }
    });
    let totalEffects = {
      attack: 0,
      defense: 0,
      speed: 0,
      hp: 0,
      mp: 0,
      luck: 0,
      wisdom: 0,
      strength: 0,
      agility: 0,
      vitality: 0,
      spirit: 0,
      expMultiplier: 1,
      dropRate: 1,
      critChance: 0,
      critDamage: 0
    };
    for (const playerTalent of playerTalents) {
      if (playerTalent.isUnlocked && playerTalent.isActive && playerTalent.talent.effects) {
        try {
          const effects = JSON.parse(playerTalent.talent.effects);
          const level = playerTalent.level;
          for (const [effect, value] of Object.entries(effects)) {
            if (totalEffects[effect] !== void 0) {
              if (typeof value === "number") {
                totalEffects[effect] += value * level;
              } else if (typeof value === "object" && value?.scaling) {
                totalEffects[effect] += (value?.base || 0) + (value?.scaling || 0) * level;
              }
            }
          }
        } catch (e) {
          console.error("Error parsing talent effects:", e);
        }
      }
    }
    for (const playerBuff of playerBuffs) {
      if (playerBuff.buff.effects) {
        try {
          const effects = JSON.parse(playerBuff.buff.effects);
          const stacks = playerBuff.stacks;
          for (const [effect, value] of Object.entries(effects)) {
            if (totalEffects[effect] !== void 0) {
              if (playerBuff.buff.stackable) {
                totalEffects[effect] += value * stacks;
              } else {
                totalEffects[effect] += value;
              }
            }
          }
        } catch (e) {
          console.error("Error parsing buff effects:", e);
        }
      }
    }
    return {
      success: true,
      data: {
        playerTalents: playerTalents.map((pt) => ({
          ...pt,
          talent: {
            ...pt.talent,
            effects: pt.talent.effects ? JSON.parse(pt.talent.effects) : {},
            requirements: pt.talent.requirements ? JSON.parse(pt.talent.requirements) : {}
          }
        })),
        availableTalents: availableTalents.map((t) => ({
          ...t,
          effects: t.effects ? JSON.parse(t.effects) : {},
          requirements: t.requirements ? JSON.parse(t.requirements) : {}
        })),
        playerBuffs: playerBuffs.map((pb) => ({
          ...pb,
          buff: {
            ...pb.buff,
            effects: pb.buff.effects ? JSON.parse(pb.buff.effects) : {}
          }
        })),
        totalEffects
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "L\u1ED7i server"
    });
  }
});

export { status_get as default };
//# sourceMappingURL=status.get.mjs.map
