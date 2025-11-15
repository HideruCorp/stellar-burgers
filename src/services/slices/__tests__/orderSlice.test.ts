import reducer, {
  createOrder,
  fetchOrderByNumber,
  clearCreationState,
  clearDetailsState
} from '../orderSlice';
import { TOrder } from '@utils-types';

const initialState = {
  create: {
    order: null,
    loading: false,
    error: null
  },
  details: {
    order: null,
    loading: false,
    error: null
  }
};

const mockOrder: TOrder = {
  _id: 'order-id-1',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['ing-1', 'ing-2']
};

describe('orderSlice', () => {
  describe('createOrder', () => {
    it('ставит loading=true при createOrder.pending', () => {
      const action = createOrder.pending('request-id', ['ing-1', 'ing-2']);
      const state = reducer(initialState, action);

      expect(state.create.loading).toBe(true);
      expect(state.create.error).toBeNull();
      expect(state.create.order).toBeNull();
    });

    it('записывает данные заказа и снимает loading при createOrder.fulfilled', () => {
      const action = createOrder.fulfilled(mockOrder, 'request-id', [
        'ing-1',
        'ing-2'
      ]);
      const state = reducer(initialState, action);

      expect(state.create.loading).toBe(false);
      expect(state.create.error).toBeNull();
      expect(state.create.order).toEqual(mockOrder);
    });

    it('записывает ошибку и снимает loading при createOrder.rejected', () => {
      const error = new Error('Failed to create order');
      const action = createOrder.rejected(error, 'request-id', [
        'ing-1',
        'ing-2'
      ]);
      const state = reducer(initialState, action);

      expect(state.create.loading).toBe(false);
      expect(state.create.error).toBe('Failed to create order');
      expect(state.create.order).toBeNull();
    });
  });

  describe('fetchOrderByNumber', () => {
    it('ставит loading=true при fetchOrderByNumber.pending', () => {
      const action = fetchOrderByNumber.pending('request-id', 12345);
      const state = reducer(initialState, action);

      expect(state.details.loading).toBe(true);
      expect(state.details.error).toBeNull();
      expect(state.details.order).toBeNull();
    });

    it('записывает данные заказа и снимает loading при fetchOrderByNumber.fulfilled', () => {
      const action = fetchOrderByNumber.fulfilled(
        mockOrder,
        'request-id',
        12345
      );
      const state = reducer(initialState, action);

      expect(state.details.loading).toBe(false);
      expect(state.details.error).toBeNull();
      expect(state.details.order).toEqual(mockOrder);
    });

    it('записывает ошибку и снимает loading при fetchOrderByNumber.rejected', () => {
      const error = new Error('Failed to fetch order');
      const action = fetchOrderByNumber.rejected(error, 'request-id', 12345);
      const state = reducer(initialState, action);

      expect(state.details.loading).toBe(false);
      expect(state.details.error).toBe('Failed to fetch order');
      expect(state.details.order).toBeNull();
    });
  });

  describe('clearCreationState', () => {
    it('очищает состояние создания заказа', () => {
      const stateWithOrder = {
        ...initialState,
        create: {
          order: mockOrder,
          loading: false,
          error: null
        }
      };

      const state = reducer(stateWithOrder, clearCreationState());

      expect(state.create).toEqual({
        order: null,
        loading: false,
        error: null
      });
    });
  });

  describe('clearDetailsState', () => {
    it('очищает состояние деталей заказа', () => {
      const stateWithDetails = {
        ...initialState,
        details: {
          order: mockOrder,
          loading: false,
          error: null
        }
      };

      const state = reducer(stateWithDetails, clearDetailsState());

      expect(state.details).toEqual({
        order: null,
        loading: false,
        error: null
      });
    });
  });
});
