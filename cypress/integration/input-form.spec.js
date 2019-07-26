describe('Input form', () => {
  beforeEach(() => {
    cy.seedAndVisit([])
  })

  it('focuses input on load', () => {
    cy.focused()
      .should('have.class', 'new-todo')
  })

  it('accepts input', () => {
    const typedText = 'Learn cypress'

    cy.get('.new-todo')
      .type(typedText)
      .should('have.value', typedText)
  })

  context('Form submission', () => {
    beforeEach(() => {
      cy.server()
    })

    it('adds a new todo on submit', () => {
      const typedText = 'Learn React!'

      cy.route('POST', '/api/todos', {
        name: typedText,
        id: 1,
        isComplete: false
      })

      cy.get('.new-todo')
        .type(typedText)
        .type('{enter}')
        .should('have.value', '')

      cy.get('.todo-list li')
        .should('have.length', 1)
        .and('contain', typedText)
    })

    it('shows an error for an invalid submission', () => {
      cy.route({
        url: '/api/todos',
        method: 'POST',
        status: 500,
        response: {}
      })

      cy.get('.new-todo')
        .type('Learn Angular{enter}')

      cy.get('.todo-list li')
        .should('not.exist')

      cy.get('.error')
        .should('be.visible')
    })
  })
})