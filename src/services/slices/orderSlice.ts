import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import type { RootState } from '../store';

type OrderDetailsState = {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
};

interface OrderState {
  create: OrderDetailsState;
  details: OrderDetailsState;
}

const initialState: OrderState = {
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

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order as TOrder;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (response.success && response.orders.length > 0) {
      return response.orders[0] as TOrder;
    }
    throw new Error('Order not found');
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCreationState(state) {
      state.create.order = null;
      state.create.error = null;
      state.create.loading = false;
    },
    clearDetailsState(state) {
      state.details.order = null;
      state.details.error = null;
      state.details.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Создание заказа
      .addCase(createOrder.pending, (state) => {
        state.create.loading = true;
        state.create.order = null;
        state.create.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.error.message || 'Failed to create order';
      })

      // Детали заказа
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.details.loading = true;
        state.details.order = null;
        state.details.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.details.loading = false;
        state.details.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.details.loading = false;
        state.details.error = action.error.message || 'Failed to fetch order';
      });
  }
});

export const { clearCreationState, clearDetailsState } = orderSlice.actions;

// Селекторы
export const selectCreationOrder = (state: RootState) =>
  state.order.create.order;
export const selectCreationProcessing = (state: RootState) =>
  state.order.create.loading;
export const selectCreationError = (state: RootState) =>
  state.order.create.error;

export const selectOrderDetails = (state: RootState) =>
  state.order.details.order;
export const selectOrderDetailsLoading = (state: RootState) =>
  state.order.details.loading;
export const selectOrderDetailsError = (state: RootState) =>
  state.order.details.error;

export default orderSlice.reducer;
