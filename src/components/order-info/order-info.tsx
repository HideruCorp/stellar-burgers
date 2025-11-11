import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  selectOrderDetails,
  selectOrderDetailsError,
  selectOrderDetailsLoading
} from '../../services/slices/orderSlice';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';

type OrderInfoProps = {
  showOrderNumber?: boolean;
};

export const OrderInfo: FC<OrderInfoProps> = ({ showOrderNumber = true }) => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector(selectOrderDetails);
  const orderLoading = useSelector(selectOrderDetailsLoading);
  const orderError = useSelector(selectOrderDetailsError);

  const ingredients = useSelector(selectIngredients);
  const ingredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }

    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, ingredients.length]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (orderLoading || ingredientsLoading) {
    return <Preloader />;
  }

  if (!orderInfo || orderError) {
    return <p className={`pt-6 text text_type_main-medium`}>Заказ не найден</p>;
  }

  return (
    <OrderInfoUI orderInfo={orderInfo!} showOrderNumber={showOrderNumber} />
  );
};
