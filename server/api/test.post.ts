import { eventHandler } from 'h3'

export default eventHandler(async (event) => {
  return {
    success: true,
    message: 'Test API working',
    method: event.method,
    timestamp: new Date().toISOString()
  }
})
