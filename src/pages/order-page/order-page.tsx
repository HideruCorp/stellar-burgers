import { FC } from 'react';
import { OrderInfo } from '@components';
import styles from './order-page.module.css';

export const OrderPage: FC = () => (
  <main className={styles.container}>
    <h1 className={`${styles.title} text text_type_main-large`}>
      Детали заказа
    </h1>
    <OrderInfo />
  </main>
);
