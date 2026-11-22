import { describe, it, expect } from 'vitest';
import {
  calculateCartTotal,
  calculateCartItemCount,
  formatPricePLN,
  cartRequiresPermit,
  buildOrderPayload,
  extractOrderErrorMessage,
} from './cartUtils';

describe('cartUtils', () => {
  const accessory = {
    id: 10,
    name: 'Ochronniki słuchu',
    price: 299.5,
    image_url: null,
    requires_permit: false,
    in_stock: 5,
    quantity: 2,
  };

  const firearm = {
    id: 1,
    name: 'MPS ARMY',
    price: 2990,
    image_url: null,
    requires_permit: true,
    in_stock: 3,
    quantity: 1,
  };

  describe('calculateCartTotal', () => {
    it('zwraca 0 dla pustego koszyka', () => {
      expect(calculateCartTotal([])).toBe(0);
    });

    it('poprawnie sumuje ceny wielu pozycji z różnymi ilościami', () => {
      expect(calculateCartTotal([accessory, firearm])).toBe(3589);
    });

    it('unika błędów zmiennoprzecinkowych przy groszach', () => {
      const items = [
        { price: 0.1, quantity: 1 },
        { price: 0.2, quantity: 1 },
      ];
      expect(calculateCartTotal(items)).toBe(0.3);
    });
  });

  describe('calculateCartItemCount', () => {
    it('zlicza łączną liczbę sztuk w koszyku', () => {
      expect(calculateCartItemCount([accessory, firearm])).toBe(3);
    });
  });

  describe('formatPricePLN', () => {
    it('formatuje kwoty z separatorem tysięcy i dwoma miejscami po przecinku', () => {
      expect(formatPricePLN(0)).toBe('0,00 zł');
      expect(formatPricePLN(59)).toBe('59,00 zł');
      expect(formatPricePLN(4500)).toBe('4 500,00 zł');
      expect(formatPricePLN(12345.678)).toBe('12 345,68 zł');
    });
  });

  describe('cartRequiresPermit', () => {
    it('zwraca false, gdy żaden produkt nie wymaga pozwolenia', () => {
      expect(cartRequiresPermit([])).toBe(false);
      expect(cartRequiresPermit([accessory])).toBe(false);
    });

    it('zwraca true, gdy w koszyku jest przynajmniej jeden produkt z wymogiem promesy', () => {
      expect(cartRequiresPermit([accessory, firearm])).toBe(true);
    });
  });

  describe('buildOrderPayload', () => {
    it('mapuje pozycje koszyka na minimalny payload API', () => {
      expect(buildOrderPayload([firearm, accessory], true)).toEqual({
        items: [
          { product_id: 1, quantity: 1 },
          { product_id: 10, quantity: 2 },
        ],
        has_permit_statement: true,
      });
    });

    it('wymusza has_permit_statement: false, gdy koszyk nie zawiera towarów na pozwolenie', () => {
      expect(buildOrderPayload([accessory], true)).toEqual({
        items: [{ product_id: 10, quantity: 2 }],
        has_permit_statement: false,
      });
    });
  });

  describe('extractOrderErrorMessage', () => {
    it('zwraca treść detail z odpowiedzi 400 Bad Request', () => {
      const err = {
        response: { data: { detail: 'Wymagane oświadczenie o posiadaniu promesy.' } },
      };
      expect(extractOrderErrorMessage(err)).toBe(
        'Wymagane oświadczenie o posiadaniu promesy.'
      );
    });

    it('łączy błędy walidacji 422 z tablicy detail', () => {
      const err = {
        response: {
          data: { detail: [{ msg: 'Pole items nie może być puste' }] },
        },
      };
      expect(extractOrderErrorMessage(err)).toBe('Pole items nie może być puste');
    });
  });
});