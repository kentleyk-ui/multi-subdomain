import '@cypress/code-coverage/support'

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/auth')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

Cypress.Commands.add('createSubdomain', (subdomain, domain) => {
  cy.visit('/subdomains')
  cy.get('[data-testid="create-subdomain"]').click()
  cy.get('input[name="subdomain"]').type(subdomain)
  cy.get('input[name="domain"]').type(domain)
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-btn"]').click()
  cy.url().should('include', '/auth')
})

beforeEach(() => {
  cy.intercept('GET', '/api/**', { fixture: 'api-responses.json' }).as('apiCall')
})
