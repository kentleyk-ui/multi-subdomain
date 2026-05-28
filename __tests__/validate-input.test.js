import { validateDomain, validateSubdomain, validateHTML, validateEmail, detectXSS } from '@/pages/api/validate-input'

describe('Input Validation', () => {
  describe('validateDomain', () => {
    it('should validate correct domain names', () => {
      expect(validateDomain('example.com')).toBe(true)
      expect(validateDomain('sub.example.co.uk')).toBe(true)
      expect(validateDomain('my-domain.dev')).toBe(true)
    })

    it('should reject invalid domains', () => {
      expect(validateDomain('invalid domain')).toBe(false)
      expect(validateDomain('.com')).toBe(false)
      expect(validateDomain('domain..com')).toBe(false)
    })
  })

  describe('validateSubdomain', () => {
    it('should validate correct subdomains', () => {
      expect(validateSubdomain('blog')).toBe(true)
      expect(validateSubdomain('api-v2')).toBe(true)
      expect(validateSubdomain('sub_domain')).toBe(true)
    })

    it('should reject invalid subdomains', () => {
      expect(validateSubdomain('')).toBe(false)
      expect(validateSubdomain('-invalid')).toBe(false)
      expect(validateSubdomain('invalid-')).toBe(false)
      expect(validateSubdomain('inva@lid')).toBe(false)
    })
  })

  describe('validateHTML', () => {
    it('should allow safe HTML content', () => {
      const html = '<h1>Title</h1><p>Content</p>'
      expect(validateHTML(html)).toBe(true)
    })

    it('should reject script tags', () => {
      const html = '<h1>Title</h1><script>alert("xss")</script>'
      expect(validateHTML(html)).toBe(false)
    })

    it('should reject event handlers', () => {
      const html = '<img src="x" onerror="alert(1)">'
      expect(validateHTML(html)).toBe(false)
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid.email')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
    })
  })

  describe('detectXSS', () => {
    it('should detect common XSS patterns', () => {
      expect(detectXSS('<script>')).toBe(true)
      expect(detectXSS('javascript:')).toBe(true)
      expect(detectXSS('onerror=')).toBe(true)
      expect(detectXSS('onload=')).toBe(true)
    })

    it('should allow safe content', () => {
      expect(detectXSS('Hello World')).toBe(false)
      expect(detectXSS('Safe content here')).toBe(false)
    })
  })
})
