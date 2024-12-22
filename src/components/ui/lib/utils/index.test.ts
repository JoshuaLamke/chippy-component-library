import { describe, it, expect } from 'vitest';
import { omit, format } from '.';

describe('utils/index/omit', () => {
  it('should omit specified keys from the object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, ['b']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('should return the same object if no keys are specified', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, []);
    expect(result).toEqual(obj);
  });

  it('should handle non-existent keys gracefully', () => {
    const obj = { a: 1, b: 2 };
    const result = omit(obj, ['c' as keyof typeof obj] );
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should not modify the original object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, ['a']);
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    expect(result).not.toBe(obj);
  });
});

describe('utils/index/format', () => {
  it('should coerce string replacement into replacement obj when string is given', () => {
    const input = '12345';
    const options = { mask: '0000-0000', replacement: '0' };
    const result = format(input, options);
    expect(result).toEqual('1234-5');
  });

  it('should format input based on custom replacement patterns', () => {
    const input = '1a2b3c';
    const options = {
      mask: '0X-0X-0X',
      replacement: {
        X: /[A-Za-z]/,
        0: /\d/,
      },
    };
    const result = format(input, options);
    expect(result).toEqual('1a-2b-3c');
  });

  it('should handle input shorter than the mask when showMask is true', () => {
    const input = '12';
    const options = { mask: '____-____', replacement: '_', showMask: true };
    const result = format(input, options);
    expect(result).toEqual('12__-____');
  });

  it('should remove trailing characters if separate is true and showMask is false', () => {
    const input = '1234_56_';
    const options = {
      mask: '____-____',
      replacement: '_',
      separate: true,
      showMask: false,
    };
    const result = format(input, options);
    expect(result).toEqual('1234-_56');
  });

  it('should handle an empty input - showmask', () => {
    const input = '';
    const options = { mask: '____-____', replacement: '_', showMask: true };
    const result = format(input, options);
    expect(result).toEqual('____-____');
  });

  it('should handle an empty input - hidemask', () => {
    const input = '';
    const options = { mask: '____-____', replacement: '_' };
    const result = format(input, options);
    expect(result).toEqual('');
  });
});