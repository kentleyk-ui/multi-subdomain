import handler from '@/pages/api/auth'
import { withAuth } from '@/lib/auth'

describe('/api/auth-login', () => {
  let req, res

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {},
      headers: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    }
  })

  it('should return 400 if action is missing', async () => {
    req.body = { action: '' }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('should register new user', async () => {
    req.body = {
      action: 'register',
      email: 'newuser@example.com',
      password: 'Password123!',
    }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalled()
    const response = res.json.mock.calls[0][0]
    expect(response.token).toBeTruthy()
  })

  it('should reject duplicate email on register', async () => {
    req.body = {
      action: 'register',
      email: 'duplicate@example.com',
      password: 'Password123!',
    }
    await handler(req, res)
    req.body = {
      action: 'register',
      email: 'duplicate@example.com',
      password: 'Password456!',
    }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(409)
  })

  it('should login existing user', async () => {
    req.body = {
      action: 'register',
      email: 'testuser@example.com',
      password: 'TestPass123!',
    }
    await handler(req, res)

    req.body = {
      action: 'login',
      email: 'testuser@example.com',
      password: 'TestPass123!',
    }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('should reject login with wrong password', async () => {
    req.body = {
      action: 'register',
      email: 'user@example.com',
      password: 'CorrectPass123!',
    }
    await handler(req, res)

    req.body = {
      action: 'login',
      email: 'user@example.com',
      password: 'WrongPass123!',
    }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('should reject login for nonexistent user', async () => {
    req.body = {
      action: 'login',
      email: 'nonexistent@example.com',
      password: 'SomePassword123!',
    }
    await handler(req, res)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('should set CORS headers', async () => {
    req.body = { action: 'register', email: 'test@example.com', password: 'Pass123!' }
    await handler(req, res)
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
  })
})
