describe('Navegación Principal - ZAMIS Print', () => {
  beforeEach(() => {
    // Visitar la página de inicio antes de cada prueba
    cy.visit('/');
  });

  it('Debe cargar la página principal (Home) correctamente', () => {
    cy.get('nav').should('exist');
    cy.get('section').find('button').should('exist');
    cy.contains(/ZAMIS Print/i).should('exist');
  });

  it('Debe navegar a la tienda (Shop) al hacer clic en el menú', () => {
    // Mockear la respuesta de la tienda para que siempre haya productos
    cy.intercept('GET', '/api/products', {
      statusCode: 200,
      body: [{
        _id: '123',
        name: 'Producto Dummy',
        price: 1000,
        image: '/images/sample.jpg',
        category: 'Test'
      }]
    }).as('getProducts');

    cy.get('nav').contains(/Tienda/i).click({ force: true });
    cy.url().should('include', '/shop');
    
    // Esperar al mock
    cy.wait('@getProducts');
    
    // Verificar filtros y productos
    cy.contains(/Categorías/i).should('exist');
    cy.get('.grid').children().should('have.length.greaterThan', 0);
  });
});
