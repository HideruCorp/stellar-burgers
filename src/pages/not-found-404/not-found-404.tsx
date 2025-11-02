import { FC } from 'react';
import styles from './not-found.module.css';

export const NotFound404: FC = () => (
  <main className={styles.container}>
    <h3 className={`pb-6 text text_type_main-large`}>
      Страница не найдена. Ошибка 404.
    </h3>
  </main>
);
