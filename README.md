# Stellar Burger — проектная работа (Спринт 11). Redux-хранилище, роутинг и авторизация

Приложение космической бургерной со сборкой бургера, оформлением заказа, лентой заказов и личным кабинетом. Проект реализован на React + TypeScript с использованием Redux Toolkit, React Router и CSS Modules.

## Стек
- React 18, TypeScript
- Redux Toolkit (RTK), createAsyncThunk, типизированные хуки
- React Router v6 (включая модальные роуты + backgroundLocation)
- CSS Modules, clsx
- Storybook (настройка и несколько сториз для UI)
- Webpack 5

## Быстрый старт
```bash
# установка зависимостей
npm i
# запуск дев-сервера
npm start
# сборка
npm run build
# storybook
npm run storybook
```

## Архитектура и структура проекта

- src/components — «контейнеры» и инфраструктурные компоненты (интегрированы с Redux/роутером)
  - app - основной инстанс App, маршруты
  - protected-route
  - burger-ingredients / burger-constructor / ingredient-details / orders-list / order-info / …
- src/components/ui — UI-компоненты
- src/pages — страницы приложения
- src/services — Redux-хранилище
  - store.ts — конфигурация Store
  - slices/ — слайсы:
    - ingredientsSlice.ts — каталог ингредиентов
    - burgerConstructorSlice.ts — конструктор бургера (булка и начинка)
    - userSlice.ts — авторизация и профиль пользователя
    - feedSlice.ts — публичная лента и история заказов пользователя
    - orderSlice.ts — создание заказа и просмотр деталей заказа
- src/utils — утилиты и API-обёртки starter-кита

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
- ingredientsSlice — загрузка ингредиентов, кэш, состояния загрузки/ошибки; селекторы для элементов и поиска по id
- burgerConstructorSlice — выбор булки (строго одна, сразу и верх/низ), список начинок, перемещение/удаление, расчёт стоимости (на уровне контейнера)
- userSlice — регистрация/логин/логаут/получение и обновление профиля. Токены: accessToken (cookie), refreshToken (localStorage). Инициализация авторизации в App по наличию accessToken
- feedSlice — публичная лента (orders, total, totalToday) и история пользователя (orders)
- orderSlice — создание заказа (create) и получение деталей заказа по номеру (details)

### Авторизация и ProtectedRoute
- Проверка авторизации — в App (src/components/app/app.tsx): при наличии cookie accessToken запрашивается пользователь (getUser), иначе — быстрый флаг setAuthChecked()
- Защищённые маршруты — via ProtectedRoute (src/components/protected-route/protected-route.tsx)
  - Неавторизованные перенаправляются на /login с сохранением from
  - Страницы /login, /register, /forgot-password, /reset-password недоступны авторизованным — происходит редирект на сохранённый from или на «/»
- Запросы, требующие авторизации (заказы пользователя, сохранение профиля, создание заказа), используют механику refresh-токена (реализована в utils/burger-api.ts стартеркита)
