import reducer, {
  fetchIngredients,
  IngredientsState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Ингредиент 1',
    type: 'bun',
    proteins: 1,
    fat: 2,
    carbohydrates: 3,
    calories: 100,
    price: 50,
    image: 'img1.png',
    image_large: 'img1-large.png',
    image_mobile: 'img1-mobile.png'
  },
  {
    _id: '2',
    name: 'Ингредиент 2',
    type: 'main',
    proteins: 4,
    fat: 5,
    carbohydrates: 6,
    calories: 200,
    price: 100,
    image: 'img2.png',
    image_large: 'img2-large.png',
    image_mobile: 'img2-mobile.png'
  }
];

describe('ingredientsSlice', () => {
  it('ставит loading=true при fetchIngredients.pending', () => {
    const action = fetchIngredients.pending('request-id', undefined);
    const state = reducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  it('записывает данные и снимает loading при fetchIngredients.fulfilled', () => {
    const action = fetchIngredients.fulfilled(
      mockIngredients,
      'request-id',
      undefined
    );
    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('записывает ошибку и снимает loading при fetchIngredients.rejected', () => {
    const error = new Error('Network error');
    const action = fetchIngredients.rejected(error, 'request-id', undefined);
    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
    expect(state.ingredients).toEqual([]);
  });
});
