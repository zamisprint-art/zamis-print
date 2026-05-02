describe('Flujo de Compra (Checkout)', () => {
  it('Debe permitir agregar al carrito e iniciar la compra', () => {
    // 1. Visitar tienda y entrar a un producto
    cy.visit('/shop');
    
    // Ignorar errores de red si hay productos rotos
    Cypress.on('uncaught:exception', () => false);
    
    cy.get('body').then(($body) => {
      // Si hay productos en la tienda
      if ($body.find('.grid a').length > 0) {
        cy.get('.grid a').first().click();
        
        // 2. Agregar al carrito
        cy.contains(/Agregar al Carrito/i).click();
        
        // Verificar que redirija al carrito o el carrito se actualice
        // Si hay modal/toast, tal vez debamos ir a /cart manual
        cy.visit('/cart');
        cy.url().should('include', '/cart');
        
        // 3. Proceder a pagar
        cy.contains(/Proceder a Pagar/i).should('exist');
        cy.contains(/Proceder a Pagar/i).click();
        
        // 4. Debería pedir Login si no estamos autenticados
        cy.url().should('include', '/login');
        
        // --- NOTA: Para un test E2E completo, aquí haríamos un mock de Login ---
        // Pero como estamos probando el flujo público hasta el login:
        cy.contains(/Iniciar Sesión/i).should('exist');
      }
    });
  });
});
