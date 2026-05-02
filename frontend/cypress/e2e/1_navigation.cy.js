describe('Navegación Principal - ZAMIS Print', () => {
  beforeEach(() => {
    // Visitar la página de inicio antes de cada prueba
    cy.visit('/');
  });

  it('Debe cargar la página principal (Home) correctamente', () => {
    // Validar que el Navbar existe
    cy.get('nav').should('exist');
    
    // Validar que el HeroSlider cargue
    cy.get('.swiper-wrapper').should('exist'); // Asumiendo que usamos Swiper
    
    // Validar que se muestre el logo
    cy.contains(/ZAMIS Print/i).should('exist');
  });

  it('Debe navegar a la tienda (Shop) al hacer clic en el menú', () => {
    // En desktop, hacer clic en "Tienda" o "Catálogo"
    cy.contains(/Tienda/i).click();
    
    // Verificar que la URL cambió
    cy.url().should('include', '/shop');
    
    // Verificar que los filtros existen
    cy.contains(/Filtrar/i).should('exist');
    
    // Verificar que haya productos renderizados
    cy.get('.grid').children().should('have.length.greaterThan', 0);
  });
});
