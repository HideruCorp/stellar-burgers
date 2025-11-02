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

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCreationState(state) {
      state.create.order = null;
      state.create.error = null;
    },
    clearDetailsState(state) {
      state.details.order = null;
      state.details.error = null;
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

export default orderSlice.reducer;
