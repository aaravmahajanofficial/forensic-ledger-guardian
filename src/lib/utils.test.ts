import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('merges simple classes', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
  });

  it('resolves tailwind class conflicts', () => {
    // Tailwind-merge should remove 'p-4' because 'p-2' overrides it
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('handles falsy values', () => {
    expect(cn('class1', null, undefined, false, 0, '')).toBe('class1');
  });

  it('handles arrays', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
    expect(cn(['class1'], ['class2'])).toBe('class1 class2');
  });

  it('handles complex combinations', () => {
    expect(
      cn(
        'base-class',
        true && 'active-class',
        { 'conditional-class': true, 'ignored-class': false },
        ['array-class1', 'array-class2'],
        'p-4',
        'p-2'
      )
    ).toBe('base-class active-class conditional-class array-class1 array-class2 p-2');
  });
});
