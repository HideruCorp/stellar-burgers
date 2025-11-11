import { TOrder } from '@utils-types';

export type FeedTotals = {
  orders?: TOrder[];
  total: number;
  totalToday: number;
  isLoading?: boolean;
  error?: string | null;
};

export type FeedInfoUIProps = {
  feed: FeedTotals;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
