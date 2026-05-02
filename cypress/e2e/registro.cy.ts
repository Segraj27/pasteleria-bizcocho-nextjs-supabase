describe('Registro de usuario', () => {
  it('Crea una cuenta correctamente', () => {
    cy.visit('http://localhost:3000/register')

    cy.get('input').eq(0).type('Valentina Pulido')
    cy.get('input').eq(1).type('3115732559')

    cy.get('input[type="email"]').first().type(`test${Date.now()}@gmail.com`)
    cy.get('input[type="password"]').first().type('52163535')

    cy.contains('button', 'Registrarme').click()

    cy.url({ timeout: 10000 }).should('not.include', '/register')
  })
})