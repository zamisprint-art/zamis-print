describe('Búsqueda y Detalle de Producto', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Debe permitir buscar un producto desde el buscador', () => {
    // Buscar el input del GlobalSearchBar
    cy.get('input[placeholder*="Buscar"]').first().type('Funko{enter}');
    
    // Debería llevar a la página de Shop con la query
    cy.url().should('include', 'keyword=Funko');
    
    // Verificar que los resultados contienen productos
    // O un mensaje de que no se encontraron si la DB está vacía
    cy.get('body').then(($body) => {
      if ($body.find('.grid > div').length > 0) {
        cy.get('.grid > div').should('exist');
      } else {
        cy.contains(/No se encontraron/i).should('exist');
      }
    });
  });

  it('Debe abrir el detalle de un producto correctamente', () => {
    cy.visit('/shop');
    
    // Esperar a que carguen los productos
    cy.get('.grid').should('exist');
    
    // Obtener el primer producto y hacer clic en su enlace
    cy.get('.grid a').first().click();
    
    // Verificar que estamos en la página del producto
    cy.url().should('include', '/product/');
    
    // Verificar información clave
    cy.get('h1').should('exist'); // Título del producto
    cy.contains(/Agregar al Carrito/i).should('exist'); // Botón de carrito
  });
});
