import reducer, {
  fetchFeeds,
  fetchUserOrders,
  OrderFeedState
} from '../feedSlice';
import { TOrder } from '@utils-types';

const initialState: OrderFeedState = {
  general: {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  },
  profile: {
    orders: [],
    loading: false,
    error: null
  }
};

const mockOrders: TOrder[] = [
  {
    _id: 'order-1',
    status: 'done',
    name: 'Бургер 1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 100,
    ingredients: ['ing-1', 'ing-2']
  },
  {
    _id: 'order-2',
    status: 'pending',
    name: 'Бургер 2',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    number: 101,
    ingredients: ['ing-3', 'ing-4']
  }
];

describe('feedSlice', () => {
  describe('fetchFeeds (публичная лента)', () => {
    it('ставит loading=true при fetchFeeds.pending', () => {
      const action = fetchFeeds.pending('request-id', undefined);
      const state = reducer(initialState, action);

      expect(state.general.loading).toBe(true);
      expect(state.general.error).toBeNull();
    });

    it('записывает данные ленты и снимает loading при fetchFeeds.fulfilled', () => {
      const payload = {
        success: true,
        orders: mockOrders,
        total: 1000,
        totalToday: 50
      };
      const action = fetchFeeds.fulfilled(payload, 'request-id', undefined);
      const state = reducer(initialState, action);

      expect(state.general.loading).toBe(false);
      expect(state.general.error).toBeNull();
      expect(state.general.orders).toEqual(mockOrders);
      expect(state.general.total).toBe(1000);
      expect(state.general.totalToday).toBe(50);
    });

    it('записывает ошибку и снимает loading при fetchFeeds.rejected', () => {
      const error = new Error('Failed to fetch feeds');
      const action = fetchFeeds.rejected(error, 'request-id', undefined);
      const state = reducer(initialState, action);

      expect(state.general.loading).toBe(false);
      expect(state.general.error).toBe('Failed to fetch feeds');
      expect(state.general.orders).toEqual([]);
    });
  });

  describe('fetchUserOrders (история пользователя)', () => {
    it('ставит loading=true при fetchUserOrders.pending', () => {
      const action = fetchUserOrders.pending('request-id', undefined);
      const state = reducer(initialState, action);

      expect(state.profile.loading).toBe(true);
      expect(state.profile.error).toBeNull();
    });

    it('записывает заказы пользователя и снимает loading при fetchUserOrders.fulfilled', () => {
      const action = fetchUserOrders.fulfilled(
        mockOrders,
        'request-id',
        undefined
      );
      const state = reducer(initialState, action);

      expect(state.profile.loading).toBe(false);
      expect(state.profile.error).toBeNull();
      expect(state.profile.orders).toEqual(mockOrders);
    });

    it('записывает ошибку и снимает loading при fetchUserOrders.rejected', () => {
      const error = new Error('Failed to fetch user orders');
      const action = fetchUserOrders.rejected(error, 'request-id', undefined);
      const state = reducer(initialState, action);

      expect(state.profile.loading).toBe(false);
      expect(state.profile.error).toBe('Failed to fetch user orders');
      expect(state.profile.orders).toEqual([]);
    });
  });
});
