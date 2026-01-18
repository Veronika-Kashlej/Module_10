/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            registerUser(email: string, password: string): Chainable<void>;
            login(email: string, password: string): Chainable<void>;
            logout(): Chainable<void>;
            waitForPosts(): Chainable<void>;
        }
    }
}

Cypress.Commands.add('registerUser', (email: string, password: string) => {
    cy.visit('/sign-up');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').contains('Sign Up').click();
    cy.contains('You Sign Up successfully', { timeout: 10000 });
    cy.url().should('eq', Cypress.config().baseUrl + '/');
});

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/sign-in');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').contains('Sign In').click();
    cy.contains('You Sign In successfully', { timeout: 10000 }).should(
        'be.visible'
    );
    cy.url().should('eq', Cypress.config().baseUrl + '/');
});

Cypress.Commands.add('logout', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/');
});

Cypress.Commands.add('waitForPosts', () => {
    cy.get('.post-skeleton', { timeout: 10000 }).should('not.exist');
    cy.get('.posts-list .post-card', { timeout: 10000 }).should(
        'have.length.at.least',
        1
    );
});

export {};
