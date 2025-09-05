import { PrismaClient } from '@prisma/client'
import { readBody, eventHandler, createError } from 'h3'

const prisma = new PrismaClient()

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { playerId, recipeId, quantity = 1 } = body

    if (!playerId || !recipeId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc'
      })
    }

    // Lấy thông tin người chơi
    const player = await (prisma as any).player.findUnique({
      where: { id: playerId },
      include: {
        inventory: true
      }
    })

    if (!player) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người chơi'
      })
    }

    // Lấy thông tin công thức
    const recipe = await (prisma as any).recipe.findUnique({
      where: { id: recipeId }
    })

    if (!recipe) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy công thức'
      })
    }

    // Parse nguyên liệu và kết quả
    const materials = JSON.parse(recipe.materials)
    const result = JSON.parse(recipe.result)

    // Kiểm tra nguyên liệu
    for (const [materialName, requiredAmount] of Object.entries(materials)) {
      const totalRequired = Number(requiredAmount) * quantity
      
      // Kiểm tra trong inventory
      const inventoryItem = player.inventory.find((item: any) => item.name === materialName)
      if (!inventoryItem || inventoryItem.quantity < totalRequired) {
        throw createError({
          statusCode: 400,
          statusMessage: `Không đủ nguyên liệu: ${materialName} (cần ${totalRequired}, có ${inventoryItem?.quantity || 0})`
        })
      }
    }

    // Thực hiện craft trong transaction
    const craftResult = await (prisma as any).$transaction(async (tx: any) => {
      // Trừ nguyên liệu
      for (const [materialName, requiredAmount] of Object.entries(materials)) {
        const totalRequired = Number(requiredAmount) * quantity
        
        // Tìm item trong inventory
        const inventoryItem = player.inventory.find((item: any) => item.name === materialName)
        
        // Cập nhật số lượng
        await tx.inventory.update({
          where: { id: inventoryItem.id },
          data: {
            quantity: inventoryItem.quantity - totalRequired
          }
        })
      }

      // Thêm kết quả
      for (const [resultName, resultAmount] of Object.entries(result)) {
        const totalResult = Number(resultAmount) * quantity
        
        // Tìm item trong inventory
        const existingItem = player.inventory.find((item: any) => item.name === resultName)
        
        if (existingItem) {
          // Cập nhật số lượng
          await tx.inventory.update({
            where: { id: existingItem.id },
            data: {
              quantity: existingItem.quantity + totalResult
            }
          })
        } else {
          // Tạo item mới
          await tx.inventory.create({
            data: {
              playerId,
              name: resultName,
              quantity: totalResult,
              type: 'crafted'
            }
          })
        }
      }

      // Ghi lại lịch sử craft
      await tx.craftingHistory.create({
        data: {
          playerId,
          recipeId,
          quantity,
          materials: JSON.stringify(materials),
          result: JSON.stringify(result),
          createdAt: new Date()
        }
      })

      return {
        success: true,
        message: 'Chế tạo thành công',
        materials: materials,
        result: result,
        quantity
      }
    })

    return craftResult
  } catch (error: any) {
    console.error('Craft error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Lỗi chế tạo'
    })
  }
})