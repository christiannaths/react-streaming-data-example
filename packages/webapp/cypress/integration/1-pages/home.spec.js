describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the title', () => {
    cy.get('[data-testid="title"]')
      .should('have.length', 1)
      .should('contain.text', 'Welcome');
  });
});
