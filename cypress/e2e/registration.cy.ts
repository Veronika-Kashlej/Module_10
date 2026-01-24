describe('Registration', () => {
    const TEST_USER = {
        email: 'helena.hills@social.com',
        password: 'password789',
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/sign-up');
        cy.contains('Create an account').should('be.visible');
    });

    it('Success registration', () => {
        cy.registerUser(TEST_USER.email, TEST_USER.password);

        cy.get('.create-post-section', { timeout: 10000 }).should('be.visible');
        cy.get('.create-post-image').should('have.attr', 'src');
    });

    it('Validation on empty fields', () => {
        cy.get('button[type="submit"]').contains('Sign Up').click();

        cy.get('input[name="email"]:invalid').should('exist');
        cy.get('input[name="password"]:invalid').should('exist');
    });

    it('Invalid email validation', () => {
        cy.get('input[name="email"]').type('invalid-email');
        cy.get('input[name="password"]').type(TEST_USER.password);
        cy.get('button[type="submit"]').contains('Sign Up').click();

        cy.get('input[name="email"]:invalid').should('exist');
    });

    it('Navigate to login page', () => {
        cy.contains('Already have an account?').should('be.visible');
        cy.get('a.helper-link').contains('Sign in').click();

        cy.url().should('include', '/sign-in');
        cy.contains('Sign In', { timeout: 10000 }).should('be.visible');
    });

    it('Check policy links', () => {
        cy.contains('Terms of Service').should(
            'have.attr',
            'href',
            'https://www.google.com/'
        );
        cy.contains('Privacy Policy').should(
            'have.attr',
            'href',
            'https://www.google.com/'
        );
    });

    it('Post creation after registration', () => {
        cy.registerUser(TEST_USER.email, TEST_USER.password);

        cy.get('.asides', { timeout: 10000 }).should('be.visible');
        cy.get('.create-post-section button').contains('Tell everyone').click();

        cy.get('.modal').should('be.visible');
    });
});
