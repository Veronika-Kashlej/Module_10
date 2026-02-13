describe('Profile Editing', () => {
    const TEST_USER = {
        email: 'helena.hills@social.com',
        password: 'password789',
    };

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.login(TEST_USER.email, TEST_USER.password);
        cy.visit('/profile');
    });

    it('Navigate to profile page', () => {
        cy.url().should('include', '/profile');

        cy.get('.tabs-container').should('be.visible');
        cy.get('.tabs-container .tab')
            .contains('Profile info')
            .should('be.visible');
        cy.get('.tabs-container .tab')
            .contains('Statistics')
            .should('be.visible');
        cy.get('.edit-profile-section h3')
            .contains('Edit Profile')
            .should('be.visible');
    });

    it('Switch between profile tabs', () => {
        cy.get('.tab.active').should('contain', 'Profile info');
        cy.contains('Edit Profile').should('be.visible');

        cy.get('.tab').contains('Statistics').click();
        cy.get('.tab.active').should('contain', 'Statistics');
        cy.contains('Edit Profile').should('not.exist');

        cy.get('.tab').contains('Profile info').click();
        cy.get('.tab.active').should('contain', 'Profile info');
        cy.contains('Edit Profile').should('be.visible');
    });

    it('Edit profile form is pre-filled with user data', () => {
        cy.get('.edit-profile-section').within(() => {
            cy.get('input[name="username"]')
                .invoke('val')
                .should('not.be.empty')
                .and('include', '@');

            cy.get('input[name="email"]')
                .invoke('val')
                .should('not.be.empty')
                .and('include', '@');
            cy.get('textarea[name="description"]').should('exist');

            cy.get('button')
                .contains('Save Profile Changes')
                .should('be.visible');
        });
    });

    it('Update profile description', () => {
        const newDescription = 'Updated bio from Cypress tests';

        cy.get('.edit-profile-section').within(() => {
            cy.get('textarea[name="description"]')
                .clear()
                .type(newDescription)
                .should('have.value', newDescription);

            cy.contains('Max 200 chars').should('be.visible');

            cy.get('button').contains('Save Profile Changes').click();
        });
        cy.contains('Profile changes saved successfully').should('be.visible');
    });
    it('Update email', () => {
        const newEmail = 'updated-' + TEST_USER.email;

        cy.url().should('include', '/profile');

        cy.get('input[name="email"]', { timeout: 10000 })
            .should('be.visible')
            .and('not.be.disabled')
            .clear()
            .type(newEmail)
            .should('have.value', newEmail);

        cy.get('button')
            .contains('Save Profile Changes')
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.contains('Profile changes saved successfully', {
            timeout: 10000,
        }).should('be.visible');
    });

    it('Navigate to Statistics and back to profile after editing', () => {
        const testText = 'Testing persistence after navigation';

        cy.get('.edit-profile-section').within(() => {
            cy.get('textarea[name="description"]').clear().type(testText);

            cy.get('button').contains('Save Profile Changes').click();
        });
        cy.contains('Profile changes saved successfully').should('be.visible');

        cy.get('.tab').contains('Statistics').click();
        cy.get('.tab.active').should('contain', 'Statistics');
        cy.contains('Edit Profile').should('not.exist');

        cy.get('.tab').contains('Profile info').click();
        cy.get('.tab.active').should('contain', 'Profile info');
        cy.contains('Edit Profile').should('be.visible');

        cy.get('.edit-profile-section').within(() => {
            cy.get('textarea[name="description"]').should(
                'have.value',
                testText
            );
        });
    });
});
