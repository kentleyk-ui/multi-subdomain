import { generateToken, verifyToken, hashPassword, comparePassword } from '@/lib/auth'

describe('Authentication Library', () => {
  describe('hashPassword and comparePassword', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123'
      const hashed = await hashPassword(password)
      expect(hashed).not.toBe(password)
      expect(hashed.length).toBeGreaterThan(0)
    })

    it('should compare matching passwords', async () => {
      const password = 'testPassword123'
      const hashed = await hashPassword(password)
      const matches = await comparePassword(password, hashed)
      expect(matches).toBe(true)
    })

    it('should reject non-matching passwords', async () => {
      const password = 'testPassword123'
      const hashed = await hashPassword(password)
      const matches = await comparePassword('wrongPassword', hashed)
      expect(matches).toBe(false)
    })
  })

  describe('generateToken and verifyToken', () => {
    it('should generate valid JWT token', () => {
      const payload = { id: '123', email: 'test@example.com' }
      const token = generateToken(payload)
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
    })

    it('should verify valid token', () => {
      const payload = { id: '123', email: 'test@example.com' }
      const token = generateToken(payload)
      const decoded = verifyToken(token)
      expect(decoded).toBeTruthy()
      expect(decoded.id).toBe('123')
      expect(decoded.email).toBe('test@example.com')
    })

    it('should reject invalid token', () => {
      expect(() => {
        verifyToken('invalid.token.format')
      }).toThrow()
    })

    it('should reject expired token', () => {
      const payload = { id: '123', exp: Math.floor(Date.now() / 1000) - 3600 }
      const token = generateToken(payload)
      expect(() => {
        verifyToken(token)
      }).toThrow()
    })
  })
})
