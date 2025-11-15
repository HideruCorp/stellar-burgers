# Stellar Burger — проектная работа (Спринт 12). Тестирование приложения

Приложение космической бургерной со сборкой бургера, оформлением заказа, лентой заказов и личным кабинетом. Проект реализован на React + TypeScript с использованием Redux Toolkit, React Router и CSS Modules.

## Стек
- React 18, TypeScript
- Redux Toolkit (RTK), createAsyncThunk, типизированные хуки
- React Router v6 (включая модальные роуты + backgroundLocation)
- CSS Modules, clsx
- Storybook (настройка и несколько сториз для UI)
- Webpack 5
- Jest + React Testing Library (unit/integration тесты)
- Cypress (E2E тестирование)

## Быстрый старт
```bash
# установка зависимостей
npm i

# запуск дев-сервера
npm start

# storybook
npm run storybook

# unit-тесты (Jest)
npm test
npm run test:coverage  # с покрытием
npm run test:watch     # в режиме наблюдения

# E2E тесты (Cypress)
npm run test:e2e        # запуск сервера + headless тесты
npm run test:e2e:open   # запуск сервера + интерактивный режим
npm run cypress:open    # только Cypress UI (сервер должен быть запущен)
npm run cypress:run     # только Cypress headless (сервер должен быть запущен)

# линтинг и форматирование
npm run lint
npm run lint:fix
npm run format
```

## Архитектура и структура проекта

- **src/components** — «контейнеры» и инфраструктурные компоненты (интегрированы с Redux/роутером)
  - app - основной инстанс App, маршруты
  - protected-route
  - burger-ingredients / burger-constructor / ingredient-details / orders-list / order-info / …
- **src/components/ui** — UI-компоненты (презентационные)
- **src/pages** — страницы приложения
- **src/services** — Redux-хранилище
  - store.ts — конфигурация Store
  - slices/ — слайсы:
    - ingredientsSlice.ts — каталог ингредиентов
    - burgerConstructorSlice.ts — конструктор бургера (булка и начинка)
    - userSlice.ts — авторизация и профиль пользователя
    - feedSlice.ts — публичная лента и история заказов пользователя
    - orderSlice.ts — создание заказа и просмотр деталей заказа
  - slices/__tests__/ — unit-тесты для Redux слайсов
  - __tests__/ — тесты для store
- **src/utils** — утилиты и API-обёртки starter-кита
- **src/__mocks__** — моки для тестирования
- **cypress/** — E2E тесты
  - e2e/ — тестовые сценарии
  - fixtures/ — тестовые данные (ingredients.json, order.json, user.json)
  - support/ — вспомогательные команды и настройки

### Роутинг и модальные окна
- Основные маршруты:
  - `/` — ConstructorPage
  - `/feed` — Лента заказов
  - `/ingredients/:id` — IngredientPage (страница)
  - `/feed/:number` — Детали заказов ленты (страница)
  - `/profile` — Профиль (защищённый)
  - `/profile/orders` — История заказов (защищённый)
  - `/profile/orders/:number` — Детали заказов истории (защищённый)
  - `/login`, `/register`, `/forgot-password`, `/reset-password` — доступны только неавторизованным
  - `*` — NotFound404

- Управление модальными окнами по роутам через backgroundLocation:
  - `/ingredients/:id` — детальная информация об ингредиенте
  - `/feed/:number` — детали заказа
  - `/profile/orders/:number` — детали заказа (защищённый)

См. src/components/app/routes.tsx

### Redux-хранилище: срезы и ответственность
- **ingredientsSlice** — загрузка ингредиентов, кэш, состояния загрузки/ошибки; селекторы для элементов и поиска по id
- **burgerConstructorSlice** — выбор булки (строго одна, сразу и верх/низ), список начинок, перемещение/удаление, расчёт стоимости (на уровне контейнера)
- **userSlice** — регистрация/логин/логаут/получение и обновление профиля. Токены: accessToken (cookie), refreshToken (localStorage). Инициализация авторизации в App по наличию accessToken
- **feedSlice** — публичная лента (orders, total, totalToday) и история пользователя (orders)
- **orderSlice** — создание заказа (create) и получение деталей заказа по номеру (details)

### Тестирование

#### Unit/Integration тесты (Jest + React Testing Library)
Все Redux-слайсы покрыты unit-тестами, включающими:
- Тестирование редьюсеров (синхронные действия)
- Тестирование асинхронных thunk-действий (fulfilled/rejected состояния)
- Проверка корректности обновления состояния
- Тесты для селекторов

Тесты находятся в [`src/services/slices/__tests__/`](src/services/slices/__tests__/):
- [`burgerConstructorSlice.test.ts`](src/services/slices/__tests__/burgerConstructorSlice.test.ts)
- [`ingredientsSlice.test.ts`](src/services/slices/__tests__/ingredientsSlice.test.ts)
- [`userSlice.test.ts`](src/services/slices/__tests__/userSlice.test.ts)
- [`feedSlice.test.ts`](src/services/slices/__tests__/feedSlice.test.ts)
- [`orderSlice.test.ts`](src/services/slices/__tests__/orderSlice.test.ts)

Конфигурация: [`jest.config.ts`](jest.config.ts)

#### E2E тесты (Cypress)
Сквозное тестирование основных пользовательских сценариев:
- Работа с конструктором бургера
- Drag & Drop ингредиентов
- Оформление заказа
- Модальные окна

Тесты находятся в [`cypress/e2e/`](cypress/e2e/).
Конфигурация: [`cypress.config.ts`](cypress.config.ts)

### Авторизация и ProtectedRoute
- Проверка авторизации — в App (src/components/app/app.tsx): при наличии cookie accessToken запрашивается пользователь (getUser), иначе — быстрый флаг setAuthChecked()
- Защищённые маршруты — via ProtectedRoute (src/components/protected-route/protected-route.tsx)
  - Неавторизованные перенаправляются на /login с сохранением from
  - Страницы /login, /register, /forgot-password, /reset-password недоступны авторизованным — происходит редирект на сохранённый from или на «/»
- Запросы, требующие авторизации (заказы пользователя, сохранение профиля, создание заказа), используют механику refresh-токена (реализована в utils/burger-api.ts стартеркита)
