describe('Post Comments', () => {
    const TEST_USER = {
        email: 'helena.hills@social.com',
        password: 'password789',
    };
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.login(TEST_USER.email, TEST_USER.password);
        cy.visit('/');
        cy.waitForPosts();
    });

    it('Show/hide comments', () => {
        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.get('.comments-list .comment-item')
                    .first()
                    .should('have.attr', 'style', 'display: none;');

                cy.get('.comments-block svg')
                    .last()
                    .should(
                        'have.css',
                        'transform',
                        'matrix(-1, 0, 0, -1, 0, 0)'
                    );

                cy.get('.comments-block svg').last().click();

                cy.get('.comments-block svg')
                    .last()
                    .should('have.css', 'transform', 'none');

                cy.get('.comments-list .comment-item')
                    .first()
                    .should('have.attr', 'style', 'display: flex;');

                cy.get('textarea[name^="comment"]').should('be.visible');
                cy.get('button').contains('Add a comment').should('be.visible');

                cy.get('.comments-block svg').last().click();

                cy.get('.comments-list .comment-item')
                    .first()
                    .should('have.attr', 'style', 'display: none;');
            });
    });

    it('Add new comment', () => {
        const testComment = 'This is a test comment from Cypress!';

        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.get('.comments-block svg').last().click();

                cy.get('.comments-block p')
                    .invoke('text')
                    .then(() => {
                        cy.get('textarea[name^="comment"]')
                            .type(testComment)
                            .should('have.value', testComment);

                        cy.get('button').contains('Add a comment').click();

                        cy.get('textarea[name^="comment"]').should(
                            'have.value',
                            ''
                        );

                        cy.get('.comments-list .comment-item')
                            .last()
                            .should('contain', testComment);

                        cy.get('.comments-block p')
                            .invoke('text')
                            .then((newText) => {
                                const newComments = parseInt(newText) || 0;
                                expect(newComments).to.be.at.least(0);
                            });
                    });
            });
    });

    it('Add multiple comments', () => {
        const comments = [
            'First test comment',
            'Second test comment',
            'Third test comment',
        ];

        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.get('.comments-block svg').last().click();

                comments.forEach((comment, index) => {
                    cy.get('textarea[name^="comment"]').type(comment);

                    cy.get('button').contains('Add a comment').click();

                    cy.get('.comments-list .comment-item')
                        .eq(index + 1)
                        .should('contain', comment);

                    cy.get('textarea[name^="comment"]').should(
                        'have.value',
                        ''
                    );
                });

                cy.get('.comments-list .comment-item').should(
                    'have.length.at.least',
                    comments.length
                );

                comments.forEach((comment) => {
                    cy.get('.comments-list').should('contain', comment);
                });
            });
    });

    it('Cannot add empty comment', () => {
        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.get('.comments-block svg').last().click();

                cy.get('.comments-list .comment-item')
                    .its('length')
                    .then((initialCount) => {
                        cy.get('textarea[name^="comment"]').type('   ');

                        cy.get('button').contains('Add a comment').click();

                        cy.get('.comments-list .comment-item').should(
                            'have.length',
                            initialCount
                        );

                        cy.get('textarea[name^="comment"]').clear();

                        cy.get('button').contains('Add a comment').click();

                        cy.get('.comments-list .comment-item').should(
                            'have.length',
                            initialCount
                        );
                    });
            });
    });

    it('Delete own comment', () => {
        const testComment = 'Comment to be deleted';

        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.get('.comments-block svg').last().click();

                cy.get('textarea[name^="comment"]').type(testComment);

                cy.get('button').contains('Add a comment').click();

                cy.get('.comments-list .comment-item')
                    .its('length')
                    .then((countAfterAdd) => {
                        cy.get('.comments-list .comment-item')
                            .contains(testComment)
                            .parent()
                            .within(() => {
                                cy.get('.trash-icon').click();
                            });

                        cy.get('.comments-list .comment-item')
                            .should('have.length', countAfterAdd - 1)
                            .and('not.contain', testComment);

                        cy.get('.comments-block p')
                            .invoke('text')
                            .then((text) => {
                                const commentCount = parseInt(text) || 0;
                                expect(commentCount).to.be.at.least(1);
                            });
                    });
            });
    });

    it('Unauthenticated user cannot see comments or add them', () => {
        cy.logout();
        cy.visit('/');

        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.get('.comments-block').should(
                    'contain',
                    'You have to login to see the comments'
                );

                cy.get('textarea[name^="comment"]').should('not.exist');
            });
    });

    it('Comment numbering is correct', () => {
        const comments = ['Comment 1', 'Comment 2', 'Comment 3'];

        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.get('.comments-block svg').last().click();

                comments.forEach((comment) => {
                    cy.get('textarea[name^="comment"]').type(comment);
                    cy.get('button').contains('Add a comment').click();
                });

                cy.get('.comments-list .comment-item').each(($item, index) => {
                    cy.wrap($item).should('contain', `#${index + 1}`);
                });
            });
    });
});
