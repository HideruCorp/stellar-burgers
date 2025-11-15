/// <reference types="cypress" />

import {
  MODAL,
  MODAL_TITLE,
  MODAL_CLOSE,
  MODAL_OVERLAY
} from 'cypress/support/selectors';

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
  });

  it('добавляет булку из списка в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.contains('Краторная булка N-200i')
      .closest('li')
      .contains('Добавить')
      .click();

    cy.contains('Краторная булка N-200i (верх)').should('exist');
    cy.contains('Краторная булка N-200i (низ)').should('exist');

    cy.contains('Выберите булки').should('not.exist');
  });

  it('добавляет начинку из списка в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Изначально плейсхолдер начинки должен быть виден
    cy.contains('Выберите начинку').should('exist');

    // Добавляем соус (начинка) из списка ингредиентов
    cy.contains('Соус Spicy-X').closest('li').contains('Добавить').click();

    // После добавления начинки плейсхолдер должен исчезнуть
    cy.contains('Выберите начинку').should('not.exist');
  });

  describe('Модальное окно ингредиента', () => {
    it('открывается и показывает данные выбранного ингредиента', () => {
      cy.visit('/');
      cy.wait('@getIngredients');

      cy.contains('Краторная булка N-200i').click();

      cy.get(MODAL).should('be.visible');
      cy.get(MODAL_TITLE)
        .should('be.visible')
        .and('have.text', 'Детали ингредиента');

      cy.get(MODAL).within(() => {
        cy.contains('Краторная булка N-200i').should('be.visible');
        cy.contains('Калории, ккал').should('be.visible');
      });
    });

    it('закрывается по клику на крестик', () => {
      cy.visit('/');
      cy.wait('@getIngredients');

      cy.contains('Краторная булка N-200i').click();
      cy.get(MODAL).should('be.visible');

      cy.get(MODAL_CLOSE).click();

      cy.get(MODAL).should('not.exist');
    });

    it('закрывается по клику на оверлей', () => {
      cy.visit('/');
      cy.wait('@getIngredients');

      cy.contains('Краторная булка N-200i').click();
      cy.get(MODAL).should('be.visible');

      cy.get(MODAL_OVERLAY).click({ force: true });

      cy.get(MODAL).should('not.exist');
    });

    it('закрывается по нажатию клавиши Esc', () => {
      cy.visit('/');
      cy.wait('@getIngredients');

      cy.contains('Краторная булка N-200i').click();
      cy.get(MODAL).should('be.visible');

      cy.get('body').type('{esc}');

      cy.get(MODAL).should('not.exist');
    });
  });

  describe('Процесс создания заказа', () => {
    beforeEach(() => {
      // Мокаем данные пользователя и создания заказа
      cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );

      // Подставляем фейковые токены авторизации ДО захода на страницу
      cy.setCookie('accessToken', 'test-access-token');

      cy.visit('/');

      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });

      cy.wait('@getUser');
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
    });

    it('собирает бургер, оформляет заказ и очищает конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .contains('Добавить')
        .click();

      // Добавляем начинку (например, Соус Spicy-X)
      cy.contains('Соус Spicy-X').closest('li').contains('Добавить').click();

      // Проверяем, что плейсхолдер начинки исчез
      cy.contains('Выберите начинку').should('not.exist');

      // Оформляем заказ
      cy.contains('button', 'Оформить заказ').click();

      cy.wait('@createOrder');

      // В модалке должен отобразиться номер заказа из фикстуры (12345)
      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('12345').should('be.visible');

      cy.get(MODAL_CLOSE).click();

      cy.contains('идентификатор заказа').should('not.exist');

      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
});
