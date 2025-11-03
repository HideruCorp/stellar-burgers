import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrdersApi } from '@api';
import type { RootState } from '../store';

type OrderHistoryState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

type PublicFeedState = OrderHistoryState & {
  total: number;
  totalToday: number;
};

export interface OrderFeedState {
  general: PublicFeedState;
  profile: OrderHistoryState;
}

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

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const fetchUserOrders = createAsyncThunk(
  'feed/fetchUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Публичная лента
      .addCase(fetchFeeds.pending, (state) => {
        state.general.loading = true;
        state.general.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.general.loading = false;
        state.general.orders = action.payload.orders;
        state.general.total = action.payload.total;
        state.general.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.general.loading = false;
        state.general.error = action.error.message || 'Failed to fetch feeds';
      })

      // История пользователя
      .addCase(fetchUserOrders.pending, (state) => {
        state.profile.loading = true;
        state.profile.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.profile.loading = false;
        state.profile.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.profile.loading = false;
        state.profile.error =
          action.error.message || 'Failed to fetch user orders';
      });
  }
});

// Селекторы: явная привязка к каналу
export const selectFeedOrders = (state: RootState) => state.feed.general.orders;
export const selectFeedTotal = (state: RootState) => state.feed.general.total;
export const selectFeedTotalToday = (state: RootState) =>
  state.feed.general.totalToday;
export const selectFeedLoading = (state: RootState) =>
  state.feed.general.loading;
export const selectFeedError = (state: RootState) => state.feed.general.error;

export const selectProfileOrders = (state: RootState) =>
  state.feed.profile.orders;
export const selectProfileLoading = (state: RootState) =>
  state.feed.profile.loading;
export const selectProfileError = (state: RootState) =>
  state.feed.profile.error;

// Удобный селектор для страницы /feed (совместим с текущим использованием)
export const selectFeed = (state: RootState) => ({
  orders: state.feed.general.orders,
  loading: state.feed.general.loading
});

export default feedSlice.reducer;
