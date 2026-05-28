import rateLimit from '@/lib/rate-limit'

describe('Rate Limiting Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should allow requests within limit', () => {
    const middleware = rateLimit({ limit: 10, windowMs: 60000 })
    const result = middleware('127.0.0.1')

    expect(result.success).toBe(true)
    expect(result.remaining).toBeLessThanOrEqual(10)
    expect(result.reset).toBeTruthy()
  })

  it('should track request count per IP', () => {
    const middleware = rateLimit({ limit: 3, windowMs: 60000 })

    const ip = '192.168.1.1'
    const result1 = middleware(ip)
    const result2 = middleware(ip)
    const result3 = middleware(ip)

    expect(result1.remaining).toBe(2)
    expect(result2.remaining).toBe(1)
    expect(result3.remaining).toBe(0)
  })

  it('should reject requests exceeding limit', () => {
    const middleware = rateLimit({ limit: 2, windowMs: 60000 })

    const ip = '192.168.1.2'
    middleware(ip)
    middleware(ip)
    const result = middleware(ip)

    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should reset after time window', async () => {
    const middleware = rateLimit({ limit: 2, windowMs: 100 })

    const ip = '192.168.1.3'
    middleware(ip)
    middleware(ip)

    await new Promise(resolve => setTimeout(resolve, 150))

    const result = middleware(ip)
    expect(result.remaining).toBeGreaterThan(0)
  })

  it('should track separate limits per IP', () => {
    const middleware = rateLimit({ limit: 2, windowMs: 60000 })

    const result1 = middleware('10.0.0.1')
    const result2 = middleware('10.0.0.2')

    expect(result1.remaining).toBe(1)
    expect(result2.remaining).toBe(1)
  })
})
