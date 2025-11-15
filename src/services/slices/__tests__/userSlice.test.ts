import reducer, {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  setAuthChecked,
  UserState
} from '../userSlice';
import { TUser } from '@utils-types';

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loading: false,
  error: null
};

const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

describe('userSlice', () => {
  describe('setAuthChecked', () => {
    it('устанавливает isAuthChecked в true', () => {
      const state = reducer(initialState, setAuthChecked());

      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('registerUser', () => {
    it('ставит loading=true при registerUser.pending', () => {
      const action = registerUser.pending('request-id', {
        email: 'test@example.com',
        name: 'Test',
        password: '123456'
      });
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('записывает пользователя и устанавливает флаги при registerUser.fulfilled', () => {
      const action = registerUser.fulfilled(mockUser, 'request-id', {
        email: 'test@example.com',
        name: 'Test',
        password: '123456'
      });
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('записывает ошибку при registerUser.rejected', () => {
      const error = new Error('Registration failed');
      const action = registerUser.rejected(error, 'request-id', {
        email: 'test@example.com',
        name: 'Test',
        password: '123456'
      });
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Registration failed');
      expect(state.user).toBeNull();
    });
  });

  describe('loginUser', () => {
    it('ставит loading=true при loginUser.pending', () => {
      const action = loginUser.pending('request-id', {
        email: 'test@example.com',
        password: '123456'
      });
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('записывает пользователя и устанавливает флаги при loginUser.fulfilled', () => {
      const action = loginUser.fulfilled(mockUser, 'request-id', {
        email: 'test@example.com',
        password: '123456'
      });
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('записывает ошибку и устанавливает isAuthChecked при loginUser.rejected', () => {
      const error = new Error('Login failed');
      const action = loginUser.rejected(error, 'request-id', {
        email: 'test@example.com',
        password: '123456'
      });
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Login failed');
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
    });
  });

  describe('getUser', () => {
    it('ставит loading=true при getUser.pending', () => {
      const action = getUser.pending('request-id', undefined);
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('записывает пользователя и устанавливает флаги при getUser.fulfilled', () => {
      const action = getUser.fulfilled(mockUser, 'request-id', undefined);
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('записывает ошибку и сбрасывает аутентификацию при getUser.rejected', () => {
      const error = new Error('Failed to fetch user');
      const action = getUser.rejected(error, 'request-id', undefined);
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch user');
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('ставит loading=true при updateUser.pending', () => {
      const action = updateUser.pending('request-id', {
        email: 'new@example.com'
      });
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('обновляет данные пользователя при updateUser.fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = updateUser.fulfilled(updatedUser, 'request-id', {
        name: 'Updated Name'
      });
      const state = reducer(stateWithUser, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(updatedUser);
    });

    it('записывает ошибку при updateUser.rejected', () => {
      const error = new Error('Failed to update user');
      const action = updateUser.rejected(error, 'request-id', {});
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to update user');
    });
  });

  describe('logoutUser', () => {
    it('ставит loading=true при logoutUser.pending', () => {
      const action = logoutUser.pending('request-id', undefined);
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('очищает данные пользователя при logoutUser.fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const action = logoutUser.fulfilled(undefined, 'request-id', undefined);
      const state = reducer(stateWithUser, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('записывает ошибку при logoutUser.rejected', () => {
      const error = new Error('Logout failed');
      const action = logoutUser.rejected(error, 'request-id', undefined);
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Logout failed');
    });
  });
});
