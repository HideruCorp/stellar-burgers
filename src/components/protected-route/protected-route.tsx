import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import {
  selectIsAuthenticated,
  selectIsAuthChecked
} from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  forUnauthorized?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  forUnauthorized = false,
  children
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!forUnauthorized && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (forUnauthorized && isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};
