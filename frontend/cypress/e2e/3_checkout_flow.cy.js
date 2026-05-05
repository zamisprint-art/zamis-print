describe('Flujo de Compra (Checkout)', () => {
  it('Debe permitir agregar al carrito e iniciar la compra', () => {
    // 1. Mockear la API para asegurar un producto en stock siempre
    const mockProduct = {
      _id: 'cypress-test-123',
      name: 'Producto de Prueba Cypress',
      price: 50000,
      image: '/images/sample.jpg',
      countInStock: 10,
      category: 'Test',
      isCustomizable: false,
      requiresTextPersonalization: false,
      reviews: []
    };

    cy.intercept('GET', '/api/products', [mockProduct]).as('getProducts');
    cy.intercept('GET', '/api/products/cypress-test-123', mockProduct).as('getProductDetail');
    
    // Mockear la creación del pedido y la preferencia de MercadoPago
    cy.intercept('POST', '/api/orders', {
      statusCode: 201,
      body: { _id: 'order_123' }
    }).as('createOrder');

    cy.intercept('POST', '/api/payments/create_preference', {
      statusCode: 200,
      body: { init_point: '/order/order_123' } // Simulamos que MP nos redirige a nuestra propia página de éxito
    }).as('createPreference');

    // Ignorar errores de red si hay componentes de terceros rotos
    Cypress.on('uncaught:exception', () => false);

    // 2. Visitar tienda
    cy.visit('/shop');
    cy.wait('@getProducts');
    
    // Entrar al producto simulado
    cy.get('.grid a').first().click();
    cy.wait('@getProductDetail');
    
    // 3. Agregar al carrito
    cy.contains(/Añadir/i).first().click({ force: true });
    
    // Verificar que redirija al carrito
    cy.url().should('include', '/cart');
    
    // 4. Proceder a pagar
    cy.contains(/Proceder al Pago/i).should('exist');
    cy.contains(/Proceder al Pago/i).click();
    
    // 5. Debería llevarnos al formulario de envío (Checkout)
    cy.url().should('include', '/checkout');
    cy.contains(/¿A dónde enviamos tu pedido\?/i).should('exist');
    
    // 6. Diligenciar el formulario
    cy.get('input[name="fullName"]').type('Usuario Pruebas Cypress');
    cy.get('input[name="email"]').type('test@cypress.com');
    cy.get('input[name="address"]').type('Calle Falsa 123');
    cy.get('input[name="city"]').type('Bogotá');
    cy.get('input[name="postalCode"]').type('110111');
    cy.get('input[name="phone"]').type('3001234567');
    
    // 7. Enviar formulario (Simular clic en Continuar al Pago)
    // El botón usa el atributo form="checkout-form" y está fuera del tag <form>
    cy.get('button[form="checkout-form"]').first().click({ force: true });
    
    // 8. Verificar overlay de procesamiento y las llamadas a la API
    cy.contains(/Procesando tu pago/i).should('exist');
    cy.wait('@createOrder');
    cy.wait('@createPreference');
    
    // 9. Verificar que nos "redirige" a la pasarela (en este caso mockeada a /order)
    cy.url({ timeout: 10000 }).should('include', '/order/order_123');
  });
});
