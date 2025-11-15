import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  BurgerConstructorState
} from '../burgerConstructorSlice';
import { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Булка тестовая',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 200,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const main1: TIngredient = {
  _id: 'main-1',
  name: 'Начинка 1',
  type: 'main',
  proteins: 5,
  fat: 5,
  carbohydrates: 5,
  calories: 50,
  price: 10,
  image: 'main1.png',
  image_large: 'main1-large.png',
  image_mobile: 'main1-mobile.png'
};

const main2: TIngredient = {
  _id: 'main-2',
  name: 'Начинка 2',
  type: 'main',
  proteins: 6,
  fat: 6,
  carbohydrates: 6,
  calories: 60,
  price: 20,
  image: 'main2.png',
  image_large: 'main2-large.png',
  image_mobile: 'main2-mobile.png'
};

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

describe('burgerConstructorSlice', () => {
  it('должен возвращать начальное состояние по умолчанию', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  it('добавляет булку и заменяет предыдущую', () => {
    const stateWithBun = reducer(initialState, addIngredient(bun));

    expect(stateWithBun.bun).not.toBeNull();
    expect(stateWithBun.bun).toMatchObject({
      ...bun,
      id: expect.any(String)
    });
    expect(stateWithBun.ingredients).toHaveLength(0);

    const anotherBun: TIngredient = {
      ...bun,
      _id: 'bun-2',
      name: 'Другая булка'
    };
    const stateWithNewBun = reducer(stateWithBun, addIngredient(anotherBun));

    expect(stateWithNewBun.bun).not.toBeNull();
    expect(stateWithNewBun.bun?._id).toBe('bun-2');
    expect(stateWithNewBun.ingredients).toHaveLength(0);
  });

  it('добавляет начинку в список ингредиентов', () => {
    const stateWithMain = reducer(initialState, addIngredient(main1));

    expect(stateWithMain.bun).toBeNull();
    expect(stateWithMain.ingredients).toHaveLength(1);
    expect(stateWithMain.ingredients[0]).toMatchObject({
      ...main1,
      id: expect.any(String)
    });
  });

  it('удаляет ингредиент по id', () => {
    let state = reducer(initialState, addIngredient(main1));
    state = reducer(state, addIngredient(main2));

    expect(state.ingredients).toHaveLength(2);

    const idToRemove = state.ingredients[0].id;
    const stateAfterRemove = reducer(state, removeIngredient(idToRemove));

    expect(stateAfterRemove.ingredients).toHaveLength(1);
    expect(stateAfterRemove.ingredients[0].id).not.toBe(idToRemove);
  });

  it('меняет порядок ингредиентов в начинке', () => {
    let state = reducer(initialState, addIngredient(main1));
    state = reducer(state, addIngredient(main2));
    const main3: TIngredient = { ...main1, _id: 'main-3', name: 'Начинка 3' };
    state = reducer(state, addIngredient(main3));

    expect(state.ingredients).toHaveLength(3);
    const idsBefore = state.ingredients.map((item) => item.id);

    const stateAfterMove = reducer(state, moveIngredient({ from: 0, to: 2 }));

    const idsAfter = stateAfterMove.ingredients.map((item) => item.id);

    expect(idsAfter).toEqual([idsBefore[1], idsBefore[2], idsBefore[0]]);
  });

  it('очищает конструктор', () => {
    let state = reducer(initialState, addIngredient(bun));
    state = reducer(state, addIngredient(main1));

    const cleared = reducer(state, clearConstructor());

    expect(cleared).toEqual(initialState);
  });
});
