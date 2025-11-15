import type { UnknownAction } from '@reduxjs/toolkit';
import store, { rootReducer } from '../store';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние для неизвестного экшена', () => {
    const initialStateFromReducer = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    } as UnknownAction);

    const initialStateFromStore = store.getState();

    expect(initialStateFromReducer).toEqual(initialStateFromStore);
  });
});
