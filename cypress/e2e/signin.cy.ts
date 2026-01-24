describe('Authorization (Sign In)', () => {
    const TEST_USER = {
        email: 'helena.hills@social.com',
        password: 'password789',
    };

    const INVALID_USER = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
    };
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/sign-in');
        cy.contains('Sign in into an account', { timeout: 10000 }).should(
            'be.visible'
        );
    });

    it('Success login with valid credentials', () => {
        cy.login(TEST_USER.email, TEST_USER.password);

        cy.get('.create-post-section').should('be.visible');
        cy.get('.asides').should('be.visible');

        cy.get('header:not(.simple-header)').should('be.visible');
    });

    it('Validation on empty fields', () => {
        cy.get('button[type="submit"]').contains('Sign In').click();

        cy.get('input[name="email"]:invalid').should('exist');
        cy.get('input[name="password"]:invalid').should('exist');
    });

    it('Invalid email format validation', () => {
        cy.get('input[name="email"]').type('invalid-email');
        cy.get('input[name="password"]').type(TEST_USER.password);
        cy.get('button[type="submit"]').contains('Sign In').click();

        cy.get('input[name="email"]:invalid').should('exist');
    });

    it('Login with invalid credentials', () => {
        cy.get('input[name="email"]').type(INVALID_USER.email);
        cy.get('input[name="password"]').type(INVALID_USER.password);
        cy.get('button[type="submit"]').contains('Sign In').click();

        cy.url().should('include', '/sign-in');
        cy.contains('Sign in into an account').should('be.visible');
    });

    it('Navigate to registration page', () => {
        cy.contains('Forgot to create an account?').should('be.visible');
        cy.get('a.helper-link').contains('Sign up').click();

        cy.url().should('include', '/sign-up');
        cy.contains('Create an account').should('be.visible');
    });

    it('Password field type is password', () => {
        cy.get('input[name="password"]').should(
            'have.attr',
            'type',
            'password'
        );
    });

    it('Login and verify user can create post', () => {
        cy.login(TEST_USER.email, TEST_USER.password);
        cy.get('.create-post-section', { timeout: 10000 }).should('be.visible');
        cy.get('.create-post-section button').contains('Tell everyone').click();

        cy.get('.modal').should('be.visible');

        cy.get('.close-modal-btn').click();
        cy.get('.modal').should('not.exist');
    });

    it('Login and logout flow', () => {
        cy.login(TEST_USER.email, TEST_USER.password);

        cy.get('.create-post-section').should('be.visible');

        cy.logout();

        cy.get('.create-post-section').should('not.exist');
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('Redirect authenticated user from login page', () => {
        cy.login(TEST_USER.email, TEST_USER.password);

        cy.visit('/sign-in');

        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.get('.create-post-section').should('be.visible');
    });
});
