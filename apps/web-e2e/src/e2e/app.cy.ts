import { getDashboardTitle } from '../support/app.po';

describe('@org/web-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('shows the habits dashboard and working navigation', () => {
    getDashboardTitle().should('contain.text', 'Good things take practice');
    cy.get('nav[aria-label="Main navigation"] a').should('have.length', 3);
    cy.contains('h2', 'My habits').should('be.visible');
    cy.contains('h2', 'Activity').should('be.visible');
  });
});
