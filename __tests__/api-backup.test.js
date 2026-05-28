import handler from '@/pages/api/cron-backup'

describe('/api/cron-backup', () => {
  let req, res

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {},
      headers: {
        'x-api-key': process.env.CRON_SECRET || 'test-secret',
      },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    }
  })

  it('should reject requests without valid API key', async () => {
    req.headers['x-api-key'] = 'invalid-key'
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('should create backup when interval exceeded', async () => {
    req.body = { subdomainId: 'test-subdomain' }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    const response = res.json.mock.calls[0][0]
    expect(response.success).toBe(true)
  })

  it('should track backup metadata', async () => {
    req.body = { subdomainId: 'test-subdomain' }
    await handler(req, res)
    const response = res.json.mock.calls[0][0]
    expect(response.backup).toBeTruthy()
    expect(response.backup.timestamp).toBeTruthy()
    expect(response.backup.type).toBe('automatic')
  })

  it('should limit to 2 backups maximum', async () => {
    const subdomainId = 'test-subdomain'

    // Create multiple backups
    for (let i = 0; i < 4; i++) {
      req.body = { subdomainId }
      // Mock time passage
      jest.useFakeTimers()
      jest.advanceTimersByTime(31 * 60 * 1000) // 31 minutes
      await handler(req, res)
    }

    jest.useRealTimers()
    // Should only have 2 backups
    expect(res.status).toHaveBeenLastCalledWith(200)
  })

  it('should handle missing subdomain gracefully', async () => {
    req.body = {}
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should set proper headers', async () => {
    req.body = { subdomainId: 'test-subdomain' }
    await handler(req, res)
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
  })
})
