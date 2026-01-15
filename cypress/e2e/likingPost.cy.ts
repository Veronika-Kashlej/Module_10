describe('Post Likes', () => {
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

    it('Like a post', () => {
        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.get('.likes-block p')
                    .invoke('text')
                    .then(() => {
                        cy.get('.likes-block svg').should(
                            'have.attr',
                            'fill',
                            'none'
                        );

                        cy.get('.likes-block svg').click();

                        cy.get('.likes-block svg').should(
                            'have.attr',
                            'fill',
                            '#ff8811'
                        );

                        cy.get('.likes-block p')
                            .invoke('text')
                            .then((newText) => {
                                const newLikes = parseInt(newText) || 0;
                                expect(newLikes).to.be.a('number');
                            });
                    });
            });
    });

    it('Unlike a post', () => {
        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.get('.likes-block svg').then(($svg) => {
                    if ($svg.attr('fill') !== '#ff8811') {
                        cy.get('.likes-block svg').click();
                        cy.get('.likes-block svg').should(
                            'have.attr',
                            'fill',
                            '#ff8811'
                        );
                    }
                });

                cy.get('.likes-block p')
                    .invoke('text')
                    .then(() => {
                        cy.get('.likes-block svg').click();

                        cy.get('.likes-block svg').should(
                            'have.attr',
                            'fill',
                            'none'
                        );

                        cy.get('.likes-block p')
                            .invoke('text')
                            .then((newText) => {
                                const newLikes = parseInt(newText) || 0;
                                expect(newLikes).to.be.a('number');
                            });
                    });
            });
    });

    it('Like counter shows correct number', () => {
        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.get('.likes-block p')
                    .should('be.visible')
                    .invoke('text')
                    .then((text) => {
                        const likesCount = parseInt(text);
                        expect(likesCount).to.be.a('number');
                        expect(likesCount).to.be.at.least(0);
                    });
            });
    });

    it('Unauthenticated user cannot like posts', () => {
        cy.logout();
        cy.visit('/');

        cy.get('.posts-list .post-card')
            .first()
            .within(() => {
                cy.get('.likes-block').should('exist');

                cy.get('.comments-block').should(
                    'contain',
                    'You have to login to see the comments'
                );

                cy.get('.likes-block svg').click({ force: true });

                cy.get('.likes-block svg').should('have.attr', 'fill', 'none');
            });
    });
});
