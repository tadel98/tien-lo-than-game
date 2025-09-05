import { PrismaClient } from '@prisma/client';
import { e as eventHandler, c as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const prisma = new PrismaClient();
const seed_post = eventHandler(async (event) => {
  try {
    const resources = [
      {
        name: "tien_ngoc",
        displayName: "Ti\xEAn Ng\u1ECDc",
        description: "Lo\u1EA1i ti\u1EC1n t\u1EC7 cao c\u1EA5p trong game",
        icon: "\u{1F48E}",
        color: "#fbbf24"
      },
      {
        name: "tien_ngoc_khoa",
        displayName: "Ti\xEAn Ng\u1ECDc Kh\xF3a",
        description: "Ti\xEAn Ng\u1ECDc b\u1ECB kh\xF3a, kh\xF4ng th\u1EC3 s\u1EED d\u1EE5ng",
        icon: "\u{1F512}",
        color: "#6b7280"
      },
      {
        name: "linh_thach",
        displayName: "Linh Th\u1EA1ch",
        description: "Lo\u1EA1i ti\u1EC1n t\u1EC7 c\u01A1 b\u1EA3n trong game",
        icon: "\u{1F48E}",
        color: "#3b82f6"
      },
      {
        name: "nguyen_thach",
        displayName: "Nguy\xEAn Th\u1EA1ch",
        description: "Lo\u1EA1i ti\u1EC1n t\u1EC7 ph\u1ED5 bi\u1EBFn trong game",
        icon: "\u{1FAA8}",
        color: "#10b981"
      },
      {
        name: "huyen_luc",
        displayName: "Huy\u1EC1n L\u1EF1c",
        description: "N\u0103ng l\u01B0\u1EE3ng huy\u1EC1n b\xED \u0111\u1EC3 tu luy\u1EC7n",
        icon: "\u26A1",
        color: "#8b5cf6"
      }
    ];
    for (const resource of resources) {
      await prisma.resource.upsert({
        where: { name: resource.name },
        update: resource,
        create: resource
      });
    }
    const companions = [
      {
        name: "thien_hoa_tien_co",
        displayName: "Thi\xEAn Hoa Ti\xEAn C\u01A1",
        description: "M\u1ED9t ti\xEAn n\u1EEF xinh \u0111\u1EB9p v\u1EDBi s\u1EE9c m\u1EA1nh thi\xEAn nhi\xEAn",
        icon: "\u{1F338}",
        rarity: "legendary",
        basePower: 100
      },
      {
        name: "ngan_long",
        displayName: "Ng\xE2n Long",
        description: "R\u1ED3ng b\u1EA1c h\xF9ng m\u1EA1nh v\u1EDBi s\u1EE9c m\u1EA1nh nguy\xEAn t\u1ED1",
        icon: "\u{1F409}",
        rarity: "epic",
        basePower: 80
      }
    ];
    for (const companion of companions) {
      await prisma.companion.upsert({
        where: { name: companion.name },
        update: companion,
        create: companion
      });
    }
    const achievements = [
      {
        name: "first_login",
        displayName: "L\u1EA7n \u0110\u1EA7u Ti\xEAn",
        description: "\u0110\u0103ng nh\u1EADp l\u1EA7n \u0111\u1EA7u ti\xEAn",
        icon: "\u{1F389}",
        category: "general",
        points: 10
      },
      {
        name: "level_10",
        displayName: "Tu Luy\u1EC7n S\u01A1 C\u1EA5p",
        description: "\u0110\u1EA1t c\u1EA5p \u0111\u1ED9 10",
        icon: "\u2B50",
        category: "level",
        points: 50
      },
      {
        name: "first_companion",
        displayName: "B\u1EA1n \u0110\u1ED3ng H\xE0nh",
        description: "C\xF3 b\u1EA1n \u0111\u1ED3ng h\xE0nh \u0111\u1EA7u ti\xEAn",
        icon: "\u{1F465}",
        category: "companion",
        points: 30
      }
    ];
    for (const achievement of achievements) {
      await prisma.achievement.upsert({
        where: { name: achievement.name },
        update: achievement,
        create: achievement
      });
    }
    const quests = [
      {
        name: "tutorial_1",
        displayName: "H\u01B0\u1EDBng D\u1EABn C\u01A1 B\u1EA3n",
        description: "Ho\xE0n th\xE0nh h\u01B0\u1EDBng d\u1EABn c\u01A1 b\u1EA3n",
        category: "tutorial",
        difficulty: "easy",
        rewards: {
          experience: 100,
          resources: {
            linh_thach: 1e3
          }
        },
        requirements: {
          level: 1
        }
      },
      {
        name: "cultivation_1",
        displayName: "Tu Luy\u1EC7n \u0110\u1EA7u Ti\xEAn",
        description: "B\u1EAFt \u0111\u1EA7u qu\xE1 tr\xECnh tu luy\u1EC7n",
        category: "cultivation",
        difficulty: "easy",
        rewards: {
          experience: 200,
          resources: {
            huyen_luc: 100
          }
        },
        requirements: {
          level: 1
        }
      }
    ];
    for (const quest of quests) {
      const questData = {
        ...quest,
        rewards: JSON.stringify(quest.rewards),
        requirements: JSON.stringify(quest.requirements)
      };
      await prisma.quest.upsert({
        where: { name: quest.name },
        update: questData,
        create: questData
      });
    }
    const configs = [
      {
        key: "max_level",
        value: "1000",
        type: "number",
        category: "player"
      },
      {
        key: "experience_multiplier",
        value: "1.0",
        type: "number",
        category: "player"
      },
      {
        key: "resource_cap",
        value: "999999999",
        type: "number",
        category: "resources"
      }
    ];
    for (const config of configs) {
      await prisma.gameConfig.upsert({
        where: { key: config.key },
        update: config,
        create: config
      });
    }
    return {
      success: true,
      message: "Seed d\u1EEF li\u1EC7u th\xE0nh c\xF4ng"
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "L\u1ED7i seed d\u1EEF li\u1EC7u"
    });
  }
});

export { seed_post as default };
//# sourceMappingURL=seed.post.mjs.map
