describe('Multi-Subdomain Management E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  describe('Authentication Flow', () => {
    it('should register a new user', () => {
      cy.visit('http://localhost:3000/auth')
      cy.get('[data-testid="auth-register"]').click()
      cy.get('input[type="email"]').type('newuser@example.com')
      cy.get('input[type="password"]').type('SecurePassword123!')
      cy.get('button[type="submit"]').click()
      cy.url().should('include', '/dashboard')
    })

    it('should login existing user', () => {
      cy.visit('http://localhost:3000/auth')
      cy.get('input[type="email"]').type('testuser@example.com')
      cy.get('input[type="password"]').type('Password123!')
      cy.get('button[type="submit"]').click()
      cy.url().should('include', '/dashboard')
    })

    it('should reject invalid credentials', () => {
      cy.visit('http://localhost:3000/auth')
      cy.get('input[type="email"]').type('testuser@example.com')
      cy.get('input[type="password"]').type('WrongPassword')
      cy.get('button[type="submit"]').click()
      cy.get('[data-testid="error-message"]').should('be.visible')
    })
  })

  describe('Dashboard Navigation', () => {
    it('should display dashboard statistics', () => {
      cy.get('[data-testid="stats-subdomains"]').should('be.visible')
      cy.get('[data-testid="stats-pages"]').should('be.visible')
      cy.get('[data-testid="stats-backups"]').should('be.visible')
      cy.get('[data-testid="stats-certificates"]').should('be.visible')
    })

    it('should navigate to subdomains page', () => {
      cy.get('a[href*="/subdomains"]').click()
      cy.url().should('include', '/subdomains')
    })

    it('should navigate to backups page', () => {
      cy.get('a[href*="/backups"]').click()
      cy.url().should('include', '/backups')
    })

    it('should navigate to certificates page', () => {
      cy.get('a[href*="/certificates"]').click()
      cy.url().should('include', '/certificates')
    })
  })

  describe('Subdomain Management', () => {
    it('should create new subdomain', () => {
      cy.visit('http://localhost:3000/subdomains')
      cy.get('button[data-testid="create-subdomain"]').click()
      cy.get('input[name="subdomain"]').type('blog')
      cy.get('input[name="domain"]').type('example.com')
      cy.get('button[type="submit"]').click()
      cy.get('[data-testid="success-message"]').should('be.visible')
    })

    it('should display list of subdomains', () => {
      cy.visit('http://localhost:3000/subdomains')
      cy.get('[data-testid="subdomain-list"]').should('be.visible')
      cy.get('[data-testid="subdomain-item"]').should('have.length.greaterThan', 0)
    })

    it('should delete subdomain with confirmation', () => {
      cy.visit('http://localhost:3000/subdomains')
      cy.get('[data-testid="subdomain-delete"]').first().click()
      cy.get('[data-testid="confirm-delete"]').click()
      cy.get('[data-testid="success-message"]').should('be.visible')
    })

    it('should edit subdomain description', () => {
      cy.visit('http://localhost:3000/subdomains')
      cy.get('[data-testid="subdomain-edit"]').first().click()
      cy.get('textarea[name="description"]').clear().type('Updated description')
      cy.get('button[type="submit"]').click()
      cy.get('[data-testid="success-message"]').should('be.visible')
    })
  })

  describe('SSL Certificate Management', () => {
    it('should display SSL certificates list', () => {
      cy.visit('http://localhost:3000/certificates')
      cy.get('[data-testid="certificate-list"]').should('be.visible')
    })

    it('should show certificate details', () => {
      cy.visit('http://localhost:3000/certificates')
      cy.get('[data-testid="certificate-item"]').first().click()
      cy.get('[data-testid="cert-domain"]').should('be.visible')
      cy.get('[data-testid="cert-expiry"]').should('be.visible')
    })

    it('should renew SSL certificate', () => {
      cy.visit('http://localhost:3000/certificates')
      cy.get('[data-testid="renew-cert"]').first().click()
      cy.get('[data-testid="confirm-renew"]').click()
      cy.get('[data-testid="success-message"]').should('be.visible')
    })

    it('should sort certificates by status', () => {
      cy.visit('http://localhost:3000/certificates')
      cy.get('[data-testid="sort-status"]').click()
      cy.get('[data-testid="certificate-item"]').first().should('contain', 'Active')
    })
  })

  describe('Backup Management', () => {
    it('should display backup list', () => {
      cy.visit('http://localhost:3000/backups')
      cy.get('[data-testid="backup-list"]').should('be.visible')
    })

    it('should create manual backup', () => {
      cy.visit('http://localhost:3000/backups')
      cy.get('[data-testid="create-backup"]').click()
      cy.get('[data-testid="backup-name"]').type('Manual Backup')
      cy.get('button[type="submit"]').click()
      cy.get('[data-testid="success-message"]').should('be.visible')
    })

    it('should restore from backup', () => {
      cy.visit('http://localhost:3000/backups')
      cy.get('[data-testid="restore-backup"]').first().click()
      cy.get('[data-testid="confirm-restore"]').click()
      cy.get('[data-testid="success-message"]').should('be.visible')
    })
  })

  describe('Rate Limiting', () => {
    it('should handle rate limit errors gracefully', () => {
      cy.visit('http://localhost:3000')
      // Make rapid requests to trigger rate limit
      for (let i = 0; i < 150; i++) {
        cy.request({ url: '/api/list-subdomains', failOnStatusCode: false })
      }
      cy.get('[data-testid="rate-limit-message"]').should('be.visible')
    })
  })
})
