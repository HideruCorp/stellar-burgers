import { FC, ReactElement } from 'react';

export const ProtectedRoute: FC<{
  forUnauthorized?: boolean;
  children: ReactElement;
}> = ({ children }) => children;
