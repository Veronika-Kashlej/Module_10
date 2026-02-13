describe('Post Creation', () => {
    const TEST_USER = {
        email: 'helena.hills@social.com',
        password: 'password789',
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.login(TEST_USER.email, TEST_USER.password);
        cy.visit('/');
        cy.get('.create-post-section').should('be.visible');
    });

    it('Open create post modal', () => {
        cy.get('.create-post-section button').contains('Tell everyone').click();

        cy.get('.modal').should('be.visible');
        cy.get('.modal-title').should('contain', 'Create a new post');
        cy.get('input[name="post-title"]').should('be.visible');
        cy.get('textarea[name="post-description"]').should('be.visible');
        cy.get('button').contains('Create').should('be.visible');
    });

    it('Close create post modal', () => {
        cy.get('.create-post-section button').contains('Tell everyone').click();

        cy.get('.modal').should('be.visible');

        cy.get('.close-modal-btn').click();
        cy.get('.modal').should('not.exist');
    });

    it('Create post with title and description only', () => {
        const postTitle = 'Test Post Title';
        const postDescription = 'This is a test post description';

        cy.get('.create-post-section button').contains('Tell everyone').click();

        cy.get('.modal').should('be.visible');

        cy.get('input[name="post-title"]')
            .type(postTitle)
            .should('have.value', postTitle);

        cy.get('textarea[name="post-description"]')
            .type(postDescription)
            .should('have.value', postDescription);

        cy.get('button').contains('Create').click();

        cy.contains('Post created successfully').should('be.visible');
        cy.get('.modal').should('not.exist');

        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.contains(postDescription).should('be.visible');
            });
    });

    it('Create post with image upload', () => {
        const postTitle = 'Post with Image';
        const postDescription = 'Testing image upload functionality';

        cy.get('.create-post-section button').contains('Tell everyone').click();
        cy.get('.modal').should('be.visible');

        cy.get('input[name="post-title"]').type(postTitle);
        cy.get('textarea[name="post-description"]').type(postDescription);

        cy.get('.file-upload-dropzone').should('be.visible');

        const minimalJpeg =
            '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAICAgICAQICAgICAgIDAwYEAwMDAwcFBQQGCAcICAgHCAgJCg0LCQkMCggICw8LDA0ODg4OCQsQERAOEQ0ODg7/2wBDAQICAgMDAwYEBAYOCQgJDg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg7/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCJgDgA/9k=';

        cy.get('input[type="file"]').selectFile(
            {
                contents: Cypress.Buffer.from(minimalJpeg, 'base64'),
                fileName: 'test-image.jpg',
                mimeType: 'image/jpeg',
            },
            { force: true }
        );

        cy.wait(500);

        cy.get('.file-upload-dropzone .file-upload-text').should(
            'contain',
            'test-image.jpg'
        );

        cy.get('.file-upload-dropzone.error').should('not.exist');

        cy.get('button').contains('Create').click();
        cy.contains('Post created successfully').should('be.visible');

        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.contains(postDescription).should('be.visible');
                cy.get('.post-image').should('be.visible');
                cy.get('.post-image').should('have.attr', 'src');
            });
    });

    it('Validation - empty title', () => {
        cy.get('.create-post-section button').contains('Tell everyone').click();

        cy.get('.modal').should('be.visible');

        cy.get('textarea[name="post-description"]').type(
            'Post description without title'
        );

        cy.get('button').contains('Create').click();

        cy.get('input[name="post-title"]:invalid').should('exist');
        cy.get('.modal').should('be.visible');
    });

    it('Validation - empty description', () => {
        cy.get('.create-post-section button').contains('Tell everyone').click();

        cy.get('.modal').should('be.visible');

        cy.get('input[name="post-title"]').type(
            'Post title without description'
        );

        cy.get('button').contains('Create').click();

        cy.get('textarea[name="post-description"]:invalid').should('exist');
        cy.get('.modal').should('be.visible');
    });

    it('Cancel post creation', () => {
        const postTitle = 'Post that will be cancelled';
        const postDescription = 'This post will not be created';

        cy.get('.create-post-section button').contains('Tell everyone').click();

        cy.get('.modal').should('be.visible');

        cy.get('input[name="post-title"]').type(postTitle);
        cy.get('textarea[name="post-description"]').type(postDescription);

        cy.get('.modal-header svg').click();
        cy.get('.modal').should('not.exist');

        cy.get('.posts-list .post-card').should('not.contain', postDescription);
    });
});
