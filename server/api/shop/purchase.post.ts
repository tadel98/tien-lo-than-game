
import { readBody, eventHandler, createError } from 'h3'
const { getPrismaClient } = require('../../../lib/prisma')



export default eventHandler(async (event) => {
  try {
    
    const prisma = await getPrismaClient()
const body = await readBody(event)
    const { playerId, shopId, itemId, quantity = 1 } = body

    if (!playerId || !shopId || !itemId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Lấy thông tin người chơi
    const player = await (prisma as any).player.findUnique({
      where: { id: playerId },
      include: {
        resources: {
          include: {
            resource: true
          }
        }
      }
    })

    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người chơi'
      })
    }

    // Lấy thông tin item trong shop
    const shopItem = await (prisma as any).shopItem.findFirst({
      where: {
        id: itemId,
        shopId,
        isActive: true
      },
      include: {
        shop: true
      }
    })

    if (!shopItem) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy item trong cửa hàng'
      })
    }

    // Kiểm tra cấp độ yêu cầu
    if (player.level < shopItem.level) {
      throw createError({
        statusCode: 400,
        statusMessage: `Cần cấp độ ${shopItem.level} để mua item này`
      })
    }

    // Kiểm tra số lượng còn lại
    if (shopItem.stock !== -1 && shopItem.stock < quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Không đủ hàng trong kho'
      })
    }

    // Tính tổng giá
    const totalCost = shopItem.price * quantity

    // Kiểm tra tiền tệ
    const currencyResource = player.resources.find(r => r.resource.name === shopItem.currency)
    if (!currencyResource) {
      throw createError({
        statusCode: 400,
        statusMessage: `Không tìm thấy tài nguyên ${shopItem.currency}`
      })
    }
    
    if (Number(currencyResource.amount) < totalCost) {
      throw createError({
        statusCode: 400,
        statusMessage: `Không đủ ${shopItem.currency} để mua. Cần ${totalCost}, có ${Number(currencyResource.amount)}`
      })
    }

    // Thực hiện giao dịch
    await prisma.$transaction(async (tx) => {
      // Trừ tiền
      await tx.playerResource.update({
        where: { id: currencyResource?.id },
        data: {
          amount: Number(currencyResource.amount) - totalCost
        }
      })

      // Cập nhật stock (nếu có giới hạn)
      if (shopItem.stock !== -1) {
        await (tx as any).shopItem.update({
          where: { id: shopItem?.id },
          data: {
            stock: shopItem.stock - quantity
          }
        })
      }

      // Thêm vào inventory
      const existingItem = await (tx as any).inventory.findFirst({
        where: {
          playerId,
          itemId: shopItem.itemId
        }
      })

      if (existingItem && shopItem.stackable) {
        await (tx as any).inventory.update({
          where: { id: existingItem?.id },
          data: {
            quantity: existingItem.quantity + quantity
          }
        })
      } else {
        await (tx as any).inventory.create({
          data: {
            playerId,
            itemType: shopItem.itemType,
            itemId: shopItem.itemId,
            name: shopItem.name,
            quantity,
            stackable: shopItem.stackable
          }
        })
      }

      // Ghi lịch sử mua hàng
      await (tx as any).purchaseHistory.create({
        data: {
          playerId,
          shopId,
          itemId: shopItem?.id,
          itemName: shopItem.displayName,
          quantity,
          price: shopItem.price,
          currency: shopItem.currency,
          totalCost
        }
      })
    })

    return {
      success: true,
      message: 'Mua hàng thành công',
      data: {
        item: shopItem.displayName,
        quantity,
        totalCost,
        currency: shopItem.currency
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server'
    })
  }
})


