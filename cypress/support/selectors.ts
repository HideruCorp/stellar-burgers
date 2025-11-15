/**
 * Cypress data-cy селекторы
 * Все data-cy селекторы для тестов
 */

import {
  MODAL_SELECTOR,
  MODAL_TITLE_SELECTOR,
  MODAL_CLOSE_SELECTOR,
  MODAL_OVERLAY_SELECTOR
} from '../../src/components/ui/modal/modal.selectors';

export const MODAL = `[data-cy="${MODAL_SELECTOR}"]`;
export const MODAL_TITLE = `[data-cy="${MODAL_TITLE_SELECTOR}"]`;
export const MODAL_CLOSE = `[data-cy="${MODAL_CLOSE_SELECTOR}"]`;
export const MODAL_OVERLAY = `[data-cy="${MODAL_OVERLAY_SELECTOR}"]`;