import { mount } from 'cypress/react'

Cypress.Commands.add('mount', mount)

beforeEach(() => {
  // Reset state before each component test
  cy.intercept('GET', '/api/**', { statusCode: 200, body: {} })
})
