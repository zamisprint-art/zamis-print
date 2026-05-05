describe('Búsqueda y Detalle de Producto', () => {
  beforeEach(() => {
    // 1. Inyectar productos falsos para estabilizar las pruebas
    const mockProduct = {
      _id: '123',
      name: 'Funko Personalizado Test',
      price: 50000,
      image: '/images/sample.jpg',
      category: 'Figuras',
      countInStock: 10,
      reviews: [],
      isCustomizable: false,
      requiresTextPersonalization: false
    };

    cy.intercept('GET', '/api/products', [mockProduct]).as('getProducts');
    cy.intercept('GET', '/api/products/123', mockProduct).as('getProduct');

    cy.visit('/');
  });

  it('Debe permitir buscar un producto desde el buscador', () => {
    // Buscar el input del buscador (puede estar en versión móvil o desktop)
    cy.get('input[type="search"]').first().type('Funko{enter}');
    
    cy.url().should('include', 'q=Funko');
    cy.wait('@getProducts');
    
    // Verificar que los resultados contienen el producto mockeado
    cy.get('.grid').children().should('have.length.greaterThan', 0);
  });

  it('Debe abrir el detalle de un producto correctamente', () => {
    cy.visit('/shop');
    cy.wait('@getProducts');
    
    cy.get('.grid').should('exist');
    cy.get('.grid a').first().click();
    
    // Verificar que estamos en la página del producto
    cy.url().should('include', '/product/');
    cy.wait('@getProduct');
    
    // Verificar información clave
    cy.get('h1').should('exist'); // Título
    cy.contains(/Añadir/i).should('exist'); // Botón de carrito
  });
});
