import './commands';

beforeEach(() => {
    cy.window().then((win) => {
        win.localStorage.clear();
        win.sessionStorage.clear();
    });

    cy.intercept('POST', '/api/auth/signup', {
        statusCode: 201,
        body: { success: true, message: 'User created' },
    }).as('signupRequest');

    cy.intercept('GET', '/api/posts*', {
        statusCode: 200,
        body: { data: [] },
    }).as('getPosts');
});
