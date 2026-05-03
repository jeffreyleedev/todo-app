import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('should merge class names into a single string', () => {
    expect(cn('bg-red', 'text-white')).toBe('bg-red text-white');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');
  });

  it('should filter out falsy values', () => {
    const shouldHide = false;
    expect(cn('base', shouldHide && 'hidden', undefined, null, 'visible')).toBe(
      'base visible'
    );
  });

  it('should merge tailwind classes (later wins)', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('should handle array inputs', () => {
    expect(cn(['class-a', 'class-b'], 'class-c')).toBe(
      'class-a class-b class-c'
    );
  });

  it('should handle object inputs', () => {
    expect(cn({ active: true, hidden: false })).toBe('active');
  });

  it('should return empty string when given no arguments', () => {
    expect(cn()).toBe('');
  });
});
