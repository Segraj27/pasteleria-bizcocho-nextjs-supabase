describe('Login de usuario', () => {
  it('Inicia sesión y navega al home', () => {
    cy.visit('http://localhost:3000/login')

    cy.get('input[type="email"]').first().type('pulidobellovalentina1214@gmail.com')
    cy.get('input[type="password"]').first().type('52163535')

    cy.contains('button', 'Iniciar sesión').click()

    // esperar redirección
    cy.location('pathname', { timeout: 10000 })
      .should('include', '/pedidos')

    // después del login, clic en el logo
    cy.get('a.navbar-brand')
      .contains('Pastelería El Bizcocho')
      .click()

    // validar que fue al home
    cy.location('pathname').should('eq', '/')
  })
})