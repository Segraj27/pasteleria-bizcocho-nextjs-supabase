describe('Flujo completo de pedido', () => {
  it('Realiza un pedido desde login hasta carrito', () => {

    // LOGIN
    cy.visit('http://localhost:3000/login')

    cy.get('[data-cy=email]').type('pulidobellovalentina1214@gmail.com')
    cy.get('[data-cy=password]').type('52163535')

    cy.get('[data-cy=login-btn]').click()

    cy.url({ timeout: 10000 }).should('include', '/pedidos')
    cy.contains('Bienvenida').should('exist') // valida login real

    // HACER PEDIDO
    cy.get('[data-cy=btn-hacer-pedido]').click()

    // SELECCIONAR PRODUCTO
    cy.get('[data-cy=producto-chocolate]').click()

    // PERSONALIZAR
    cy.get('[data-cy=btn-personalizar]').click()

    // OPCIÓN DEL MODAL
    cy.get('[data-cy=opcion-cumpleanos]').click()

    // VALIDAR QUE SE AGREGÓ
    cy.get('[data-cy=carrito-count]').should('not.have.text', '0')

    // IR AL CARRITO
    cy.get('[data-cy=btn-carrito]').click()

    // VALIDACIÓN FINAL
    cy.url().should('include', '/carrito')
    cy.contains('Pastel de Chocolate').should('exist')
  })
})